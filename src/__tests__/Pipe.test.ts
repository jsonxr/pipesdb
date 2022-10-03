import { Pipe, PipeOptions } from '../Pipe';
import { IStorage } from '../types';

type Example = { key: string; name: string };

const examples: Record<string, Example> = {
  '1': { key: '1', name: 'original1' },
  '2': { key: '2', name: 'original2' },
};

function createPipe<T extends Example>(path: string, options: PipeOptions = {}) {
  const storage: IStorage = {
    open: jest.fn(),
    close: jest.fn(),
    set: jest.fn(),
    get: async <T>(_: string, key: string) => examples[key] as T,
    list: async <T>() => Object.values(examples) as T,
  };
  return new Pipe<Example>(storage, path, options);
}

describe('Pipe', () => {
  it('constructor', () => {
    const pipe = createPipe('/examples');
    expect(pipe).toBeDefined();
  });

  it('subscribe', () => {
    const pipe = createPipe('/examples');
    const fn = jest.fn();
    pipe.subscribe(fn);
    pipe.emitter.emit({ key: '1', type: 'updated', value: { key: '1', name: 'changed' } });
    expect(fn).toBeCalled();
  });

  it('list', async () => {
    const pipe = createPipe('/examples');
    const list = await pipe.list();
    expect(list).toBeDefined();
    expect(list.length).toEqual(2);
  });

  it('get should return an object only after we have sync', async () => {
    const pipe = createPipe('/examples');
    const obj = await pipe.get('1', { sync: true });
    expect(obj).toBeDefined();
  });

  it('get should return an object', async () => {
    const pipe = createPipe('/examples');
    const obj = await pipe.get('1');
    expect(obj).toBeDefined();
  });

  it('get should return undefined if key does not exist in storage', async () => {
    const pipe = createPipe('/examples');
    const obj = await pipe.get('');
    expect(obj).toBeUndefined();
  });

  it('set', async () => {
    const pipe = createPipe('/examples');
    const fn = jest.fn();
    pipe.subscribe(fn);
    await pipe.set('2', { key: '2', name: 'changed' });
    expect(fn).toBeCalled();
  });

  it('delete', async () => {
    const pipe = createPipe('/examples');
    const fn = jest.fn();
    pipe.subscribe(fn);
    await pipe.delete('2');
    expect(fn).toBeCalled();
  });
});
