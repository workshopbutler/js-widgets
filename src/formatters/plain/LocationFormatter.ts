import Location from '../../models/workshop/Location';
import Localisation from '../../utils/Localisation';

/**
 * Format a location or country
 */
export default class LocationFormatter {
  static format(loc: Localisation, location: Location | string): string {
    if (location instanceof Location) {
      return this.formatObject(loc, location);
    } else {
      return loc.translate('country.' + location);
    }
  }

  protected static formatObject(loc: Localisation, location: Location): string {
    if (location.online) {
      return loc.translate('country.00');
    } else {
      return location.city + ', ' + loc.translate(`country.${location.countryCode}`) || '';
    }
  }

}
