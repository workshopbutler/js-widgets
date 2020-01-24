import Event from '../Event';
import FreeTicketType from './FreeTicketType';
import PaidTickets from './PaidTickets';

export default class EventState {

  constructor(protected readonly event: Event) {}

  /**
     * Returns true if the registrations for this event are open
     */
  open(): boolean {
    return !this.closed();
  }

  /**
     * Returns true if the registrations for this event are closed
     */
  closed(): boolean {
    if (this.event.schedule.ended()) {
      return true;
    } else if (this.event.private) {
      return true;
    } else if (!this.event.tickets) {
      return false;
    } else if (this.event.tickets instanceof FreeTicketType && this.event.tickets.soldOut()) {
      return true;
    } else if (this.event.tickets instanceof PaidTickets && this.event.tickets.types.length > 0) {
      let soldOut = true;
      this.event.tickets.types.forEach(item => {
        if (item.active()) {
          soldOut = false;
        }
      });
      return soldOut;
    } else {
      return false;
    }
  }

  /**
     * Returns the reason why the registrations are closed or 'null' if they are open
     */
  reason(): string | null {
    if (this.event.schedule.ended() || !this.event.tickets) {
      return 'event.state.ended';
    } else if (this.event.private) {
      return 'event.state.private';
    } else if (!this.event.tickets) {
      return null;
    } else if (this.event.tickets instanceof FreeTicketType && this.event.tickets.soldOut()) {
      return 'event.state.soldOut';
    } else if (this.event.tickets instanceof PaidTickets && this.event.tickets.types.length > 0) {
      let soldOut = true;
      this.event.tickets.types.forEach(item => {
        if (item.active()) {
          soldOut = false;
        }
      });
      return soldOut ? 'event.state.soldOut' : null;
    } else {
      return null;
    }
  }
}
