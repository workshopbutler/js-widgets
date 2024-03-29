import { DateTime, getLocalTime } from '../../utils/Time';
import IPaidTicketType from '../../interfaces/IPaidTicketType';
import IPlainObject from '../../interfaces/IPlainObject';
import TicketPrice from './TicketPrice';

/**
 * A default implementation of IPaidTicketType interface
 */
export default class PaidTicketType implements IPaidTicketType {

  static fromJSON(json: IPlainObject, timezone?: string | undefined): PaidTicketType {
    const options = timezone ? { zone: timezone } : { setZone: true };
    const start = json.start ? DateTime.fromISO(json.start, options) : undefined;
    const end = json.end ? DateTime.fromISO(json.end, options) : undefined;
    const price = TicketPrice.fromJSON(json.price);
    return new PaidTicketType(json.id, json.name, json.total, json.left, start, end, price);
  }

  readonly id: string;
  readonly name: string;
  readonly numberOfTickets: number;
  readonly numberOfTicketsLeft: number;
  readonly start?: DateTime;
  readonly end?: DateTime;
  readonly price: TicketPrice;

  constructor(
    id: string,
    name: string,
    total: number,
    left: number,
    start: DateTime | undefined,
    end: DateTime | undefined,
    price: TicketPrice
  ) {
    this.id = id;
    this.name = name;
    this.numberOfTickets = total;
    this.numberOfTicketsLeft = left;
    this.start = start;
    this.end = end;
    this.price = price;
  }

  /**
   * Returns true if the tickets of this type can be bought
   * @return {boolean}
   */
  active(): boolean {
    return !this.soldOut() && !this.ended() && !this.inFuture();
  }

  /**
   * Returns true if the tickets of this type can be bought later, in future
   * @return {boolean}
   */
  inFuture(): boolean {
    return this.start ? this.start > getLocalTime() : false;
  }

  /**
   * Returns true if no more seats left
   * @return {boolean}
   */
  soldOut(): boolean {
    return this.numberOfTicketsLeft < 1;
  }

  /**
   * Returns true if the sales of tickets of this type have ended
   * @return {boolean}
   */
  ended(): boolean {
    return this.end ? this.end < getLocalTime() : false;
  }

  /**
   * All paid ticket types have a limitation for a number of tickets
   */
  withoutLimit(): boolean {
    return false;
  }
}
