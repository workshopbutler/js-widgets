import Location from '../../models/workshop/Location';
import Localisation from '../../utils/Localisation';

/**
 * Format a location
 */
export default class LocationFormatter {
    static format(loc: Localisation, location: Location): string {
        if (location.online) {
            return loc.translate('country.00');
        } else {
            return location.city + ', ' + loc.translate(`country.${location.countryCode}`) || '';
        }
    }
}
