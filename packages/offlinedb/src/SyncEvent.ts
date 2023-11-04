import { type SyncEvent } from './types.js';

export class SyncEventImpl<T> implements SyncEvent<T> {
  $pk: string;
  $key: string | number;
  $id: string;
  value: T;
  constructor(params: {
    $pk: string;
    $key: string | number;
    $id: string;
    value: T;
  }) {
    this.value = params.value;
    this.$id = params.$id;
    this.$key = params.$key;
    this.$pk = params.$pk;
  }
}
