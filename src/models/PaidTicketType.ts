import IPaidTicketType from "../interfaces/IPaidTicketType";
import {TicketTypeState} from "./TicketTypeState";
import TicketPrice from "./TicketPrice";
import {DateTime} from "luxon";

/**
 * A default implementation of IPaidTicketType interface
 */
export default class PaidTicketType implements IPaidTicketType {
    readonly id: string;
    readonly name: string;
    readonly numberOfTickets: number;
    readonly numberOfTicketsLeft: number;
    readonly start: DateTime;
    readonly end: DateTime;
    readonly withTax: boolean;
    readonly price: TicketPrice;
    private readonly state: TicketTypeState;

    constructor(jsonData: any, timezone: string) {
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.numberOfTickets = jsonData.amount;
        this.numberOfTicketsLeft = jsonData.left;
        this.start = DateTime.fromFormat(jsonData.start, 'yyyy-MM-dd', { zone: timezone });
        this.end = DateTime.fromFormat(jsonData.end, 'yyyy-MM-dd', { zone: timezone });
        this.withTax = jsonData.with_vat;
        this.price = new TicketPrice(jsonData.price);
        this.state = new TicketTypeState(jsonData.state);
    }

    /**
     * Returns true if the tickets of this type can be bought
     * @return {boolean}
     */
    active(): boolean {
        return this.state.valid;
    }

    /**
     * Returns true if the tickets of this type can be bought later, in future
     * @return {boolean}
     */
    inFuture(): boolean {
        return this.state.inFuture;
    }

    /**
     * Returns true if no more seats left
     * @return {boolean}
     */
    soldOut(): boolean {
        return this.state.soldOut;
    }

    /**
     * Returns true if the sales of tickets of this type have ended
     * @return {boolean}
     */
    ended(): boolean {
        return this.state.ended;
    };

    /**
     * All paid ticket types have a limitation for a number of tickets
     */
    withoutLimit(): boolean {
        return false;
    }
}
