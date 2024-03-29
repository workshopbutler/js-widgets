import Localisation from '../../utils/Localisation';
import PaidTickets from '../workshop/PaidTickets';
import TicketPriceFormatter from '../../formatters/plain/TicketPriceFormatter';
import Formatter from '../../formatters/plain/Formatter';
import TicketPrice from '../workshop/TicketPrice';

export default class TicketSummary {

  constructor(protected readonly loc: Localisation,
              protected readonly formatter: Formatter) {
  }

  render(tickets: PaidTickets): string {
    const ticket = tickets.firstActiveTicket();
    if (!ticket) {
      return '';
    }
    const lines = [];
    const ticketPrice = TicketPriceFormatter.format(this.loc, ticket.price);
    lines.push(this.renderLine(this.loc.translate('form.summary.price'), ticketPrice));
    if (tickets.excludedTax && tickets.tax) {
      const taxObject = ticket.price.withAmount(ticket.price.amount * tickets.tax / 100);
      const taxAmount = TicketPriceFormatter.format(this.loc, taxObject);
      lines.push(this.renderLine(this.loc.translate('form.summary.tax'), taxAmount));
    }
    if (!tickets.excludedTax) {
      lines.push(this.renderLine(this.loc.translate('form.summary.tax'), this.loc.translate('form.summary.included')));
    }
    const finalPrice = TicketPriceFormatter.format(this.loc, this.getFinalPrice(ticket.price, tickets.tax));
    const total = this.renderLine(this.loc.translate('form.summary.total'), finalPrice);
    return `${lines.join('')}<hr>${total}`;
  }

  protected getFinalPrice(price: TicketPrice, tax: number | null): TicketPrice {
    return tax ? price.withAmount(price.amount * (1 + tax / 100)) : price;
  }

  protected renderLine(label: string, value: string): string {
    return `<p><span>${label}:</span> <strong>${value}</strong></p>`;
  }}
