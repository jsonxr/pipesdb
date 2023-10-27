import { PipesClient, PipesConfig } from '../PipesClient';
import { ISource, IStorage } from '../types';

type Example = {};

const storage: IStorage = {
  open: jest.fn(),
  close: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  list: jest.fn(),
};
const source: ISource = {};

describe('PipesClient', () => {
  const config: PipesConfig = { url: 'localhost', storage, source };

  it('constructor', () => {
    const client = new PipesClient(config);
    expect(client).toBeDefined();
    expect(client.config.url).toEqual('localhost');
  });

  it('should open', async () => {
    const client = new PipesClient(config);
    await client.open();
    expect(1).toEqual(1);
  });

  it('should return a Pipe', async () => {
    const db = new PipesClient(config);
    await db.open();
    const online = db.get<Example>('/examples'); // This pipe only exists online and is not cached locally
    expect(online).toBeTruthy();
  });

  it('should close', async () => {
    const db = new PipesClient(config);
    await db.open();
    await db.close();
  });
});
