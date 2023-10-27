import { SyncEvent } from './SyncEvent.js';

export interface StorageRow<T> {
  $pk: string; // partition key
  $key: string; // user provided key
  $id: string; // uuidv7
  value: T; // json string representing object
}

export interface Storage {
  put<T>(value: SyncEvent<T>, compacted: boolean): Promise<void>;
  list<T>($pk: string, compacted: boolean): Promise<T[]>;
}
