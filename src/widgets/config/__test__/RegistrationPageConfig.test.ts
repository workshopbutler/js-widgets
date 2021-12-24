import * as chai from 'chai';
import RegistrationPageConfig from '../RegistrationPageConfig';
import IPlainObject from '../../../interfaces/IPlainObject';

const expect = chai.expect;

class TestConfig extends RegistrationPageConfig {
  constructor(options: IPlainObject) {
    super(options);
  }
}

describe('Configurations for searchToFormField', () => {
  it('should be empty', () => {
    const config = new TestConfig({});
    expect(config.searchToFieldConfigs).to.be.empty;
  });
  it('should be empty if `forwardSearchParams` value is wrongly formatted', () => {
    const config = new TestConfig({forwardSearchParams: false});
    expect(config.searchToFieldConfigs).to.be.empty;
  });
  it('should have one item with id=`ref`', () => {
    const config = new TestConfig({forwardSearchParams: [{name: 'ref', to: 'reference', hidden: true}]});
    expect(config.searchToFieldConfigs.has('ref')).to.be.true;
    const value = config.searchToFieldConfigs.get('ref');
    expect(value?.to).to.be.equal('reference');
    expect(value?.hidden).to.be.true;
  });
  it('should set `to` to its name if the parameter is missing', () => {
    const config = new TestConfig({forwardSearchParams: [{name: 'ref', hidden: true}]});
    const value = config.searchToFieldConfigs.get('ref');
    expect(value?.to).to.be.equal('ref');
  });
  it('should set `to` to its name if the parameter is bad', () => {
    const config = new TestConfig({forwardSearchParams: [{name: 'ref', to: true, hidden: true}]});
    const value = config.searchToFieldConfigs.get('ref');
    expect(value?.to).to.be.equal('ref');
  });
  it('should set `hidden` to `false` if the parameter is missing', () => {
    const config = new TestConfig({forwardSearchParams: [{name: 'ref', to: true}]});
    const value = config.searchToFieldConfigs.get('ref');
    expect(value?.hidden).to.be.false;
  });
  it('should set `hidden` to `false` if the parameter is bad', () => {
    const config = new TestConfig({forwardSearchParams: [{name: 'ref', hidden: 'ref'}]});
    const value = config.searchToFieldConfigs.get('ref');
    expect(value?.hidden).to.be.false;
  });
  it('should set two configs', () => {
    const config = new TestConfig({
      forwardSearchParams: [
        {name: 'ref', hidden: 'ref'},
        {name: 'ref2', to: 'reference2'},
        {to: 'reference3', hidden: true}, // this must be excluded as it has no name
      ],
    });
    expect(config.searchToFieldConfigs).to.has.lengthOf(2);
    expect(config.searchToFieldConfigs.has('ref')).to.be.true;
    expect(config.searchToFieldConfigs.has('ref2')).to.be.true;
  });
});
