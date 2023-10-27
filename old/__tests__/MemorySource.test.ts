import { ulid } from 'ws-routable';
import { ISyncObject, MemorySource } from '../storage/MemorySource';
import { IPipesClient, ISource, IStorage, PipeOptions } from '../types';

type Group = { key: string; group: string };
type Post = { key: string; post: string };

function range(min: number, max: number) {
  return new Array(max - min + 1).fill(undefined).map((_, k) => k + min);
}

const groups: ISyncObject<Group>[] = range(1, 3).map(i => {
  const key = i.toString().padStart(2, '0');
  const obj: ISyncObject<Group> = {
    path: '/groups',
    id: ulid(),
    key,
    value: {
      key,
      group: `group-g${key}`,
    },
  };
  return obj;
});

const posts = groups
  .map(g => {
    return range(1, 3).map(i => {
      const key = i.toString().padStart(2, '0');
      const obj: ISyncObject<Post> = {
        path: `/groups/${g.key}/posts`,
        key,
        id: ulid(),
        value: { key, post: `post-g${g.key}-p${key}` },
      };
      return obj;
    });
  })
  .flat(1);
console.log(groups);
console.log(posts);

const all = {
  byKey: {
    '/groups/a': { id: '/groups/1', key: '/groups/a', group: 'one' },
    '/groups/a/posts/d': { post: 'one' },
    '/groups/a/posts/d/messages/h': { message: 'one' },
    '/groups/a/posts/d/messages/i': { message: 'two' },
    '/groups/a/posts/e': { post: 'two' },
    '/groups/a/posts/e/messages/j': { message: 'three' },
    '/groups/a/posts/e/messages/k': { message: 'four' },
    '/users/a': { id: '/users/1', key: '/users/a', user: 'one' },
  },
};

describe('MemorySource', () => {
  it('', () => {});
});
