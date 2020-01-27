import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Price for a workshop ticket
 */
export default class TicketPrice {

  static fromJSON(json: IPlainObject): TicketPrice {
    const amount = json.amount / 100;
    return new TicketPrice(amount, json.currency, json.sign);
  }

  constructor(readonly amount: number,
              readonly currency: string,
              readonly sign: string) {
  }

  /**
   * Returns a new ticket price object with the given amount
   * @param amount {number} New ticket amount
   */
  withAmount(amount: number): TicketPrice {
    return new TicketPrice(amount, this.currency, this.sign);
  }
}
