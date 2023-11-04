import { EventEmitter } from './EventEmitter.js';

describe('', () => {
  it('should', () => {
    const emitter = new EventEmitter();
  });
  // it('should survive a kaboom', () => {
  //   const emitter = new EventEmitter<{ bob: string; bob2: number }>({
  //     //captureRejections: true,
  //   });
  //   const listener = async (a: string) => {
  //     throw new Error('Kaboom');
  //   };
  //   emitter.on('bob', listener);
  //   emitter.on('error', (err: unknown) => {
  //     console.error('error=', err);
  //   });

  //   emitter.emit('bob', 'hello world');

  //   // emitter.removeListener('bob', listener);
  //   // const newListener = () => {};
  //   // emitter.on('newListener', newListener);
  //   // emitter.removeListener('newListener', newListener);
  // });
});
