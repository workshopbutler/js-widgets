import * as chai from 'chai';
import {safeHref} from '../../../src/common/helpers/UrlParser';
import {eraseLocation, setLocation} from '../../testutils/location';

describe('safeHref function', () => {
  it('should return null if `window` object is not found', () => {
    chai.expect(safeHref()).to.eq(undefined);
  });
  it('should return the href', () => {
    setLocation('https://wsb.com/buy/ticket');
    chai.expect(safeHref()).to.eq('https://wsb.com/buy/ticket');
    eraseLocation();
  });
});
