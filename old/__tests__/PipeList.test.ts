import { PipeObjectEmitter, PipeSyncObjectEvent } from '../PipeObjectEmitter';
import { createList } from '../PipeList';

type Example = { key: string; name: string; sub?: { value: string } };

function createPipe<T extends object = any>() {
  return new PipeObjectEmitter<T>();
}

describe('createObject', () => {
  it('constructor', () => {
    const pipe = createPipe<Example>();
    const list = createList(pipe, []);
    expect(list).toBeDefined();
  });
  it('should allow a subscription', () => {
    const pipe = createPipe<Example>();
    const list = createList(pipe, []);
    const unsubscribe = list.subscribe();
    expect(unsubscribe).toBeDefined();
  });
  it('should throw an error if try to set a property', () => {
    const pipe = createPipe<Example>();
    const list = createList(pipe, []);
    expect(() => {
      list.length = 2;
    }).toThrowError('Cannot assign to read only property');
  });
});
