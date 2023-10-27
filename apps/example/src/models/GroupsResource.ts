import { type ResourceConfig } from '@jsonxr/offlinedb';
import { minLength, object, string, type Output } from 'valibot'; // 0.77 kB

const GroupSchema = object({
  key: string('', [minLength(1)]),
  name: string('Must be a string', [
    minLength(3, 'Your name must be at least three characters'),
  ]),
});
export type Group = Output<typeof GroupSchema>;

export const GroupsResource: ResourceConfig<Group> = {
  schema: GroupSchema,
  path: 'groups',
};
