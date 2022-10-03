import { EventEmitter } from 'events';

export type PipeSyncEvent<T> =
  | {
      key: string;
      type: 'updated';
      value: T;
    }
  | {
      key: string;
      type: 'deleted';
    };

export type PipeEventHandler<T> = (ev: PipeSyncEvent<T>) => void;
export type PipeEventFilter<T> = (ev: PipeSyncEvent<T>) => boolean;

export interface IPipeEmitter<T> {
  subscribe(listener?: (ev: PipeSyncEvent<T>) => void, filter?: (ev: PipeSyncEvent<T>) => boolean): () => void;
}

export class PipeEmitter<T> implements IPipeEmitter<T> {
  private _emitter = new EventEmitter();

  emit(ev: PipeSyncEvent<T>) {
    this._emitter.emit('sync', ev);
  }

  subscribe(listener?: (ev: PipeSyncEvent<T>) => void, filter?: (ev: PipeSyncEvent<T>) => boolean): () => void {
    const eventListener = (ev: PipeSyncEvent<T>) => {
      const should = listener && (!filter || filter(ev));
      if (should) {
        listener(ev);
      }
    };
    this._emitter.addListener('sync', eventListener);

    return () => {
      this._emitter.removeListener('sync', eventListener);
    };
  }

  removeAllListeners() {
    this._emitter.removeAllListeners();
  }
}
