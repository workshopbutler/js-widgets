import * as chai from 'chai';
import CoverImage from '../../../src/models/workshop/CoverImage';

const expect = chai.expect;
describe('CoverImage object', () => {

  it('should correctly handle empty urls', () => {
    const image = new CoverImage({ url: null, thumbnail: null });
    expect(image.url).to.equal(undefined);
    expect(image.thumbnail).to.equal(undefined);
  });
  it('should correctly handle non-empty urls', () => {
    const image = new CoverImage({ url: 'http://wsb.com', thumbnail: 'http://thumbnail.com' });
    expect(image.url).to.equal('http://wsb.com');
    expect(image.thumbnail).to.equal('http://thumbnail.com');
  });
  it('should correctly handle an incorrect JSON', () => {
    const image = new CoverImage({ path: 'http://wsb.com', thumb: 'http://thumbnail.com' });
    expect(image.url).to.equal(undefined);
    expect(image.thumbnail).to.equal(undefined);
  });
});
