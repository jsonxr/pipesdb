import { IPipeEmitter, PipeEventHandler, PipeSyncEvent } from './PipeEmitter';
import { IPipe, NotifyFn } from './types';

export interface IPipeEnhancer<T> extends IPipeEmitter<T> {
  isDeleted(): boolean;
}
export type IPipeObject<T> = IPipeEmitter<T> & T;

export function createObject<T extends object>(pipe: IPipe<T>, key: string, value: T): IPipeObject<T> {
  let _current: any = JSON.parse(JSON.stringify(value));

  const emitter: IPipeEnhancer<T> = {
    isDeleted: () => !_current,
    subscribe: (listener?: PipeEventHandler<T>): NotifyFn => {
      const mylistener = (ev: PipeSyncEvent<T>) => {
        Object.keys(_current).forEach(key => delete _current[key]); // Remove all properties of current...

        if (ev.type === 'updated') {
          Object.assign(_current, ev.value);
          //_current = JSON.parse(JSON.stringify(ev.value));
        }
        if (ev.type === 'deleted') {
          _current = null;
        }

        // Notify the listener...
        listener?.(ev);
      };
      return pipe.subscribe(mylistener, (ev: PipeSyncEvent<T>) => {
        return ev.key === key;
      });
    },
  };

  const handler: ProxyHandler<T> = {
    get: (_target: T, p: string | symbol, _receiver: any) => {
      // First check the secret...
      let result = Reflect.get(emitter, p, emitter);
      if (result) {
        return result;
      }

      // Throw an error if object was deleted
      if (!_current) {
        throw new Error('Object was deleted');
      }

      return Object.freeze(Reflect.get(_current, p, _current));

      // // Else freeze the proxied object so we can't deeply change
      // //result = result || (_current && Object.freeze(_current));
      // console.log('p=', p.toString(), _target, _receiver);
      // result = _current && Object.freeze(Reflect.get(_current, p, _current));
      // if (p === '$$typeof') {
      //   console.log('!!!!!!!!!!!!!!!!!typeof');
      //   return undefined;
      // }
      // return result;
    },
    set: (_: T, p: string | symbol) => {
      // Prevent shallow modifications
      throw new Error(`Cannot assign to read only property '${p.toString()}' of object '#<Object>'`);
    },
  };

  const proxy = new Proxy(_current, handler) as any;
  return proxy;
}
