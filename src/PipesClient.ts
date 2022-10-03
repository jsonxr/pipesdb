import { SocketSession } from 'ws-routable';
import { Pipe, PipeOptions } from './Pipe';
import { IStorage } from './types';

export type Schema = {
  path: string;
  offline?: boolean;

  // TODO: Is this a hard limit? Can we paginate past it?
  limit?: number; // The maximum number of objects to store in cache. What do we do if we are paginating past this limit?

  // TODO: What do we do if we paginate to the n+1 record? Do we throw away or do we temporarily keep since we already have it?
  // max?: number;

  schema: any;
};
export type PipesConfig = {
  url: string;
  schemas?: Schema[];
  inMemory?: boolean;
  storage: IStorage;
};

export class PipesClient {
  session: SocketSession | null = null;

  constructor(public readonly config: PipesConfig) {}

  get<T extends object>(path: string, options?: PipeOptions): Pipe<T> {
    return new Pipe<T>(this.config.storage, path, options);
  }

  async open() {
    return this.config.storage.open();
    // const webSocket = new WebSocket(this.config.url);
    // this.session = new SocketSession(webSocket);
    // await this.session.connect();
  }
  async close() {
    return this.config.storage.close();
  }
}
