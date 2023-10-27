import { type Schema } from './Schema.js';
import { type SyncEvent } from './SyncEvent.js';

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
