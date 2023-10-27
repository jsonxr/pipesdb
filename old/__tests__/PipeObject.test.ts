import { PipeObjectEmitter, PipeSyncObjectEvent } from '../PipeObjectEmitter';
import { createObject } from '../PipeObject';

type Example = { key: string; name: string; sub?: { value: string } };

function createPipe<T extends object = any>() {
  return new PipeObjectEmitter<T>();
}

describe('createObject', () => {
  it('constructor', () => {
    const pipe = createPipe<Example>();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    expect(obj).toBeDefined();
  });

  it('should prevent shallow properties from being set', () => {
    const pipe = createPipe<Example>();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    expect(() => {
      obj.name = 'throw';
    }).toThrowError(/Cannot assign to read only property/);
  });

  it('should prevent deep properties from being set', () => {
    const pipe = createPipe<Example>();
    const obj = createObject(pipe, '1', { key: '1', name: 'original', sub: { value: 'name' } });
    expect(() => {
      if (obj.sub) {
        obj.sub.value = 'throw';
      }

      //obj.sub.name = 'throw';
    }).toThrowError(/Cannot assign to read only property/);
  });

  it('should change the proxy if subscribed', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    obj.subscribe();
    // Now, change the object underneath...
    expect(obj.name).toEqual('original');
    pipe.emit({ key: '1', type: 'updated', value: { key: '1', name: 'changed' } });
    expect(obj.name).toEqual('changed');
  });

  it('should NOT change the proxy if NOT subscribed', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    // Now, change the object underneath...
    expect(obj.name).toEqual('original');
    pipe.emit({ key: '1', type: 'updated', value: { key: '1', name: 'changed' } });
    expect(obj.name).toEqual('original');
  });

  it('should change the proxy when we receive an event is subscribed', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    obj.subscribe();
    // Now, change the object underneath and check...
    expect(obj.name).toEqual('original');
    pipe.emit({ key: '1', type: 'updated', value: { key: '1', name: 'changed' } });
    expect(obj.name).toEqual('changed');
  });

  it('should notify listeners if event dispatched', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    const mockCallback = jest.fn();
    obj.subscribe(mockCallback);

    // Now, change the object underneath and check...
    const event: PipeSyncObjectEvent<Example> = { key: '1', type: 'updated', value: { key: '1', name: 'changed' } };
    pipe.emit(event);
    expect(mockCallback).toHaveBeenCalledWith(event);
  });

  it('should ignore listeners if event is not the object', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    const mockCallback = jest.fn();
    obj.subscribe(mockCallback);

    // Now, change the object underneath and check...
    pipe.emit({ key: '2', type: 'updated', value: { key: '2', name: 'changed' } });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should output a json string', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    expect(JSON.stringify(obj)).toEqual('{"key":"1","name":"original"}');
  });

  it('should output the correct json string even after we make a change', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    expect(JSON.stringify(obj)).toEqual('{"key":"1","name":"original"}');

    // Change object
    obj.subscribe();
    pipe.emit({ key: '1', type: 'updated', value: { key: '1', name: 'changed' } });

    // Make sure JSON gives us the right answer...
    expect(JSON.stringify(obj)).toEqual('{"key":"1","name":"changed"}');
  });

  it('isDeleted should return false if the object was not deleted', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    expect(obj.isDeleted()).toEqual(false);
  });

  it('isDeleted should return true if object was deleted', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    obj.subscribe();
    pipe.emit({ key: '1', type: 'deleted' });
    expect(obj.isDeleted()).toEqual(true);
  });

  it('should throw an error when accessing a property and object was deleted', () => {
    const pipe = createPipe();
    const obj = createObject(pipe, '1', { key: '1', name: 'original' });
    obj.subscribe();
    pipe.emit({ key: '1', type: 'deleted' });
    expect(() => {
      obj.key;
    }).toThrowError('Object was deleted');
  });
});
