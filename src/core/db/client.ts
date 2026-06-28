import { Platform } from 'react-native';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

/**
 * Base locale ouverte en mode synchrone. C'est la source de vérité que lit
 * l'UI : aucune requête réseau dans le chemin de rendu (cf. docs/03).
 *
 * SQLite natif n'existe pas en web (preview navigateur) : on dégrade alors
 * vers un fallback en mémoire côté hooks (cf. localDbAvailable). La cible
 * réelle de l'app est mobile (Expo Go / build natif).
 */
let expoDb: SQLiteDatabase | null = null;
try {
  if (Platform.OS !== 'web') {
    expoDb = openDatabaseSync('voyage.db', { enableChangeListener: true });
  }
} catch (e) {
  console.warn('[Voyage] SQLite indisponible, fallback mémoire :', e);
}

export const localDbAvailable = expoDb != null;
export const db = expoDb ? drizzle(expoDb, { schema }) : null;

/**
 * Création des tables au démarrage. À remplacer par drizzle-kit migrations
 * dès que le schéma se stabilise (Phase 1).
 */
export function initLocalDb() {
  if (!expoDb) return;
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY NOT NULL,
      household_id TEXT NOT NULL,
      title TEXT NOT NULL,
      cover_url TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT NOT NULL DEFAULT 'planning',
      budget_total REAL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      created_at TEXT NOT NULL DEFAULT (current_timestamp),
      updated_at TEXT NOT NULL DEFAULT (current_timestamp),
      deleted_at TEXT,
      dirty INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS itinerary_items (
      id TEXT PRIMARY KEY NOT NULL,
      trip_id TEXT NOT NULL,
      day_date TEXT,
      place_id TEXT,
      title TEXT NOT NULL,
      type TEXT,
      start_time TEXT,
      end_time TEXT,
      notes TEXT,
      cost REAL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
      created_at TEXT NOT NULL DEFAULT (current_timestamp),
      updated_at TEXT NOT NULL DEFAULT (current_timestamp),
      deleted_at TEXT,
      dirty INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS sync_state (
      table_name TEXT PRIMARY KEY NOT NULL,
      last_pulled_at TEXT
    );
  `);
}
