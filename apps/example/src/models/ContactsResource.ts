import { type ResourceConfig } from '@jsonxr/offlinedb';
import { minLength, object, string, type Output } from 'valibot'; // 0.77 kB

const ContactSchema = object({
  key: string('', [minLength(1)]),
  name: string('Must be a string', [
    minLength(3, 'Your name must be at least three characters'),
  ]),
  phone: string(),
});
export type Contact = Output<typeof ContactSchema>;

export const ContactsResource: ResourceConfig<Contact> = {
  schema: ContactSchema,
  path: 'contacts',
};
