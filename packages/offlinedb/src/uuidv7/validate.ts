import REGEX from './regex.js';

export function validate(uuid: string) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}
