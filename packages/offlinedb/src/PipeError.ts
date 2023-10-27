export type PipesErrorCode = 'PIPEID_INVALID_STRING' | 'PIPEID_INVALID_BYTES' | 'PIPEID_INVALID_OPTION';

export class PipesError extends Error {
  code: PipesErrorCode;
  private constructor(code: PipesErrorCode, message: string) {
    super('PipesDb: ' + message);
    this.code = code;
  }

  static PIPEID_INVALID_STRING = () =>
    new PipesError('PIPEID_INVALID_STRING', `Invalid string. Either uuid format or base58`);
  static PIPEID_INVALID_BYTES = () => new PipesError('PIPEID_INVALID_BYTES', 'Uint8Array must be of length 16.');
  static PIPEID_INVALID_OPTION = () => new PipesError('PIPEID_INVALID_OPTION', 'Invalid option passed in');
}
