import * as chai from 'chai';
import LocationFormatter from '../../../src/formatters/jsonld/LocationFormatter';
import Location from '../../../src/models/workshop/Location';

const expect = chai.expect;
describe('JSON-LD LocationFormatter', () => {

  it('should produce null if the location is online', () => {
    const location = new Location(true, '00');
    expect(LocationFormatter.format(location)).eq(null);
  });
  it('should produce a correct JSON for the address', () => {
    const location = new Location(false, 'DE', 'Berlin');
    const json = {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'DE',
        'addressLocality': 'Berlin',
      },
    };
    expect(JSON.stringify(LocationFormatter.format(location))).eq(JSON.stringify(json));
  });
});
