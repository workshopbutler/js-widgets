import Field from "./Field";
import Tickets from "../Tickets";

/**
 * Form field with tickets' info, where visitors can select a ticket of their choice
 */
export default class Ticket extends Field {
    /**
     * True if a sales tax is not included in the prices
     */
    readonly excludedTax: boolean;

    constructor(data: any, readonly tickets: Tickets) {
        super(data);
        this.excludedTax = tickets.paid.filter((value) => value.excludedTax).length > 0;
    }
}
