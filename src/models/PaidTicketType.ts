import IPaidTicketType from "../interfaces/IPaidTicketType";
import {TicketTypeState} from "./TicketTypeState";
import TicketPrice from "./TicketPrice";

/**
 * A default implementation of IPaidTicketType interface
 */
export default class PaidTicketType implements IPaidTicketType {
    readonly id: string;
    readonly name: string;
    readonly numberOfTickets: number;
    readonly numberOfTicketsLeft: number;
    readonly start: Date;
    readonly end: Date;
    readonly withTax: boolean;
    readonly price: TicketPrice;
    private readonly state: TicketTypeState;

    constructor(jsonData: any) {
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.numberOfTickets = jsonData.amount;
        this.numberOfTicketsLeft = jsonData.left;
        this.start = new Date(jsonData.start);
        this.end = new Date(jsonData.end);
        this.withTax = jsonData.with_vat;
        this.price = new TicketPrice(jsonData.price);
        this.state = new TicketTypeState(jsonData.state);
    }

    /**
     * Returns true if the tickets of this type can be bought
     * @return {boolean}
     */
    isActive(): boolean {
        return this.state.valid;
    }

    /**
     * Returns true if the tickets of this type can be bought later, in future
     * @return {boolean}
     */
    isInFuture(): boolean {
        return this.state.inFuture;
    }

    /**
     * Returns true if no more seats left
     * @return {boolean}
     */
    isSoldOut(): boolean {
        return this.state.soldOut;
    }

    /**
     * Returns true if the sales of tickets of this type have ended
     * @return {boolean}
     */
    isEnded(): boolean {
        return this.state.ended;
    };
}
