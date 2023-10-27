export type IServerStorage = {
  open(): Promise<void>;
  close(): Promise<void>;
  set<T>(pk: string, sk: string, value: T): Promise<void>;
  get<T>(pk: string, sk: string): Promise<T | undefined>;
  list<T>(path: string, sk: string): Promise<T[]>;
};
