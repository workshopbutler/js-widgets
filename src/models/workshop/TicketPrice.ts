import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Price for a workshop ticket
 */
export default class TicketPrice {

  static fromJSON(json: IPlainObject): TicketPrice {
    const amount = json.amount / 100;
    const tax = json.tax / 100;
    return new TicketPrice(amount, tax, json.currency, json.sign);
  }

  constructor(readonly amount: number,
              readonly tax: number,
              readonly currency: string,
              readonly sign: string) {
  }

  /**
   * Returns a new ticket price object with the given amount
   * @param amount {number} New ticket amount
   */
  withAmount(amount: number): TicketPrice {
    return new TicketPrice(amount, this.tax, this.currency, this.sign);
  }

  getAmount(appendTax = false): number {
    return this.amount + (appendTax ? this.tax : 0);
  }
}
