import { Emitter } from '../Emitter';
import { IEvent } from '../types';

type EventMap = {
  sync: { path: string; key: string; value: any };
};

type Example = { key: string; name: string };

describe('PipeEmitter', () => {
  it('constructor', () => {
    const emitter = new Emitter();
    expect(emitter).toBeDefined();
  });

  it('should allow a subscription', () => {
    const emitter = new Emitter<EventMap>();
    const unsubscribe = emitter.subscribe('sync', jest.fn());
    expect(unsubscribe).toBeDefined();
  });

  it('should dispatch a function', () => {
    const emitter = new Emitter<EventMap>();
    const ev: IEvent = { path: '', key: '1', value: {} };
    const mock = jest.fn();
    const unsubscribe = emitter.subscribe('sync', mock);
    emitter.emit('sync', ev);
    expect(mock).toBeCalledWith(ev);
    expect(unsubscribe).toBeDefined();
  });

  it('should allow multipler listeners', () => {
    const emitter = new Emitter<EventMap>();
    const m1 = jest.fn();
    const m2 = jest.fn();
    emitter.subscribe('sync', m1);
    emitter.subscribe('sync', m2);
    emitter.emit('sync', { key: '1', path: '', value: {} });
    expect(m1).toBeCalled();
    expect(m2).toBeCalled();
  });

  it('should unsubscribe', () => {
    const emitter = new Emitter<EventMap>();
    const mock = jest.fn();
    const unsubscribe = emitter.subscribe('sync', mock);

    // Dispatch 1st event
    const ev1: IEvent = { path: '', key: '1', value: {} };
    emitter.emit('sync', ev1);
    unsubscribe();

    // Dispatch 2nd event
    const ev2: IEvent = { ...ev1, key: '2' };
    emitter.emit('sync', ev2);

    expect(mock).toBeCalledTimes(1);
    expect(mock).lastCalledWith(ev1);
  });

  it('should filter events', () => {
    const emitter = new Emitter<EventMap>();
    const mock = jest.fn();

    // Filter allow events for key 2
    const unsubscribe = emitter.subscribe('sync', mock, ev => ev.key === '2');
    expect(unsubscribe).toBeDefined();

    const ev1: IEvent = { path: '', key: '1', value: {} };
    const ev2: IEvent = { ...ev1, key: '2' };

    // Dispatch 1st event
    emitter.emit('sync', ev1);
    expect(mock).not.toBeCalled();

    // Dispatch 1st event that matches
    emitter.emit('sync', ev2);
    expect(mock).toBeCalledTimes(1);
    expect(mock).lastCalledWith(ev2);
  });

  it('should not notify anyone if removeAllListeners was called', () => {
    const emitter = new Emitter<EventMap>();
    const m1 = jest.fn();
    const m2 = jest.fn();
    emitter.subscribe('sync', m1);
    emitter.subscribe('sync', m2);
    emitter.removeAllListeners();
    emitter.emit('sync', { key: '1', path: '', value: {} });
    expect(m1).not.toBeCalled();
    expect(m2).not.toBeCalled();
  });
});
