- What do we do if the cache is millions long and we have cached it...
- Should we use an iterator instead of an array? how do we change to array so we can use

`example.js`

```typescript
type Item = { name: string };
const pipes = new PipesDB(config);
await pipes.connect();
const examples = pipes.getPipe<Item>('/examples');

await examples.waitForSync(); // Optionally wait to finish syncing...

const data: Item[] = examples.data; // Return the cached data...
for (const item of data) {
  console.log('cached', item);
}
examples.listen((event: { type: 'created' | 'updated' | 'deleted'; value: Item }) => {
  console.log(type, 'item=', value);
});
```

```typescript
const list = await examples.list();
examples.listen(event => {
  console.log(event.type, event.value);
});

const obj = await examples.get('0001');
// Should we allow listening to a single object?
obj.listen(event => {
  console.log(event.type, event.value);
});
console.log(obj.name);
```
