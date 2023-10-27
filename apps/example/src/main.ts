import { Client, Remote, SqliteStorage } from '@jsonxr/offlinedb';

import { ChurchResource } from './models/ChurchResource.js';
import { ContactsResource } from './models/ContactsResource.js';
import { GroupsResource } from './models/GroupsResource.js';

const remote = new Remote();

const client = new Client({
  tenant: 'gulfbreeze',
  storage: new SqliteStorage('pipes.db', {
    //verbose: console.log
  }),
  remote,
  resources: {
    churches: ChurchResource,
    groups: GroupsResource,
    contacts: ContactsResource,
  },
});

for (let i = 0; i < 3; i++) {
  const event = await client.resources.churches.put({
    key: `${i}`,
    name: 'Concord Church of Gulf Breeze',
    email: 'concord@church.com',
  });
}

const list = await client.resources.churches.list();
console.log(list);
