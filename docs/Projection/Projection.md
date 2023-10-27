# Documents

Builds CRUD functionality on top of a message pipe with these basic options `{ compact: true, retain: true }`. Consumers
are generally not attached to these pipes.

Documents can be used offline, and an eventually consistent state with the server. We always overwrite our data with
what the server tells us is latest.

```typescript
const examples = projection('/examples/:id', { offline: true });
await examples.sync(); // sync the table before continuing...
```

# `sort: 'asc'`

```typescript
const examples = projection('/examples/:id', { offline: true });
await examples.list({ sort: 'asc', sync });
```

```typescript
//
const p = reader('/examples', { limit: 2, sortBy: 'key' });
// a: id>5, key<=w
// a: id: [5,undefined], key: [undefined, 'w']
const results = {
  idRange: [],
  keyRange: [],
  state: 11,
  values: ['9a', '7c'],
};

// b: id:[5,11], key: [undefined, 'w]
```

# `sortBy:'key', sort: 'desc'`

![Reader](reader-key-desc.drawio.svg)
