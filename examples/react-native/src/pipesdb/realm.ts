import { ObjectSchema } from 'realm';
import { ulid } from 'ulid';

export const schema: ObjectSchema = {
  name: 'Object',
  primaryKey: '_id',
  properties: {
    _id: { type: 'string', indexed: true, default: () => ulid() }, // the globally unique id
    path: { type: 'string', indexed: true }, // -> /examples/abc123/items
    key: { type: 'string', indexed: true }, // ->
  },
};
