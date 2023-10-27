import { ClientConfig } from './Client.js';
import { PipeId } from './PipeId.js';
import { Remote } from './Remote.js';
import { type Resource, type ResourceConfig } from './Resource.js';
import { type Storage } from './Storage.js';
import { SyncEventImpl, type SyncEvent } from './SyncEvent.js';

export class ResourceImpl<T extends { key: string }> implements Resource<T> {
  #storage: Storage;
  #tenant: string;
  #remote: Remote;
  #config: Required<ResourceConfig<T>>;
  constructor(config: ClientConfig<any>, options: ResourceConfig<T>) {
    this.#tenant = config.tenant;
    this.#storage = config.storage;
    this.#remote = config.remote;
    this.#config = { compacted: true, ...options };
  }

  async list(): Promise<T[]> {
    return await this.#storage.list(this.#getPk(), this.#config.compacted);
  }

  async get(): Promise<T> {
    return {} as T;
  }

  async put(value: T): Promise<SyncEvent<T>> {
    const id = new PipeId();
    const event = new SyncEventImpl({
      $pk: this.#getPk(),
      $key: value.key,
      $id: id.toString(),
      value: value,
    });
    await this.#storage.put(event, this.#config.compacted);
    this.#remote.sync(event);

    return event;
  }

  subscribe() {}

  async patch(value: Partial<T>): Promise<void> {}

  async delete(key: string): Promise<void> {}

  #getPk() {
    return `${this.#tenant}/${this.#config.path}`;
  }
}
