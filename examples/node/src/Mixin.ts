export function mixin<T extends object, U extends object>(value: T, mixed: U, handler: ProxyHandler<T>): T & U {
  return new Proxy(value, {
    get(target: any, prop, receiver) {
      // If it exists on object, pass it on through
      let result = Reflect.get(mixed, prop, mixed); // Proxy methods first...
      result = result || Reflect.get(target, prop, receiver);
      return result;
    },
    set(obj, prop, value) {
      // If there is a handler, call it
      let result = handler.set?.(obj, prop, value, mixed);
      if (result) {
        return true;
      }

      // Set the mixin value if it exists...
      result = Reflect.get(mixed, prop, mixed);
      if (result) {
        return Reflect.set(mixin, prop, value, mixin);
      }

      // All other values get set on this object
      obj[prop] = value;
      return true;
    },
  });
}

function PublicMixin() {
  let _isdirty = false;
  let _value: any;
  const mixMethods = {
    isDirty() {
      return _isdirty;
    },
  };
  return mixMethods;
}

type E = { id: number; name: string };
const value: E = { id: 1, name: 'Jason' };
class PrivateMixin<T extends object> {
  private _isDirty = false;
  private _isValue: T;

  constructor(value: T, props: (keyof PrivateMixin<T>)[]) {
    this._isValue = value;
    const handler: ProxyHandler<PrivateMixin<T>> = {
      get: (target: PrivateMixin<T>, p: string | symbol, receiver: any) => {
        // if (props.includes(p as any)) {
        //   return undefined;
        // }
        return Reflect.get(target, p, target);
      },
      set: (target: PrivateMixin<T>, p: string | symbol, newValue: any, receiver: any) => {
        this._isDirty = true;
        return Reflect.set(target, p, newValue, receiver);
      },
    };
    return new Proxy(this, handler);
  }
  isDirty() {
    return this._isDirty;
  }
}

function proxyObject<T extends object>(value: T, props: (keyof PrivateMixin<T>)[]): PrivateMixin<T> & T {
  const proxy = new PrivateMixin(value, props);
  return proxy as any;
}

const my = proxyObject(value, ['isDirty']);
console.log(my, my.isDirty());
my.name = 'Erin';
console.log(my, my.isDirty());

// const publicMixin = PublicMixin();
// const proxy = mixin(value, publicMixin, {
//   set(obj, prop, value, receiver) {
//     console.log('setting ', prop, value);
//     receiver.setDirty(true);
//     return false;
//   },
// });

// console.log(proxy.id, proxy.name, proxy.isDirty());

// proxy.name = 'Erin';
// console.log(proxy.id, proxy.name, proxy.isDirty());
