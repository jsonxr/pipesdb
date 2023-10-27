import { RealmStorage } from '../../storage/RealmStorage';

type Example = { name: string; value: string };

const createObj = (value: string = 'test'): Example => ({
  name: value,
  value: value,
});

describe('RealmStorage', () => {
  let realm: RealmStorage | null = null;

  beforeEach(() => {});

  afterEach(() => {
    realm?.close();
    realm = null;
  });

  it('constructor', async () => {
    realm = new RealmStorage({ inMemory: true });
    expect(realm).toBeDefined();
  });

  it('should throw error if you try to use before connect', async () => {
    realm = new RealmStorage({ inMemory: true });
    const obj = createObj();
    await expect(async () => realm?.set('/examples', '1', JSON.stringify(obj))).rejects.toThrowError(
      'Must connect first'
    );
  });

  it('should store an object', async () => {
    realm = new RealmStorage({ inMemory: true });
    await realm.open();
    const obj = createObj();
    await realm.set('/examples', '1', JSON.stringify(obj));
  });

  it('should retrieve an object', async () => {
    realm = new RealmStorage({ inMemory: true });
    await realm.open();
    const obj = createObj();
    await realm.set('/examples', '1', obj);
    const value = await realm.get<Example>('/examples', '1');
    expect(value).toBeDefined();
    expect(value!.name).toEqual(obj.name);
  });

  it("should return undefined if getting an object that doesn't exist", async () => {
    realm = new RealmStorage({ inMemory: true });
    await realm.open();
    const value = await realm.get<Example>('/examples', '1');
    expect(value).toBeUndefined();
  });

  it('should retrieve an object even if path has trailing slash', async () => {
    realm = new RealmStorage({ inMemory: true });
    await realm.open();
    const obj = createObj();
    await realm.set('/examples/', '1', obj);
    const value = await realm.get<Example>('/examples', '1');
    expect(value).toBeDefined();
  });

  it('should retrieve a list', async () => {
    realm = new RealmStorage({ inMemory: true });
    await realm.open();
    await Promise.all(['a', 'b'].map(k => realm?.set('/examples', k, createObj(k))));
    const values = await realm.list<Example>('/examples');
    expect(values).toBeDefined();
    expect(values.length).toEqual(2);
    expect(values[0].name).toEqual('a');
    expect(values[1].name).toEqual('b');
  });

  it('should retrieve a list in sorted order', async () => {
    realm = new RealmStorage({ inMemory: true });
    await realm.open();
    const promises = ['c', 'a', 'b'].map(k => realm?.set('/examples', k, createObj(k)));
    for (const p of promises) {
      await p; // Await each promise in order so we insert c before a and b
    }
    const values = await realm.list<Example>('/examples');
    expect(values).toBeDefined();
    expect(values.length).toEqual(3);
    expect(values[0].name).toEqual('a');
    expect(values[1].name).toEqual('b');
    expect(values[2].name).toEqual('c');
  });
});
