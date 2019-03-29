import * as chai from 'chai';
import * as mocha from 'mocha';
import LocationFormatter from '../../../src/formatters/jsonld/LocationFormatter';
import Location from '../../../src/models/Location';

const expect = chai.expect;
describe('JSON-LD LocationFormatter', () => {

  it('should produce null if the location is online', () => {
    const location = new Location({ online: true, country_code: '00', city: null });
    expect(LocationFormatter.format(location)).eq(null);
  });
  it('should produce a correct JSON for the address', () => {
    const location = new Location({ online: false, country_code: 'DE', city: 'Berlin' });
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
