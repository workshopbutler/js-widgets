import {Place, PostalAddress} from 'schema-dts';
import Location from '../../models/workshop/Location';

/**
 * JSON-LD format a location
 */
export default class LocationFormatter {
  static format(location: Location): Place | null {
    if (location.online) {
      return null;
    } else {
      const address: PostalAddress = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '@type': 'PostalAddress',
        'addressCountry': location.countryCode,
        'addressLocality': location.city ? location.city : '',
      };
      return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '@type': 'Place',
        address,
      };
    }
  }
}
