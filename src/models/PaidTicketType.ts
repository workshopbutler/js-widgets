import {DateTime} from 'luxon';
import IPaidTicketType from '../interfaces/IPaidTicketType';
import IPlainObject from '../interfaces/IPlainObject';
import TicketPrice from './TicketPrice';
import {TicketTypeState} from './TicketTypeState';

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
    /**
     * True when a sales tax is NOT included in the price
     */
    readonly excludedTax: boolean;
    readonly price: TicketPrice;
    private readonly state: TicketTypeState;

    constructor(jsonData: IPlainObject, timezone: string) {
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.numberOfTickets = jsonData.amount;
        this.numberOfTicketsLeft = jsonData.left;
        this.start = DateTime.fromFormat(jsonData.start, 'yyyy-MM-dd', { zone: timezone });
        this.end = DateTime.fromFormat(jsonData.end, 'yyyy-MM-dd', { zone: timezone });
        this.excludedTax = !jsonData.with_vat;
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
