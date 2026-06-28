import { useCallback, useEffect, useState } from 'react';
import { desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/core/db/client';
import { trips, type Trip } from '@/core/db/schema';

function uuid() {
  // RFC4122 v4 léger (suffisant côté client ; le serveur a sa propre génération).
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Liste réactive des voyages du foyer, lue depuis la base LOCALE. */
export function useTrips() {
  const [data, setData] = useState<Trip[]>([]);

  const refresh = useCallback(() => {
    const rows = db.select().from(trips).where(isNull(trips.deletedAt)).orderBy(desc(trips.startDate)).all();
    setData(rows);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTrip = useCallback(
    (input: { householdId: string; title: string; startDate?: string; endDate?: string }) => {
      const now = new Date().toISOString();
      db.insert(trips)
        .values({
          id: uuid(),
          householdId: input.householdId,
          title: input.title,
          startDate: input.startDate,
          endDate: input.endDate,
          status: 'planning',
          currency: 'EUR',
          createdAt: now,
          updatedAt: now,
          dirty: 1,
        })
        .run();
      refresh();
    },
    [refresh],
  );

  const softDelete = useCallback(
    (id: string) => {
      const now = new Date().toISOString();
      db.update(trips).set({ deletedAt: now, updatedAt: now, dirty: 1 }).where(eq(trips.id, id)).run();
      refresh();
    },
    [refresh],
  );

  return { trips: data, refresh, createTrip, softDelete };
}
