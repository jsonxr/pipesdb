import { PrivateProxy } from '../PrivateProxy';

describe('PrivateProxy', () => {
  it('constructor', () => {
    const value = { id: '1', name: 'Jason' };
    const priv = new PrivateProxy(value);
    expect(value).toEqual(priv.value);
  });
  it('should setDirty property', () => {
    const value = { id: '1', name: 'Jason' };
    const priv = new PrivateProxy(value);
    expect(priv.isDirty()).toEqual(false);
    priv.setDirty(true);
    expect(priv.isDirty()).toEqual(true);
  });
  it('should setDirty if proxy is changed', () => {
    const value = { id: '1', name: 'Jason' };
    const priv = new PrivateProxy(value);
    priv.value.name = 'Erin';
    expect(priv.isDirty()).toEqual(true);
  });
  it('should keep all proxies the same', () => {
    const value = { id: '1', name: 'Jason' };
    const priv = new PrivateProxy(value);

    const v1 = priv.value;
    priv.value = { id: '2', name: 'Erin' };
    const v2 = priv.value;

    expect(v1).toEqual(v2);
  });

  it('should restrict access to only isDirty from the proxy', () => {
    const value = { id: 1, name: 'Jason' };
    const priv = new PrivateProxy(value);
    const v1: any = priv.value;

    expect(v1.id).toEqual(value.id);
    expect(v1.name).toEqual(value.name);
    expect(v1.isDirty).toBeTruthy();
    expect(v1.setDirty).toBeFalsy();
  });
});
