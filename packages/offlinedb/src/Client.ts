import { type Remote } from './Remote.js';
import { type Resource, type ResourceConfig } from './Resource.js';
import { ResourceImpl } from './ResourceImpl.js';
import { type Storage } from './Storage.js';

export type ResourceConfigsOptions = Record<string, ResourceConfig<any>>;
// Given type T = ResourceConfig<MyObject>, extracts MyObject
type ExtractResourceType<T> = T extends ResourceConfig<infer U> ? U : never;
export type Resources<T extends ResourceConfigsOptions> = {
  [K in keyof T]: Resource<ExtractResourceType<T[K]>>;
};

export type ClientConfig<R extends ResourceConfigsOptions> = {
  tenant: string;
  storage: Storage;
  remote: Remote;
  resources: R;
};

export class Client<R extends ResourceConfigsOptions> {
  resources: Resources<R>;
  constructor(config: ClientConfig<R>) {
    this.resources = getResourcesFromConfigs(config);
  }
}

// Given a Record of ResourceConfig<R>, returns a Record of Resource<R>
function getResourcesFromConfigs<R extends ResourceConfigsOptions>(config: ClientConfig<R>): Resources<R> {
  const resources: Record<string, Resource<R>> = {};
  const keys: string[] = Object.keys(config.resources);
  keys.forEach(k => {
    resources[k] = new ResourceImpl(config, config.resources[k]);
  });
  return resources as any;
}
