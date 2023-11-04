import { type SyncEvent } from './types.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Remote {
  queue: SyncEvent<any>[];
  processing: boolean = false;

  constructor() {
    this.queue = [];
  }
  async sync<T>(event: SyncEvent<T>): Promise<void> {
    this.queue.push(event);
    this.process();
  }

  async process() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    await sleep(1000);
    let event = undefined;
    do {
      event = this.queue.shift();
      console.log('event=', event);
    } while (this.queue.length > 0);
  }
}

// HttpRestRemote
// WebSocketRemote

// export class SupabaseRemote implements Remote {
//   constructor() {}
// }

// export class AwsRemote implements Remote {
//   constructor() {}
// }

// export class CloudflareRemote implements Remote {
//   constructor() {}
// }
