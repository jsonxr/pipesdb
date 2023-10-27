import { PipeObjectEventFilter, PipeObjectEventHandler } from './PipeObjectEmitter';

export type IStorageObject = {
  ulid: string;
  synced: boolean;
  value: string;
};
export type IStorage = {
  open(): Promise<void>;
  close(): Promise<void>;
  set<T>(path: string, key: string, value: T): Promise<void>;
  get<T>(path: string, key: string): Promise<T | undefined>;
  list<T>(path: string): Promise<T[]>;
};

// This is the source of the data (aka server)
export interface ISource {}

export type PipeOptions = {
  sync?: string;
  partition?: string;
  offline?: boolean; // If this is true, the data will be available offline
};
export interface IPipesClient {
  source: ISource;
  storage: IStorage;
  open(): Promise<void>;
  close(): Promise<void>;
  get<T extends object>(path: string, options?: PipeOptions): IPipe<T>;
}

export type IPipe<T extends object = any> = {
  subscribe(listener: PipeObjectEventHandler<T>, filter?: PipeObjectEventFilter<T> | undefined): NotifyFn;
};

export type NotifyFn = () => void;

export type IEvent = {
  path: string;
  key: string;
  value: any;
};

export interface IEmitter {
  subscribe(listener?: (ev: IEvent) => void, filter?: (ev: IEvent) => boolean): () => void;
}
