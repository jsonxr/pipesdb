# Subscription

```javascript
//
const db = new PipesDB({ url: 'https://pipesdb.com/tenant1' });
await db.connect();

// Wait for pipe to sync before using
const { data, isLoading } = db.getPipe('/examples', { sync: true });

// Return data while pipe is updating in the background
const { data, isLoading } = db.getPipe('/examples', { sync: false });

//
```

```javascript
/*
ReactNative
===========

Option 1:
  1) Display what we have now (offline, or just out of sync)
  2) Update list
  3) Display updated list

Option 2:
  1) await
  1) Update list
  2) Display updated list

Should we iterate over stale data?
const { data } = currentObjects.forEach(...);

vs.
const { data } = currentObjects.forEach(...);

*/
```
