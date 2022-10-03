global.WebSocket = require('isomorphic-ws');
//global.crypto = require('crypto').webcrypto;

import { PipesClient, PipesConfig, RealmStorage } from 'pipesdb';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const token = 'USER1'; // This is really an encoded token when implemented...
const tenantId = 'TENANT1'; // This really should be a non-guessable id

class Example {
  static path = '/examples';
  static schema = {};

  key: string = '';
  name: string = '';
}

const config: PipesConfig = {
  url: `ws://127.0.0.1:8787/${tenantId}?authorization=${token}`,
  schemas: [
    { path: '/examples', offline: true, limit: 1000, schema: {} },
    { path: '/examples/:exampleId/items', schema: {} },
  ],
  storage: new RealmStorage({ inMemory: false }),
};

async function main() {
  const db = new PipesClient(config);
  await db.open();
  const examples = db.get<Example>('/examples', { offline: true });
  const list = await examples.list({ sync: true }); // Wait for sync before responding...

  const unsubscribe = list.subscribe(e => {
    console.log('event:', e.type, e.key);
  });

  // console.log('\nStarting list...\n----------------------------------------');
  // for (const l of list) {
  //   console.log(l);
  // }

  // console.log('\nSetting values...\n----------------------------------------');
  // await examples.set('1', { key: '1', name: new Date().toISOString() });
  // await examples.set('2', { key: '2', name: new Date().toISOString() });
  // await delay(1000);

  // console.log('\nUnsubscribe...\n----------------------------------------');
  // unsubscribe(); // Don't listen anymore

  // console.log('\nSetting values...\n----------------------------------------');
  // await examples.set('3', { key: '3', name: new Date().toISOString() });
  // await examples.set('4', { key: '4', name: new Date().toISOString() });

  console.log('\n\nGetting object 1...\n----------------------------------------');
  const obj = examples.get('1');
  console.log('\n\nGetting object 2...\n----------------------------------------');
  console.log(obj);
  console.log('\n\nwhat is my property situation...\n----------------------------------------');
  console.log(await obj);
  console.log('done awaiting...');

  db.close();
}

async function main2() {
  const db = new PipesClient(config);
  await db.open();

  //----------------------------------------------------------------------------
  // List - Online only
  //----------------------------------------------------------------------------
  const online = db.get<Example>('/examples'); // This pipe only exists online and is not cached locally
  // db.get<Example>('/examples', { offline: false }); // The default.
  const list0 = await online.list();
  // options.synced throws an error since invalid for online only pipe
  // You can still listen for changes on the server though...
  const l0 = list0.subscribe(e => {
    console.log(e);
  });
  l0();

  //----------------------------------------------------------------------------
  // List - Offline capable
  //----------------------------------------------------------------------------
  // Give me a pipe capable of being offline
  const examples = db.get<Example>('/examples', { offline: true });

  // synced=true: Wait until the data syncs before resolving promise
  // Not going to listen for future changes...
  const list = await examples.list({ sync: true });
  const unsubscribe = list.subscribe(e => {
    console.log(e);
  });

  // synced=true: Wait until the data syncs before resolving promise
  // We are also going to listen for future changes
  const list2 = await examples.list({ sync: true });

  // synced=false: Resolve list with what you have in cache right *now* ...
  // Also, I don't even care if the server has newer data...
  const list3 = await examples.list({ sync: false });

  // synced=false: Resolve list with what you have in cache right *now* ...
  // As you update the server, tell me and give me future updates too
  const list4 = await examples.list({ sync: false });
  // With a compacted message queue, we only get one event per new object...
  // Do we want an event that tells us AFTER everything was synced?

  //----------------------------------------------------------------------------
  // Object - Online only
  //
  // options.synced throws an error since invalid for online only pipe
  //----------------------------------------------------------------------------
  const online1 = await online.get('123');
  // options.synced throws an error since invalid for online only pipe
  if (online1) {
    // Listen for changes
    const o1l = online1.subscribe(event => {});
    // Stop listening
    o1l();
  }

  //----------------------------------------------------------------------------
  // Object - Offline capable
  //----------------------------------------------------------------------------
  const e1 = await examples.get('123', { sync: false });
  if (e1) {
    // Listen for changes
    const e1l = e1.subscribe(event => {});
    // Stop listening
    e1l();
  }

  //----------------------------------------------------------------------------
  // Object - set
  //----------------------------------------------------------------------------
  // _id vs key...  _id is system assigned...
  // key is user supplied
  const example: Example = {
    key: '123', // ????? Do we need this here
    name: 'new name',
  };
  await examples.set('123', example); // Redundant to send key and have key in the object

  unsubscribe();
}

main();
