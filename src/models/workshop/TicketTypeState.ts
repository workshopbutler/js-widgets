/**
 * State of the ticket type of a paid workshop
 */
export class TicketTypeState {
    readonly soldOut: boolean;
    readonly ended: boolean;
    readonly started: boolean;
    readonly inFuture: boolean;
    readonly valid: boolean;

    constructor(jsonData: any) {
        this.soldOut = jsonData.sold_out;
        this.ended = jsonData.ended;
        this.started = jsonData.started;
        this.inFuture = jsonData.in_future;
        this.valid = jsonData.valid;
    }
}
