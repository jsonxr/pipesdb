import { SocketSession } from 'ws-routable';
import { Pipe } from './Pipe';
import { Source } from './Source';
import { IPipesClient, ISource, IStorage, PipeOptions } from './types';

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
  storage: IStorage;
  source: ISource;
};

export class PipesClient implements IPipesClient {
  //emitter = new PipeEmitter<T>();
  source: ISource = new Source();
  storage: IStorage;
  session: SocketSession | null = null;

  constructor(public readonly config: PipesConfig) {
    this.source = config.source;
    this.storage = config.storage;
  }

  get<T extends object>(path: string, options?: PipeOptions): Pipe<T> {
    return new Pipe<T>(this, path, options);
  }

  async open() {
    await this.config.storage.open();
    const webSocket = new WebSocket(this.config.url);
    console.log('url:', this.config.url);
    this.session = new SocketSession(webSocket);
    await this.session.open();
  }
  async close() {
    return this.config.storage.close();
  }
}
