import {formatDate} from "./Date";
import IPaidTicketType from "../interfaces/IPaidTicketType";
import ITicketType from "../interfaces/ITicketType";

/**
 * Returns both ticket type state description and number of tickets left
 * @param ticketType {object} Ticket type
 * @returns {*}
 */
export function getCombinedTicketTypeDescription(ticketType: IPaidTicketType): string {
    if (ticketType.isSoldOut()) {
        return 'Sold out';
    } else {
        if (ticketType.isEnded()) {
            return 'Ended on ' + formatDate(ticketType.end);
        }
        const numberOfTickets = printNumberOfTickets(ticketType.numberOfTicketsLeft);
        if (ticketType.isActive()) {
            return numberOfTickets + ', ends on ' +  formatDate(ticketType.end);
        }
        return numberOfTickets + ', on sale from ' +  formatDate(ticketType.start);
    }
}

/**
 * Returns ticket type description depending on its state
 * @param ticketType {IPaidTicketType} Ticket type
 * @returns {string}
 */
export function formatTicketDescription(ticketType: IPaidTicketType) {
    if (ticketType.isEnded()) {
        return 'Offer ended on ' + formatDate(ticketType.end);
    }
    if (ticketType.isActive()) {
        return 'Offer ends on ' +  formatDate(ticketType.end);
    }
    return 'On sale from ' +  formatDate(ticketType.start);
};


/**
 * Returns ticket type state description
 * @param ticketType {object} Ticket type
 * @param isPaid {boolean} True if ticket type is paid
 * @returns {string}
 */
export function getTicketTypeState(ticketType: ITicketType, isPaid: boolean): string {
    if (ticketType.isSoldOut()) {
        return 'Sold out';
    } else if (isPaid && (<IPaidTicketType>ticketType).isEnded()) {
        return 'Ended';
    } else {
        return printNumberOfTickets(ticketType.numberOfTicketsLeft);
    }
};


function printNumberOfTickets(numberOfTickets: number): string {
    if (numberOfTickets === 1) {
        return '1 ticket left';
    } else if (numberOfTickets < 0) {
        return '';
    } else {
        return numberOfTickets + ' tickets left';
    }
}
