import { PipeObjectEmitter, PipeSyncObjectEvent } from '../PipeObjectEmitter';

type Example = { key: string; name: string };

describe('PipeEmitter', () => {
  it('constructor', () => {
    const emitter = new PipeObjectEmitter<Example>();
    expect(emitter).toBeDefined();
  });

  it('should allow a subscription', () => {
    const emitter = new PipeObjectEmitter<Example>();
    const unsubscribe = emitter.subscribe(jest.fn());
    expect(unsubscribe).toBeDefined();
  });

  it('should dispatch a function', () => {
    const emitter = new PipeObjectEmitter<Example>();
    const ev: PipeSyncObjectEvent<Example> = { type: 'updated', key: '1', value: { key: '1', name: 'one' } };
    const mock = jest.fn();
    const unsubscribe = emitter.subscribe(mock);
    emitter.emit(ev);
    expect(mock).toBeCalledWith(ev);
    expect(unsubscribe).toBeDefined();
  });

  it('should allow multipler listeners', () => {
    const emitter = new PipeObjectEmitter<Example>();
    const m1 = jest.fn();
    const m2 = jest.fn();
    emitter.subscribe(m1);
    emitter.subscribe(m2);
    emitter.emit({ key: '1', type: 'deleted' });
    expect(m1).toBeCalled();
    expect(m2).toBeCalled();
  });

  it('should unsubscribe', () => {
    const emitter = new PipeObjectEmitter<Example>();
    const mock = jest.fn();
    const unsubscribe = emitter.subscribe(mock);

    // Dispatch 1st event
    const ev1: PipeSyncObjectEvent<Example> = { type: 'updated', key: '1', value: { key: '1', name: 'one' } };
    emitter.emit(ev1);
    unsubscribe();

    // Dispatch 2nd event
    const ev2: PipeSyncObjectEvent<Example> = { ...ev1, key: '2' };
    emitter.emit(ev2);

    expect(unsubscribe).toBeDefined();
    expect(mock).toBeCalledTimes(1);
    expect(mock).lastCalledWith(ev1);
  });

  it('should filter events', () => {
    const emitter = new PipeObjectEmitter<Example>();
    const mock = jest.fn();

    // Filter allow events for key 2
    const unsubscribe = emitter.subscribe(mock, ev => ev.key === '2');
    expect(unsubscribe).toBeDefined();

    const ev1: PipeSyncObjectEvent<Example> = { type: 'updated', key: '1', value: { key: '1', name: 'one' } };
    const ev2: PipeSyncObjectEvent<Example> = { ...ev1, key: '2' };

    // Dispatch 1st event
    emitter.emit(ev1);
    expect(mock).not.toBeCalled();

    // Dispatch 1st event that matches
    emitter.emit(ev2);
    expect(mock).toBeCalledTimes(1);
    expect(mock).lastCalledWith(ev2);
  });

  it('should not notify anyone if removeAllListeners was called', () => {
    const emitter = new PipeObjectEmitter<Example>();
    const m1 = jest.fn();
    const m2 = jest.fn();
    emitter.subscribe(m1);
    emitter.subscribe(m2);
    emitter.removeAllListeners();
    emitter.emit({ key: '1', type: 'deleted' });
    expect(m1).not.toBeCalled();
    expect(m2).not.toBeCalled();
  });
});
