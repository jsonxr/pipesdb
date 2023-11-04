import DatabaseConstructor, {
  type Database,
  type Statement,
} from 'better-sqlite3';
import { type Storage, type StorageRow } from '../types.js';

const DDL = `
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY NOT NULL,
  key TEXT NOT NULL,
  pk TEXT NOT NULL,
  value TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_pk_key ON messages (pk, key);
CREATE INDEX IF NOT EXISTS idx_messages_pk_id ON messages (pk, id);

CREATE TABLE IF NOT EXISTS compacted (
  pk TEXT NOT NULL,
  key TEXT PRIMARY KEY NOT NULL,
  id TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_compacted_pk_key ON compacted (pk, key);
`;

const INSERT_SQL =
  'INSERT OR REPLACE INTO messages (id, key, pk, value) VALUES (?, ?, ?, ?);';
const INSERT_COMPACTED_SQL =
  'INSERT OR REPLACE INTO compacted (id, key, pk) VALUES (?, ?, ?);';

const SELECT_SQL = 'SELECT id, key, pk, value FROM messages WHERE pk = ?';
const SELECT_COMPACTED = `
  SELECT m.id, m.key, m.pk, m.value
  FROM compacted c
  JOIN messages m on (m.id = c.id AND m.pk = c.pk)
  WHERE c.pk = ?`;

export class SqliteStorage implements Storage {
  #db: Database;
  #insert: Statement<[string, string, string, string]>;
  #insertCompacted: Statement<[string, string, string]>;
  #list: Statement<[string]>;
  #selectCompacted: Statement<[string]>;

  constructor(filename: string, options?: DatabaseConstructor.Options) {
    this.#db = new DatabaseConstructor(filename, options);
    this.#db.exec(DDL);
    this.#insert = this.#db.prepare(INSERT_SQL);
    this.#insertCompacted = this.#db.prepare(INSERT_COMPACTED_SQL);
    this.#list = this.#db.prepare(SELECT_SQL);
    this.#selectCompacted = this.#db.prepare(SELECT_COMPACTED);
  }

  async put<T>(value: StorageRow<T>, compacted: boolean) {
    const str = JSON.stringify(value);
    this.#db.transaction(() => {
      this.#insert.run(value.$id, value.$key, value.$pk, str);
      if (compacted) {
        this.#insertCompacted.run(value.$id, value.$key, value.$pk);
      }
    })();
  }

  async list<T>($pk: string, compacted: boolean): Promise<T[]> {
    const results = compacted
      ? this.#selectCompacted.all($pk)
      : this.#list.all($pk);
    return results as T[];
  }
}
