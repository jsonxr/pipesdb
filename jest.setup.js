//global.WebSocket = require('isomorphic-ws');
global.crypto = require('crypto').webcrypto;

global.console = {
  ...console,
  // uncomment to ignore a specific log level
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

global.CustomEvent = class CustomEvent extends Event {};
