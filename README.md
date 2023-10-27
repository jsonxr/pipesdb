# PipesDb

Realtime Streaming Database based on Event Sourcing.

## Use in Node

If using inside node, this needs to be before the import of ws-routable

```js
global.WebSocket = require('isomorphic-ws');
global.crypto = require('crypto').webcrypto;
```

## Single User Cloud?

TODO: iPhone [CloudKit](https://developer.apple.com/forums/thread/69716)

TODO: Android [Google Drive](https://developers.google.com/drive/api)
