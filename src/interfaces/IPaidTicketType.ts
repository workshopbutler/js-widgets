import TicketPrice from "../models/TicketPrice";
import ITicketType from "./ITicketType";
import {DateTime} from "luxon";

export default interface IPaidTicketType extends ITicketType {
    readonly id: string;
    readonly name: string;
    readonly numberOfTickets: number;
    readonly numberOfTicketsLeft: number;
    readonly start: DateTime;
    readonly end: DateTime;
    readonly withTax: boolean;
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
    soldOut(): boolean
}
