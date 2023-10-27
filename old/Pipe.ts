import { PipeObjectEmitter, PipeObjectEventFilter, PipeObjectEventHandler } from './PipeObjectEmitter';
import { createList, IPipeList } from './PipeList';
import { createObject, IPipeObject } from './PipeObject';
import { IPipe, IPipesClient, ISource, IStorage, PipeOptions } from './types';

export type SyncOptions = {
  sync?: boolean; // If true, wait for server update before returning results. If offline=false, this property has no effect
};

export type Listener = (event: any) => void;
export class Pipe<T extends object> implements IPipe<T> {
  emitter: PipeObjectEmitter<T>;
  options?: PipeOptions;
  path: string;
  private source: ISource;
  private storage: IStorage;

  constructor(client: IPipesClient, path: string, options: PipeOptions = {}) {
    this.emitter = new PipeObjectEmitter<T>();
    this.options = options;
    this.path = path;
    this.source = client.source;
    this.storage = client.storage;
  }

  subscribe(listener: PipeObjectEventHandler<T>, filter?: PipeObjectEventFilter<T> | undefined) {
    return this.emitter.subscribe(listener, filter);
  }

  async list(props?: SyncOptions): Promise<IPipeList<T>> {
    //TODO: Query server for list and wait before responding...
    // if (props?.sync) {
    // }

    // Retreive values from storage since server will have updated...
    let values = await this.storage.list<T>(this.path);
    return createList(this, values);
  }

  async get(key: string, props?: SyncOptions): Promise<(IPipeObject<T> & T) | undefined> {
    //TODO: Query server for object and wait before responding...
    if (props?.sync) {
    }

    // Retreive values from storage since server will have updated...
    let value = await this.storage.get<T>(this.path, key);
    if (!value) {
      return undefined;
    }
    const proxy = createObject<T>(this, key, value);
    return proxy;
  }

  async set(key: string, value: T) {
    await this.storage.set(this.path, key, value);
    // Send to server...
    this.emitter.emit({ type: 'updated', key, value });
  }

  async delete(key: string) {
    this.emitter.emit({ type: 'deleted', key });
  }
}
