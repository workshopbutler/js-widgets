import ITicketType from "./ITicketType";

export default interface IFreeTicketType extends ITicketType {
    readonly numberOfTickets: number;
    readonly numberOfTicketsLeft: number;
    readonly start: Date;
    readonly end: Date;

    /**
     * Returns true if no more seats left
     * @return {boolean}
     */
    isSoldOut(): boolean

    /**
     * Returns true if there is no limitation for a number of seats. For example, in a webinar
     * @return {boolean}
     */
    withUnlimitedSeats(): boolean
}
