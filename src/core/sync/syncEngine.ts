import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { trips, syncState } from '../db/schema';
import { supabase, isSupabaseConfigured } from '../supabase/client';

/**
 * Moteur de synchronisation minimal (Phase 0) — squelette à étoffer.
 *
 * Stratégie (cf. docs/03 §2) :
 *   1. PUSH : envoyer les lignes locales `dirty` vers Supabase (upsert).
 *   2. PULL : récupérer les lignes distantes modifiées depuis last_pulled_at.
 *   3. Réconciliation Last-Write-Wins par ligne (suffisant pour un couple).
 *
 * Ce squelette traite la table `trips` pour valider le flux de bout en bout.
 * Les autres tables suivront le même patron en Phase 1.
 */
export async function syncTrips(): Promise<{ pushed: number; pulled: number } | null> {
  if (!isSupabaseConfigured) return null;

  // 1) PUSH des lignes locales modifiées
  const dirtyRows = db.select().from(trips).where(eq(trips.dirty, 1)).all();
  let pushed = 0;
  if (dirtyRows.length > 0) {
    const payload = dirtyRows.map((r) => ({
      id: r.id,
      household_id: r.householdId,
      title: r.title,
      cover_url: r.coverUrl,
      start_date: r.startDate,
      end_date: r.endDate,
      status: r.status,
      budget_total: r.budgetTotal,
      currency: r.currency,
      updated_at: r.updatedAt,
      deleted_at: r.deletedAt,
    }));
    const { error } = await supabase.from('trips').upsert(payload);
    if (!error) {
      for (const r of dirtyRows) {
        db.update(trips).set({ dirty: 0 }).where(eq(trips.id, r.id)).run();
      }
      pushed = dirtyRows.length;
    }
  }

  // 2) PULL des deltas distants
  const state = db.select().from(syncState).where(eq(syncState.tableName, 'trips')).get();
  const since = state?.lastPulledAt ?? '1970-01-01T00:00:00Z';
  const { data: remote, error: pullErr } = await supabase
    .from('trips')
    .select('*')
    .gt('updated_at', since)
    .order('updated_at', { ascending: true });

  let pulled = 0;
  if (!pullErr && remote) {
    for (const r of remote) {
      // LWW : on n'écrase pas une version locale plus récente non encore poussée.
      const local = db.select().from(trips).where(eq(trips.id, r.id)).get();
      if (local && local.dirty === 1 && local.updatedAt > r.updated_at) continue;
      db.insert(trips)
        .values({
          id: r.id,
          householdId: r.household_id,
          title: r.title,
          coverUrl: r.cover_url,
          startDate: r.start_date,
          endDate: r.end_date,
          status: r.status,
          budgetTotal: r.budget_total,
          currency: r.currency,
          updatedAt: r.updated_at,
          deletedAt: r.deleted_at,
          dirty: 0,
        })
        .onConflictDoUpdate({
          target: trips.id,
          set: {
            title: r.title,
            coverUrl: r.cover_url,
            startDate: r.start_date,
            endDate: r.end_date,
            status: r.status,
            budgetTotal: r.budget_total,
            currency: r.currency,
            updatedAt: r.updated_at,
            deletedAt: r.deleted_at,
            dirty: 0,
          },
        })
        .run();
      pulled++;
    }
    const newest = remote.at(-1)?.updated_at ?? since;
    db.insert(syncState)
      .values({ tableName: 'trips', lastPulledAt: newest })
      .onConflictDoUpdate({ target: syncState.tableName, set: { lastPulledAt: newest } })
      .run();
  }

  return { pushed, pulled };
}
