import { EventEmitter } from 'events';

export type PipeSyncObjectEvent<T> =
  | {
      key: string;
      type: 'updated';
      value: T;
    }
  | {
      key: string;
      type: 'deleted';
    };

export type PipeObjectEventHandler<T> = (ev: PipeSyncObjectEvent<T>) => void;
export type PipeObjectEventFilter<T> = (ev: PipeSyncObjectEvent<T>) => boolean;

export interface IPipeObjectEmitter<T> {
  subscribe(
    listener?: (ev: PipeSyncObjectEvent<T>) => void,
    filter?: (ev: PipeSyncObjectEvent<T>) => boolean
  ): () => void;
}

export class PipeObjectEmitter<T> implements IPipeObjectEmitter<T> {
  private _emitter = new EventEmitter();

  emit(ev: PipeSyncObjectEvent<T>) {
    this._emitter.emit('sync', ev);
  }

  subscribe(
    listener?: (ev: PipeSyncObjectEvent<T>) => void,
    filter?: (ev: PipeSyncObjectEvent<T>) => boolean
  ): () => void {
    const eventListener = (ev: PipeSyncObjectEvent<T>) => {
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
