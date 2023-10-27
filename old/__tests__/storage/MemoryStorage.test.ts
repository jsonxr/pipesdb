import { ulid } from 'ws-routable';
import { MemoryStorage } from '../../storage/MemoryStorage';

type Group = {
  cid: string;
  group: string;
};
type Post = {
  cid: string;
  post: string;
};

async function createStorage() {
  const storage = new MemoryStorage();
  expect(storage).toBeDefined();
  await Promise.all([
    // Insert them all out of order to make sure they are sorted...
    storage.set('TENANT1/churches/01', 'groups/02', { cid: ulid(), group: 'two' }),
    storage.set('TENANT1/churches/01', 'groups/02/posts/04', { cid: ulid(), post: 'four' }),
    storage.set('TENANT1/churches/01', 'groups/02/posts/03', { cid: ulid(), post: 'three' }),
    storage.set('TENANT1/churches/01', 'groups/01', { cid: ulid(), group: 'one' }),
    storage.set('TENANT1/churches/01', 'groups/01/posts/01', { cid: ulid(), post: 'one' }),
    storage.set('TENANT1/churches/01', 'groups/01/posts/02', { cid: ulid(), post: 'two' }),
    storage.set('TENANT1/churches/01', 'groups/03', { cid: ulid(), group: 'three' }),
    storage.del('TENANT1/churches/01', 'groups/03'),
  ]);
  return storage;
}

describe('MemoryStorage', () => {
  describe('constructor', () => {
    it('should instantiate with default constructor', () => {
      const storage = new MemoryStorage();
      expect(storage).toBeDefined();
    });
  });

  describe('open', () => {
    it('should do nothing when called', async () => {
      const storage = new MemoryStorage();
      await storage.open();
    });
  });

  describe('close', () => {
    it('should do nothing when called', async () => {
      const storage = new MemoryStorage();
      await storage.close();
    });
  });

  describe('set', () => {
    it('should set object', async () => {
      const storage = new MemoryStorage();
      const group: Group = { cid: ulid(), group: 'zero' };
      const row = await storage.set('TENANT1/churches/01', 'groups/00', group);
      expect(row).toBeDefined();
      expect(row.value).toEqual(group);
    });
  });

  describe('get', () => {
    it('should get object', async () => {
      const storage = await createStorage();
      const row = await storage.get<Group>('TENANT1/churches/01', 'groups/01');
      expect(row).toBeDefined();
      expect(row?.pk).toEqual('TENANT1/churches/01');
      expect(row?.sk).toEqual('groups/01');
      expect(row?.value?.group).toEqual('one');
    });

    it('should return undefined if pk not found', async () => {
      const storage = await createStorage();
      const row = await storage.get<Group>('bad', 'bad');
      expect(row).toBeUndefined();
    });
  });

  describe('del', () => {
    it('should return undefined if pk does not exist', async () => {
      const storage = await createStorage();
      const row = await storage.del('bad', 'bad');
      expect(row).toBeUndefined();
    });
    it('should return undefined if sk does not exist', async () => {
      const storage = await createStorage();
      const row = await storage.del('TENANT1/churches/01', 'bad');
      expect(row).toBeUndefined();
    });
  });

  describe('query', () => {
    it('should list all objects for pk', async () => {
      const storage = await createStorage();
      const rows = await storage.query('TENANT1/churches/01');
      expect(rows).toBeDefined();
      expect(rows.length).toEqual(7);
      expect(rows[0].value.group).toEqual('one');
      expect(rows[1].value.post).toEqual('one');
      expect(rows[2].value.post).toEqual('two');
      expect(rows[3].value.group).toEqual('two');
      expect(rows[4].value.post).toEqual('three');
      expect(rows[5].value.post).toEqual('four');
      expect(rows[6].value).toBeNull();
    });

    it('should list objects for pk/sk', async () => {
      const storage = await createStorage();
      const rows = await storage.query('TENANT1/churches/01', 'groups/01/posts');
      expect(rows).toBeDefined();
      expect(rows.length).toEqual(2);
      expect(rows[0].value.post).toEqual('one');
      expect(rows[1].value.post).toEqual('two');
    });

    it('should return empty list if bad pk', async () => {
      const storage = await createStorage();
      const rows = await storage.query('bad');
      expect(rows).toBeDefined();
      expect(rows.length).toEqual(0);
    });
  });
});
