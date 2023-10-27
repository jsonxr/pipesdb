import { ulid } from 'ws-routable';

const TTL_24HRS = 1000 * 60 * 60 * 24;

export type Row<T = any> = {
  id: string;
  pk: string;
  sk: string;
  ttl?: number; // If this is set, then we will remove from our map eventually. useful for deletes
  value: T | null; // null=tombstone
};

export type Rows = Record<string, Row>;
export type IServerStorage = {
  open(): Promise<void>;
  close(): Promise<void>;
  set<T>(pk: string, sk: string, value: T): Promise<Row<T>>;
  get<T>(pk: string, sk: string): Promise<Row<T> | undefined>;
  del(pk: string, sk: string): Promise<Row<unknown> | undefined>;
  query<T>(path: string, sk?: string): Promise<Row<T>[]>;
};

export class MemoryStorage implements IServerStorage {
  data: Map<string, Rows> = new Map();
  constructor() {}

  // noop
  async open() {}
  // noop
  async close() {}

  async set<T>(pk: string, sk: string, value: T): Promise<Row<T>> {
    const rows = this.data.get(pk) ?? {};
    this.data.set(pk, rows); // Always make sure we have that pk in our map
    const row: Row<T> = { id: ulid(), pk, sk, value };
    rows[sk] = row;
    return row;
  }

  async get<T>(pk: string, sk: string): Promise<Row<T> | undefined> {
    const rows = this.data.get(pk) ?? {};
    return rows[sk];
  }

  async del(pk: string, sk: string): Promise<Row<null> | undefined> {
    const rows = this.data.get(pk) ?? {};
    if (!rows[sk]) {
      return undefined;
    }

    const row: Row<null> = {
      id: ulid(),
      pk: pk,
      sk: sk,
      value: null,
      ttl: Date.now() + TTL_24HRS,
    };
    rows[sk] = row;
    return row;
  }

  async query<T = any>(pk: string, sk?: string): Promise<Row<T>[]> {
    const rows = this.data.get(pk) ?? {};
    const values = Object.values(rows).sort((a, b) => (a.sk > b.sk ? 1 : -1));
    return sk ? values.filter(row => row.sk.startsWith(sk)) : values;
  }
}
