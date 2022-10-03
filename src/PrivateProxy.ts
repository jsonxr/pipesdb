export class PrivateProxy<T extends object> {
  private _current: T;
  private _proxy?: T & Pick<PrivateProxy<T>, 'isDirty'>;
  private _isDirty = false;
  constructor(value: T) {
    this._current = JSON.parse(JSON.stringify(value));
  }
  isDirty() {
    return this._isDirty;
  }
  setDirty(value: boolean) {
    this._isDirty = value;
  }

  set value(value: T) {
    this._isDirty = false;
    const object: any = this._current;
    Object.keys(object).forEach(key => delete object[key]); // In case they've added properties...
    Object.assign(this._current, value);
  }

  get value(): T & Pick<PrivateProxy<T>, 'isDirty'> {
    if (!this._proxy) {
      //const allowed: (string | symbol)[] = ['isDirty'];
      const allowed: (keyof PrivateProxy<T>)[] = ['isDirty'];
      const handler: ProxyHandler<T> = {
        get: (target: T, p: PropertyKey, _receiver: any) => {
          let result = allowed.includes(p as any) && Reflect.get(this, p, this);
          result = result || Reflect.get(target, p, target);
          return result;
        },
        set: (target: T, p: string | symbol, newValue: any, receiver: any) => {
          const result = Reflect.set(target, p, newValue, receiver);
          if (result) {
            this.setDirty(true);
          }
          return result;
        },
      };

      this._proxy = new Proxy(this._current, handler) as any;
    }

    return this._proxy as any;
  }
}
