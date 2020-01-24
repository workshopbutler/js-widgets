import IFreeTicketType from '../../interfaces/IFreeTicketType';
import IPaidTicketType from '../../interfaces/IPaidTicketType';

/**
 * Workshop tickets, either free or paid, depending on the type of the workshop
 */
export default class Tickets {
  paid: IPaidTicketType[];
  free?: IFreeTicketType;

  /**
   * Returns the id of the first active paid ticket if it exists
   */
  readonly selectedTicketId: string | null;

  /**
   * @param paidTickets {array}
   * @param freeTicket {object|null}
   *
   */
  constructor(paidTickets: IPaidTicketType[] = [], freeTicket?: IFreeTicketType) {
    this.paid = paidTickets;
    this.free = freeTicket;
    this.selectedTicketId = this.getActiveTicketId();
  }

  /**
   * Returns true if the event either has no paid tickets or has an unlimited number of free tickets
   */
  isEmpty() {
    if (this.free) {
      return this.free.withUnlimitedSeats();
    } else {
      return this.paid.length === 0;
    }
  }

  getActiveTicketId() {
    const active = this.getActiveTicket();
    if (active) {
      return active.id;
    } else {
      return null;
    }
  }


  /**
   * Returns true if the event has tickets to buy/acquire
   */
  nonEmpty() {
    return !this.isEmpty();
  }


  protected getActiveTicket() {
    const active = this.getActive();
    if (active.length) {
      return active[0];
    } else {
      return null;
    }
  }

  /**
   * Returns active paid types, which a user can register to
   * @return {IPaidTicketType[]}
   */
  protected getActive() {
    return this.paid.filter(ticket => ticket.active());
  }

}
