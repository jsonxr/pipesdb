import type { IStorage, IStorageObject } from '../types';
import type { ConfigurationWithoutSync, ObjectSchema } from 'realm';
//import { ulid } from 'ws-routable';

const Realm = require('realm');
//import Realm, { ConfigurationWithoutSync, ObjectSchema } from 'realm';

const SCHEMA_NAME = 'objects';
const LIMIT = 1000;

//TODO: This does not take advanage of Real's memory efficiency to load millions of records.

//------------------------------------------------------------------------------
// Realm Storage
//------------------------------------------------------------------------------
export type RealmStorageOptions = Pick<ConfigurationWithoutSync, 'inMemory' | 'path'>;
export type ListOptions = { limit: number };

export class RealmStorage implements IStorage {
  private realm: Promise<Realm> | null = null;
  private options: RealmStorageOptions;

  /**
   *
   * @param options {RealmStorageOptions}
   */
  constructor(options?: RealmStorageOptions) {
    const defaults: RealmStorageOptions = { inMemory: false, path: 'pipesdb.realm' };
    this.options = { ...defaults, ...options };
  }

  /**
   * Need to open storage
   */
  async open(): Promise<void> {
    if (!this.realm) {
      const config: ConfigurationWithoutSync = { ...this.options, ...schemaConfig };
      this.realm = Realm.open(config);
    }
  }

  /**
   * Close storage when finished. Important for inMemory so we start fresh
   */
  async close(): Promise<void> {
    if (this.realm) {
      (await this.realm).close();
      this.realm = null;
    }
  }

  /**
   * Gets object from storage located at path/key
   *
   * @param path {string} - path where object is stored Example: "/examples"
   * @param key {string} - unique key of object
   * @returns
   */
  async get<T>(path: string, key: string): Promise<T | undefined> {
    const realm = await unwrapRealm(this.realm);
    const pk = getPrimaryKey(path, key);
    const obj = realm.objectForPrimaryKey<IRealmStorageObject>(SCHEMA_NAME, pk);
    if (obj) {
      return JSON.parse(obj.value);
    }

    return undefined;
  }

  /**
   *
   * @param path {string} - path where object is stored Example: "/examples"
   * @param key {string} - unique key of object
   * @param value
   */
  async set<T>(path: string, key: string, value: T): Promise<void> {
    const realm = await unwrapRealm(this.realm);
    const pk = getPrimaryKey(path, key);

    realm.write(() => {
      const obj: IRealmStorageObject = realm.objectForPrimaryKey<IRealmStorageObject>(SCHEMA_NAME, pk) ?? {
        ulid: '',
        path,
        pk,
        value: JSON.stringify(value),
        synced: false,
      };
      if (obj) {
        obj.value = JSON.stringify(value);
      }
      realm.create<IRealmStorageObject>(SCHEMA_NAME, obj, Realm.UpdateMode.Modified);
    });
  }

  /**
   *
   * @param path {string} - path where object is stored Example: "/examples"
   * @param options { ListOptions
   * @param options.limit {number} The maximum number of results returned
   * @returns
   */
  async list<T>(path: string, options?: ListOptions): Promise<T[]> {
    const realm = await unwrapRealm(this.realm);
    const limit = options?.limit ?? LIMIT;

    const results = realm
      .objects<IRealmStorageObject>(SCHEMA_NAME)
      .filtered(`path == $0 LIMIT(${limit})`, path)
      .sorted('pk');
    const values = results.map(o => JSON.parse(o.value));
    return values;
  }
}

//--------------------------------------
// Private
//--------------------------------------

const schema: ObjectSchema = {
  name: SCHEMA_NAME,
  primaryKey: 'pk',
  properties: {
    pk: { type: 'string', indexed: true }, // -> /examples/abc123/items/456
    path: { type: 'string', indexed: true }, // -> /examples/abc123/items
    ulid: { type: 'string', indexed: true }, // the globally unique id
    synced: { type: 'bool' },
    value: { type: 'string' },
  },
};

interface IRealmStorageObject extends IStorageObject {
  pk: string;
  path: string;
}

const schemaConfig: ConfigurationWithoutSync = {
  //encryptionKey?: ArrayBuffer | ArrayBufferView | Int8Array;
  schema: [schema],
  schemaVersion: 0,
};

/**
 * Example: getPrimaryKey('/examples', '1') => '/examples/1'
 * @param path {string} - path where object is stored Example: "/examples"
 * @param key {string} - unique key of object
 * @returns concatenated string of path and key with a slash in between
 */
function getPrimaryKey(path: string, key: string) {
  const slash = path.slice(-1) !== '/' ? '/' : '';
  const pk = `${path}${slash}${key}`;
  return pk;
}

/**
 * Throws an error if we don't have a realm promise
 * @param realm
 * @returns
 */
async function unwrapRealm(realm: Promise<Realm> | null): Promise<Realm> {
  if (!realm) {
    throw new Error('Must connect first...');
  }
  return realm;
}
