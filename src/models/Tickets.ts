import IFreeTicketType from "../interfaces/IFreeTicketType";
import IPaidTicketType from "../interfaces/IPaidTicketType";

/**
 * Workshop tickets, either free or paid, depending on the type of the workshop
 */
export default class Tickets {
    paid: IPaidTicketType[];
    free?: IFreeTicketType;

    /**
     * @param paidTickets {array}
     * @param freeTicket {object|null}
     *
     */
    constructor(paidTickets: IPaidTicketType[] = [], freeTicket?: IFreeTicketType) {
        this.paid = paidTickets;
        this.free = freeTicket;
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
            return active.id
        } else {
            return null;
        }
    }

    getActiveTicket() {
        const active = this.getActive();
        if (active.length) {
            return active[0];
        } else {
            return null;
        }
    }

    /**
     * Returns number of all tickets left, for all valid and future types, or null if there is no limitation
     * @return {any}
     */
    getNumberOfSeatsLeft() {
        function sum(total: number, number: number) {
            return total + number;
        }

        if (this.free) {
            if (this.free.numberOfTicketsLeft >= 0) {
                return this.free.numberOfTicketsLeft;
            } else {
                return null;
            }
        } else {
            const active = this.getActive().map(event => event.numberOfTicketsLeft);
            const future = this.getFuture().map(event => event.numberOfTicketsLeft);
            return active.reduce(sum, 0) + future.reduce(sum, 0);
        }
    }

    /**
     * Returns active paid types, which a user can register to
     * @return {IPaidTicketType[]}
     */
    protected getActive() {
        return this.paid.filter(ticket => ticket.isActive());
    }

    protected getFuture() {
        return this.paid.filter(ticket => ticket.isInFuture());
    }

    /**
     * Returns true if the event has tickets to buy/acquire
     */
    nonEmpty() {
        return !this.isEmpty();
    }
}
