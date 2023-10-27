import { base58 } from '@scure/base';
import { PipesError } from './PipeError.js';
import { parse, v7 } from './uuidv7/index.js';
import { stringify } from './uuidv7/stringify.js';

export class PipeId {
  #bytes: Uint8Array;
  constructor(bytes?: Uint8Array | string) {
    // Undefined, generate a new one
    if (!bytes) {
      this.#bytes = v7({}, new Uint8Array(16));
      return;
    }

    if (typeof bytes === 'string') {
      // We received a string
      if (bytes.length === 36) {
        this.#bytes = parse(bytes);
        return;
      }
      if (bytes.length === 21) {
        this.#bytes = base58.decode(bytes);
        return;
      }
      throw PipesError.PIPEID_INVALID_STRING();
    }

    if (bytes instanceof Uint8Array) {
      if (bytes.length !== 16) {
        throw PipesError.PIPEID_INVALID_BYTES();
      }
      this.#bytes = bytes;
      return;
    }

    throw PipesError.PIPEID_INVALID_OPTION();
  }

  toString() {
    return base58.encode(this.#bytes);
  }

  toUuidString() {
    return stringify(this.#bytes);
  }

  getBytes() {
    return new Uint8Array(this.#bytes);
  }
}
