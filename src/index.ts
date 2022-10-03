// global.WebSocket = require('isomorphic-ws');
// global.crypto = require('crypto').webcrypto;

if (!global.WebSocket) {
  const errorMessage = `WebSocket does not exist.

If you are running this in Node, you need to add this before you include

  global.WebSocket = require('isomorphic-ws');
  import { PipesClient } from 'pipesdeb';
  `;

  throw new Error(errorMessage);
}

if (!global.crypto) {
  const errorMessage = `crypto does not exist.

If you are running this in Node, you need to add this before you include

  global.WebSocket = require('isomorphic-ws');
  global.crypto = require('crypto').webcrypto;
  import { PipesClient } from 'pipesdeb';
  `;
}

export { Pipe } from './Pipe';
export { IPipeList } from './PipeList';
export { IPipeObject } from './PipeObject';
export { PipesClient, PipesConfig } from './PipesClient';
export { PrivateProxy } from './PrivateProxy';
export * from './types';
export { ulid, ulidFactory } from 'ws-routable';

export { RealmStorage } from './storage/RealmStorage';
