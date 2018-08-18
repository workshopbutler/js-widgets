import Localisation from "../utils/Localisation";
import IPaidTicketType from "../interfaces/IPaidTicketType";
import DateTimeFormatter from "./DateTimeFormatter";
import ITicketType from "../interfaces/ITicketType";
import PaidTicketType from "../models/PaidTicketType";

/**
 * Formats a ticket
 */
export default class TicketFormatter {
    static format(loc: Localisation, ticket: ITicketType, type: string | null): string {
        switch (type) {
            case 'desc':
                if (ticket instanceof PaidTicketType) {
                    return this.formatDescription(loc, <PaidTicketType>ticket);
                } else {
                    return '';
                }
            default:
                return this.formatState(loc, ticket)
        }
    }

    protected static formatState(loc: Localisation, ticket: ITicketType): string {
        if (ticket.soldOut()) {
            return loc.translate('event.ticket.soldOut');
        } else if (ticket instanceof PaidTicketType && (<PaidTicketType>ticket).ended()) {
            return loc.translate('event.ticket.ended');
        } else {
            if (ticket.withoutLimit()) {
                return '';
            } else {
                return loc.translate('event.ticket.left',{ count: ticket.numberOfTicketsLeft})
            }
        }
    }
    protected static formatDescription(loc: Localisation, ticket: IPaidTicketType): string {
        if (ticket.ended()) {
            return loc.translate('event.ticket.endedOn', { date: DateTimeFormatter.format(loc, ticket.end)});
        }
        if (ticket.active()) {
            return loc.translate('event.ticket.endsOn', { date: DateTimeFormatter.format(loc, ticket.end)});
        }
        return loc.translate('event.ticket.onSaleFrom', { date: DateTimeFormatter.format(loc, ticket.start)});
    }
}
