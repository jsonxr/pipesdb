export type EventHandler<T = any> = {
  (...e: T[]): void | Promise<void>;
};

type HardcodedEvents = {
  newListener: { name: string };
  removeListener: { name: string };
  error: unknown;
};

export class EventEmitter<T extends Record<string, any> = {}> {
  #captureRejections = false;

  //@ts-ignore
  #listeners: Record<keyof T, EventHandler[]> = {};
  constructor(options: { captureRejections?: boolean } = {}) {
    this.#captureRejections = options.captureRejections
      ? options.captureRejections
      : false;
  }

  on<E extends keyof T | keyof HardcodedEvents>(
    event: E,
    listener: E extends keyof HardcodedEvents
      ? EventHandler<HardcodedEvents[E]>
      : EventHandler<T[E]>
  ) {
    if (this.#captureRejections && listener instanceof Promise) {
      listener.then(undefined, (reason: unknown) => {
        this.emit('error', reason as any);
      });
    }

    if (!this.#listeners.hasOwnProperty(event)) {
      this.#listeners[event] = [];
    }
    this.#listeners[event].push(listener);
    this.emit('newListener', listener as any);
    return this;
  }

  emit<E extends keyof T | keyof HardcodedEvents>(event: E, ...data: T[E][]) {
    if (!this.#listeners.hasOwnProperty(event)) {
      return false;
    }

    for (let i = 0; i < this.#listeners[event].length; i++) {
      const callback = this.#listeners[event][i];
      callback.call(this, ...data);
    }
    return true;
  }

  eventNames() {
    return Object.keys(this.#listeners);
  }

  listeners<E extends keyof T>(eventName: E) {
    return this.#listeners[eventName];
  }

  removeListener<E extends keyof T | keyof HardcodedEvents>(
    eventName: E,
    listener: EventHandler<T[E]>
  ) {
    const listeners = this.#listeners[eventName] ?? [];
    const index = listeners.findIndex((l) => l === listener);
    if (index >= 0) {
      listeners.splice(index, 1);
      this.emit('removeListener', listener as any);
    }
    return this;
  }
}

const emitter = new EventEmitter<{ bob: string; bob2: number }>({
  //captureRejections: true,
});
const listener = async (a: string) => {
  throw new Error('Kaboom');
};
emitter.on('bob', listener);
emitter.on('error', (err: unknown) => {
  console.error('error=', err);
});

emitter.emit('bob', 'hello world');

// emitter.removeListener('bob', listener);
// const newListener = () => {};
// emitter.on('newListener', newListener);
// emitter.removeListener('newListener', newListener);
