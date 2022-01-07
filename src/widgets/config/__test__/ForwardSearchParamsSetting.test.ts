import * as chai from 'chai';
import ForwardSearchParamsSetting from '../ForwardSearchParamsSetting';

const expect = chai.expect;

describe('A parameter passQueryParams ', () => {
  it('should = false', () => {
    const setting = new ForwardSearchParamsSetting(false);
    expect(setting.forward).to.equal(false);
  });
  it('should = false for empty config', () => {
    const setting = new ForwardSearchParamsSetting(undefined);
    expect(setting.forward).to.equal(false);
  });
  it('should = true', () => {
    const setting = new ForwardSearchParamsSetting(true);
    expect(setting.forward).to.equal(true);
  });
  it('should = true', () => {
    const setting = new ForwardSearchParamsSetting('test,body,test');
    expect(setting.forward).to.equal(true);
  });
});

describe('A parameter passOnlyParams ', () => {
  it('should = false', () => {
    const setting = new ForwardSearchParamsSetting(false);
    expect(setting.limitParams).to.have.lengthOf(0);
  });
  it('should = false for empty config', () => {
    const setting = new ForwardSearchParamsSetting(undefined);
    expect(setting.limitParams).to.have.lengthOf(0);
  });
  it('should = true', () => {
    const setting = new ForwardSearchParamsSetting(true);
    expect(setting.limitParams).to.have.lengthOf(0);
  });
  it('should = true', () => {
    const setting = new ForwardSearchParamsSetting('test,body,test');
    expect(setting.limitParams).to.have.all.keys(['test', 'body']);
  });
});

describe('URL, produced by createUrl, ', () => {
  it('should = /register', () => {
    const setting = new ForwardSearchParamsSetting(false);
    const url = setting.createUrl('/register', {});
    expect(url).to.equal('/register');
  });
  it('should = /register?id=12', () => {
    const setting = new ForwardSearchParamsSetting(false);
    const url = setting.createUrl('/register', {id: 12});
    expect(url).to.equal('/register?id=12');
  });
  it('should = /register?id=12&ref=milk', () => {
    const setting = new ForwardSearchParamsSetting(false);
    const url = setting.createUrl('/register', {id: 12, ref: 'milk'});
    expect(url).to.equal('/register?id=12&ref=milk');
  });
  it('should = /register?test=true&ref=milk&id=12', () => {
    const setting = new ForwardSearchParamsSetting(true);
    const windowRef = global.window;
    // @ts-ignore: stub window object
    global.window = {
      // @ts-ignore: stub window object
      location: {
        search: '?test=true&ref=bread',
      },
    };
    const url = setting.createUrl('/register', {id: 12, ref: 'milk'});
    expect(url).to.equal('/register?test=true&ref=milk&id=12');
    // @ts-ignore: stub window object
    global.window = windowRef;
  });
  it('should = /register?test=true&body=slim&id=12&ref=milk', () => {
    const setting = new ForwardSearchParamsSetting('test,body');
    const windowRef = global.window;
    // @ts-ignore: stub window object
    global.window = {
      // @ts-ignore: stub window object
      location: {
        search: '?test=true&foot=big&body=slim',
      },
    };
    const url = setting.createUrl('/register', {id: 12, ref: 'milk'});
    expect(url).to.equal('/register?test=true&body=slim&id=12&ref=milk');
    // @ts-ignore: stub window object
    global.window = windowRef;
  });
});
