import { Emitter } from './Emitter';
import { ISource } from './types';

type EventMap = {
  sync: { key: string; value: any };
};

const syncer = {
  path: '',
};

type Row = {
  pk: string;
  sk: string;
  json: string;
  lastUpdated: number;
};

export class Source implements ISource {
  emitter: Emitter = new Emitter<EventMap>();
  sync(pk: string, sk: string, lastupdated: number) {
    // First, query server for rows after lastupdated
  }
}
