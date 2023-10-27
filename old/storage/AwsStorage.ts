import { IServerStorage } from './IServerStorage';

export class AwsStorage implements IServerStorage {
  constructor() {}
  async open() {}
  async close() {}
  async set<T>(pk: string, sk: string, value: T) {}
  async get<T>(pk: string, sk: string): Promise<T | undefined> {
    return;
  }
  async list<T>(pk: string, sk: string): Promise<T[]> {
    return [];
  }
}
