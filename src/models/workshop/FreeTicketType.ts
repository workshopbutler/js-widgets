import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Free ticket type
 */
export default class FreeTicketType {

  static fromJSON(json: IPlainObject): FreeTicketType {
    return new FreeTicketType(json.total, json.left, json.unlimited);
  }

  readonly numberOfTickets: number;
  readonly numberOfTicketsLeft: number;
  private readonly unlimited: boolean;

  constructor(total: number, left: number, unlimited: boolean) {
    this.numberOfTickets = total;
    this.numberOfTicketsLeft = left;
    this.unlimited = unlimited;
  }

  /**
   * Returns true if no more seats left
   * @return {boolean}
   */
  soldOut(): boolean {
    return this.unlimited ? false : this.numberOfTicketsLeft === 0;
  }

  withUnlimitedSeats(): boolean {
    return this.unlimited;
  }

  /**
   * Returns true if there is no limitation for a number of tickets
   */
  withoutLimit(): boolean {
    return this.unlimited;
  }
}
