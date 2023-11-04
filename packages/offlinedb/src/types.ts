export interface Schema<T> {}

export type SyncEvent<T> = {
  $pk: string;
  $key: string | number;
  $id: string;
  value: T;
};

export type ResourceConfig<T> = {
  schema: Schema<T>;
  path: string;
  compacted?: boolean;
};

export type Resource<T> = {
  list: () => Promise<T[]>;
  get: (key?: string) => Promise<T>;
  put: (value: T) => Promise<SyncEvent<T>>;
  patch: (value: Partial<T>) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

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
