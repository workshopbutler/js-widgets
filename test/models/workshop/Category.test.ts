import * as chai from 'chai';
import * as mocha from 'mocha';
import Category from '../../../src/models/workshop/Category';

const expect = chai.expect;
describe('Category object', () => {

  it('should be created from a simple object', () => {
    const category = new Category({ id: 1, name: 'Test' });
    expect(category.id).to.equal(1);
    expect(category.name).to.equal('Test');
  });
});
