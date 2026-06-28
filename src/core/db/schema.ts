import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Schéma de la base LOCALE (SQLite via Drizzle). Miroir offline-first du
 * schéma Postgres (cf. docs/05). Chaque table porte les colonnes de sync :
 *  - updated_at : horloge logique pour le pull des deltas
 *  - deleted_at : soft-delete pour réconcilier les suppressions hors ligne
 *  - dirty      : 1 = modifié localement, à pousser au prochain sync
 */

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  householdId: text('household_id').notNull(),
  title: text('title').notNull(),
  coverUrl: text('cover_url'),
  startDate: text('start_date'), // ISO yyyy-mm-dd
  endDate: text('end_date'),
  status: text('status').notNull().default('planning'), // planning | ongoing | past
  budgetTotal: real('budget_total'),
  currency: text('currency').notNull().default('EUR'),
  // sync
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
  updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty').notNull().default(1),
});

export const itineraryItems = sqliteTable('itinerary_items', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').notNull(),
  dayDate: text('day_date'), // yyyy-mm-dd
  placeId: text('place_id'),
  title: text('title').notNull(),
  type: text('type'), // activite | transport | repas | hebergement
  startTime: text('start_time'),
  endTime: text('end_time'),
  notes: text('notes'),
  cost: real('cost'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdBy: text('created_by'),
  // sync
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
  updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty').notNull().default(1),
});

/** Métadonnées de synchronisation (dernière borne pull par table). */
export const syncState = sqliteTable('sync_state', {
  tableName: text('table_name').primaryKey(),
  lastPulledAt: text('last_pulled_at'),
});

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
export type ItineraryItem = typeof itineraryItems.$inferSelect;
