import Field from "./Field";
import Tickets from "../Tickets";

/**
 * Form field with tickets' info, where visitors can select a ticket of their choice
 */
export default class Ticket extends Field {

    constructor(data: any, readonly tickets: Tickets) {
        super(data);
    }
}
