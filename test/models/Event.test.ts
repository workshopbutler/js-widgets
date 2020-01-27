import * as chai from 'chai';
import CoverImage from '../../src/models/workshop/CoverImage';

const expect = chai.expect;

describe('Event object', () => {
  it('should produce a correct cover image', () => {
    const coverImage = CoverImage.fromJSON({ url: 'http://wsb.com'} );
    expect(coverImage.url).to.eq('http://wsb.com');
    expect(coverImage.thumbnail).to.eq(undefined);
  });
  it('should produce a correct empty cover image', () => {
    const coverImage = CoverImage.fromJSON();
    expect(coverImage.url).to.eq(undefined);
    expect(coverImage.thumbnail).to.eq(undefined);
  });
});
