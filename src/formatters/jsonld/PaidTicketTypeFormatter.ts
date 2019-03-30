import URI from 'urijs';
import IPaidTicketType from '../../interfaces/IPaidTicketType';
import IPlainObject from '../../interfaces/IPlainObject';

export default class PaidTicketTypeFormatter {
  /**
   * Produces JSON-LD for a paid ticket type
   * @param ticketType {IPaidTicketType} Ticket type
   * @param url {string | null} URL of the registration page
   */
  static format(ticketType: IPaidTicketType, url?: string): IPlainObject {
    const json: IPlainObject = {
      '@type': 'Offer',
      'price': ticketType.price.amount,
      'priceCurrency': ticketType.price.currency,
      'validFrom': ticketType.start.toISO({ suppressMilliseconds: true, suppressSeconds: true }),
    };
    const availability = this.availability(ticketType);
    if (availability) {
      json.availability = availability;
    }
    if (url) {
      const uri = new URI(url);
      uri.addQuery('ticket', ticketType.id);
      json.url = uri.valueOf();
    }
    return json;
  }

  /**
   * Returns availability value
   * @param ticketType {IPaidTicketType} Ticket type
   */
  protected static availability(ticketType: IPaidTicketType): string | null {
    const url = 'https://schema.org/';
    if (ticketType.inFuture()) {
      return null;
    }
    let state = 'InStock';
    if (ticketType.soldOut() || ticketType.ended()) {
      state = 'SoldOut';
    }
    return `${url}${state}`;
  }
}
