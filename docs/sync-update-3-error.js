// Non-Stale Object update...
//------------------------------------------------------------------------------
// Server object...

const pipe = {
  head: 1, // most recent ulid...
};
// We know this pipe is up to date because our messageNo matches serverMessageNo
// fetch('mypipe', 1)

//--------------------------------------
// State 1, Fresh object
//--------------------------------------
const s1 = { key: '1', name: 'original', phone: 'original', cid: 'c1', sid: 's1' };

// Fresh fetch from server (last=0)
const o1 = {
  server: { key: '1', name: 'original', phone: 'original', cid: 'c1', sid: 's1' },
  client: undefined,
};
// o2.isDirty: false; -----> () => client === undefined

//--------------------------------------
// State 2, Modify object
//--------------------------------------

// Modify locally
const o2 = {
  server: { key: '1', name: 'original', phone: 'original', cid: 'c1', sid: 's1' },
  client: { key: '1', name: 'local-change', phone: 'original', cid: 'c2', sid: 's1' },
};
// o2.isDirty: true; -----> () => client !== undefined

//--------------------------------------
// State 3, Server sync
//--------------------------------------
//    SAFE: The server ids DO NOT match... o2.sid !== s1.sid
//    If the server ids don't match, we can
//      1) Update based on who was last...  o2.cid > s1.id
//      2) Return an error if server id's don't match
//      3) Field by field comparison to see if it's safe to match? Requires sending the delta only
//
//    We will use last update wins, but assume we have the oldest and therefore this update doesn't happen
const s2 = { key: '1', name: 'local-change', phone: 'original', cid: 'c3', sid: 's3' };

//--------------------------------------
// State 4, Client receives sync
//--------------------------------------
//    Receives server message...
//      { key: '1', name: 'local-change', phone: 'original', cid: 'c3', sid: 's3' }
//
//    find record by key==='1'
//      {
//        server: { key: '1', name: 'original', phone: 'original', cid: 'c1', sid: 's1' },
//        client: { key: '1', name: 'local-change', phone: 'original', cid: 'c2', sid: 's1' },
//      }
//
//    No conflict...
//      server.cid === client.cid

const stale = {
  server: { key: '1', name: 'remote-change', phone: 'original', cid: 'c3', sid: 's3' },
  from: { key: '1', name: 'original', phone: 'original', cid: 'c1', sid: 's1' },
  client: { key: '1', name: 'local-change', phone: 'original', cid: 'c2', sid: 's1' },
};
