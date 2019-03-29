import TicketPrice from '../../models/TicketPrice';
import Localisation from '../../utils/Localisation';

/**
 * Formats the ticket price
 */
export default class TicketPriceFormatter {
  static format(loc: Localisation, price: TicketPrice): string {
    const opts = {
      currency: price.currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      style: 'currency',
    };
    return Intl.NumberFormat(loc.locale, opts).format(price.amount);
  }
}
