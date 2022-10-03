import { ulidFactory } from 'ulid-workers';
const ulid = ulidFactory();

export type Example = {
  key: string;
  name: string;
};

export function getExample(postfix: string): any {
  const key = ulid();
  const example: Example = { key, name: `${key}-${postfix}` };
  return example;
}

export function createList(postfix: string) {
  const values: any[] = [];
  for (let i = 0; i < 10; i++) {
    values.push(getExample(postfix));
  }
  return values;
}

export const db = {
  examples: createList('cache') as Example[],
};
