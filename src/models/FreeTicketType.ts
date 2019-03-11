import IFreeTicketType from '../interfaces/IFreeTicketType';

/**
 * A default implementation of IFreeTicketType interface
 */
export default class FreeTicketType implements IFreeTicketType {
    readonly numberOfTickets: number;
    readonly numberOfTicketsLeft: number;
    readonly start: Date;
    readonly end: Date;
    private readonly unlimited: boolean;
    private readonly stateSoldOut: boolean;

    constructor(jsonData: any) {
        this.numberOfTickets = jsonData.amount;
        this.numberOfTicketsLeft = jsonData.left;
        this.start = new Date(jsonData.start);
        this.end = new Date(jsonData.end);
        this.unlimited = jsonData.unlimited;
        this.stateSoldOut = jsonData.state.sold_out;
    }

    /**
     * Returns true if no more seats left
     * @return {boolean}
     */
    soldOut(): boolean {
        return this.stateSoldOut;
    }

    withUnlimitedSeats(): boolean {
        return this.unlimited;
    }

    /**
     * Returns true if there is no limitation for a number of tickets
     */
    withoutLimit(): boolean {
        return this.unlimited;
    }
}
