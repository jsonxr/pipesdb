import { IPipeObjectEmitter, PipeObjectEventHandler } from './PipeObjectEmitter';
import { IPipeObject } from './PipeObject';
import { IPipe } from './types';

export type IPipeList<T> = IPipeObjectEmitter<T> & Array<IPipeObject<T>>;

export function createList<T extends object>(pipe: IPipe<T>, value: T[]): IPipeList<T> {
  let _current: T[] = value;
  const emitter: IPipeObjectEmitter<T> = {
    subscribe(listener: PipeObjectEventHandler<T>): () => void {
      return pipe.subscribe(listener);
    },
  };

  const handler: ProxyHandler<T> = {
    get: (_target: T, p: string | symbol, _receiver: any) => {
      // First check the secret...
      let result = Reflect.get(emitter, p, emitter);
      // Else freeze the proxied object so we can't deeply change
      result = result || (_current && Object.freeze(Reflect.get(_current, p, _current)));
      return result;
    },
    set: (_: T, p: string | symbol) => {
      // Prevent shallow modifications
      throw new Error(`Cannot assign to read only property '${p.toString()}' of object '#<Object>'`);
    },
  };

  const proxy = new Proxy({}, handler) as any;
  return proxy;
}
