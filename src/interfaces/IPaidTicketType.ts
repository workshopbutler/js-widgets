import TicketPrice from "../models/TicketPrice";
import ITicketType from "./ITicketType";

export default interface IPaidTicketType extends ITicketType {
    readonly id: string;
    readonly name: string;
    readonly numberOfTickets: number;
    readonly numberOfTicketsLeft: number;
    readonly start: Date;
    readonly end: Date;
    readonly withTax: boolean;
    readonly price: TicketPrice;

    /**
     * Returns true if the tickets of this type can be bought
     * @return {boolean}
     */
    isActive(): boolean;

    /**
     * Returns true if the sales of tickets of this type have ended
     * @return {boolean}
     */
    isEnded(): boolean;

    /**
     * Returns true if the tickets of this type can be bought later, in future
     * @return {boolean}
     */
    isInFuture(): boolean;

    /**
     * Returns true if no more seats left
     * @return {boolean}
     */
    isSoldOut(): boolean
}
