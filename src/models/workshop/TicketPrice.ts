/**
 * Price for a workshop ticket
 */
export default class TicketPrice {
    readonly amount: number;
    readonly currency: string;
    readonly sign: string;

    constructor(jsonData: any) {
        this.amount = jsonData.amount;
        this.currency = jsonData.currency;
        this.sign = jsonData.sign;
    }
}
