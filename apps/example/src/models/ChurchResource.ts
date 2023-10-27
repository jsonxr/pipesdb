import { type ResourceConfig } from '@jsonxr/offlinedb';
import { email, minLength, object, string, type Output } from 'valibot'; // 0.77 kB

const ChurchSchema = object({
  key: string('', [minLength(1)]),
  name: string('Must be a string', [
    minLength(3, 'Your name must be at least three characters'),
  ]),
  email: string('Your email must be a string', [
    minLength(5, 'Please enter your email'),
    email('The Email is badly formatted'),
  ]),
});
export type Church = Output<typeof ChurchSchema>;

export const ChurchResource: ResourceConfig<Church> = {
  schema: ChurchSchema,
  path: 'churches',
};
