import {DateTime} from 'luxon';
import TicketPrice from '../models/workshop/TicketPrice';
import ITicketType from './ITicketType';

export default interface IPaidTicketType extends ITicketType {
  readonly id: string;
  readonly name: string;
  readonly numberOfTickets: number;
  readonly numberOfTicketsLeft: number;
  readonly start: DateTime;
  readonly end: DateTime;

  /**
     * True when a sales tax is NOT included in the price
     */
  readonly excludedTax: boolean;
  readonly price: TicketPrice;

  /**
     * Returns true if the tickets of this type can be bought
     * @return {boolean}
     */
  active(): boolean;

  /**
     * Returns true if the sales of tickets of this type have ended
     * @return {boolean}
     */
  ended(): boolean;

  /**
     * Returns true if the tickets of this type can be bought later, in future
     * @return {boolean}
     */
  inFuture(): boolean;

  /**
     * Returns true if no more seats left
     * @return {boolean}
     */
  soldOut(): boolean;
}
