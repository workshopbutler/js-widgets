import Localisation from "../utils/Localisation";
import TicketPrice from "../models/TicketPrice";

/**
 * Formats the ticket price
 */
export default class TicketPriceFormatter {
    static format(loc: Localisation, price: TicketPrice): string {
        const opts = { style: 'currency',
            currency: price.currency,
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        };
        return Intl.NumberFormat(loc.locale, opts).format(price.amount);
    }
}
