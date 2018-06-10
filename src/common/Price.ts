import TicketPrice from "../models/TicketPrice";

/**
 * Returns formatted price
 * @param price {object} Price ({ currency: "EUR", numberOfTickets: 100 })
 * @param withVAT {boolean} True if VAT should be included
 */
export function formatPrice(price: TicketPrice, withVAT: boolean): string {
    const amount = Intl.NumberFormat('en-IN',
        { style: 'currency', currency: price.currency, maximumFractionDigits: 2 }).format(price.amount);
    let vat = '';
    if (withVAT) {
        vat = ' + VAT';
    }
    return amount + vat;
}
