import { EventEmitter } from 'events';

export class Emitter<E = any> {
  private _emitter = new EventEmitter();

  emit<K extends keyof E>(eventName: K, ev: E[K]) {
    this._emitter.emit(eventName.toString(), ev);
  }

  subscribe<K extends keyof E>(
    eventName: K,
    listener?: (ev: E[K]) => void,
    filter?: (ev: E[K]) => boolean
  ): () => void {
    const eventListener = (ev: E[K]) => {
      const should = listener && (!filter || filter(ev));
      if (should) {
        listener(ev);
      }
    };
    this._emitter.addListener(eventName.toString(), eventListener);
    return () => {
      this._emitter.removeListener(eventName.toString(), eventListener);
    };
  }

  removeAllListeners() {
    this._emitter.removeAllListeners();
  }
}
