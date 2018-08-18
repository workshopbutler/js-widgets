import Field, {FieldType} from "./Field";
import Select from "./Select";
import Country from "./Country";
import Event from "../Event";
import Ticket from "./Ticket";

/**
 * Form section, which contains a number of fields
 */
export default class Section {
    readonly fields: Field[];

    constructor(readonly name: string, data: any, event: Event) {
        this.fields = data.map(
            (fieldData: any) => Section.createAnyField(fieldData, event)
        ).filter(
            (field: Field | null) => field instanceof Field
        );
    }

    /**
     * Creates all fields, including tickets
     * @param fieldData {any} JSON field data
     * @param event {Event} Form's event
     */
    protected static createAnyField(fieldData: any, event: Event): Field | null {
        switch (fieldData.type) {
            case FieldType.Select: return new Select(fieldData);
            case FieldType.Country: return new Country(fieldData);
            case FieldType.Ticket:
                if (event.free || !event.tickets) {
                    return null;
                } else {
                    return new Ticket(fieldData, event.tickets);
                }
            default: return new Field(fieldData);
        }
    }

}
