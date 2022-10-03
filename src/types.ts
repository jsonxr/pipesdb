import { PipeEventFilter, PipeEventHandler } from './PipeEmitter';

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

export type IPipe<T extends object = any> = {
  subscribe(listener: PipeEventHandler<T>, filter?: PipeEventFilter<T> | undefined): NotifyFn;
};

export type NotifyFn = () => void;
