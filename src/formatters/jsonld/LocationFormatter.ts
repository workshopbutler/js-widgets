import {Place, PostalAddress} from 'schema-dts';
import Location from '../../models/Location';

/**
 * JSON-LD format a location
 */
export default class LocationFormatter {
  static format(location: Location): Place | null {
    if (location.online) {
      return null;
    } else {
      const address: PostalAddress = {
        '@type': 'PostalAddress',
        'addressCountry': location.countryCode,
        'addressLocality': location.city ? location.city : '',
      };
      return {
        '@type': 'Place',
        'address': address,
      };
    }
  }
}
