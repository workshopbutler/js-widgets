import IFreeTicketType from "../interfaces/IFreeTicketType";

/**
 * A default implementation of IFreeTicketType interface
 */
export default class FreeTicketType implements IFreeTicketType {
    readonly numberOfTickets: number;
    readonly numberOfTicketsLeft: number;
    readonly start: Date;
    readonly end: Date;
    private readonly unlimited: boolean;
    private readonly soldOut: boolean;

    constructor(jsonData: any) {
        this.numberOfTickets = jsonData.amount;
        this.numberOfTicketsLeft = jsonData.left;
        this.start = new Date(jsonData.start);
        this.end = new Date(jsonData.end);
        this.unlimited = jsonData.unlimited;
        this.soldOut = jsonData.state.sold_out;
    }

    /**
     * Returns true if no more seats left
     * @return {boolean}
     */
    isSoldOut(): boolean {
        return this.soldOut;
    }

    withUnlimitedSeats(): boolean {
        return this.unlimited;
    }
}

