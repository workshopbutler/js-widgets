import * as chai from 'chai';
import {absoluteURL, safeHref} from '../../../src/common/helpers/UrlParser';
import {eraseLocation, setLocation} from '../../testutils/location';

describe('absoluteUrl function', () => {
  it('should return the original URL if it is absolute', () => {
    const url = 'https://workshopbutler.com/buy';
    chai.expect(absoluteURL(url)).to.eq(url);
  });
  it('should return the original URL if it is relative but `window` object is not found', () => {
    const url = '/buy';
    chai.expect(absoluteURL(url)).to.eq(url);
  });
  it('should return an absolute URL if the `window` object is found', () => {
    const url = '/buy';
    setLocation('http://localhost:8081');
    chai.expect(absoluteURL(url)).to.eq('http://localhost:8081/buy');
    eraseLocation();
  });
});
