import { ISource } from '../types';

export type ISyncObject<T> = {
  path: string;
  key: string;
  id: string;
  value: T;
};

export class MemorySource implements ISource {
  constructor() {}
  sync(pk: string, sk: string) {}
}
