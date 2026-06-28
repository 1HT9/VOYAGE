import { useCallback, useEffect, useState } from 'react';
import { desc, eq, isNull } from 'drizzle-orm';
import { db, localDbAvailable } from '@/core/db/client';
import { trips, type Trip } from '@/core/db/schema';

function uuid() {
  // RFC4122 v4 léger (suffisant côté client ; le serveur a sa propre génération).
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Fallback en mémoire quand SQLite est indisponible (preview web).
let memoryTrips: Trip[] = [];

/** Liste réactive des voyages du foyer, lue depuis la base LOCALE. */
export function useTrips() {
  const [data, setData] = useState<Trip[]>([]);

  const refresh = useCallback(() => {
    if (localDbAvailable && db) {
      const rows = db.select().from(trips).where(isNull(trips.deletedAt)).orderBy(desc(trips.startDate)).all();
      setData(rows);
    } else {
      setData([...memoryTrips].filter((t) => !t.deletedAt));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTrip = useCallback(
    (input: { householdId: string; title: string; startDate?: string; endDate?: string }) => {
      const now = new Date().toISOString();
      const row: Trip = {
        id: uuid(),
        householdId: input.householdId,
        title: input.title,
        coverUrl: null,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        status: 'planning',
        budgetTotal: null,
        currency: 'EUR',
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        dirty: 1,
      };
      if (localDbAvailable && db) {
        db.insert(trips).values(row).run();
      } else {
        memoryTrips = [row, ...memoryTrips];
      }
      refresh();
    },
    [refresh],
  );

  const softDelete = useCallback(
    (id: string) => {
      const now = new Date().toISOString();
      if (localDbAvailable && db) {
        db.update(trips).set({ deletedAt: now, updatedAt: now, dirty: 1 }).where(eq(trips.id, id)).run();
      } else {
        memoryTrips = memoryTrips.map((t) => (t.id === id ? { ...t, deletedAt: now } : t));
      }
      refresh();
    },
    [refresh],
  );

  return { trips: data, refresh, createTrip, softDelete };
}
