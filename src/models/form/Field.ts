/**
 * Valid field types
 */
export const enum FieldType {
    Checkbox = "checkbox",
    TextArea = "textarea",
    Select = "select",
    Country ="country",
    Ticket = "ticket",
    Text = "text",
    Email = "email",
    Date = "date"
}

/**
 * Represents a form field
 */
export default class Field {
    readonly type: FieldType;
    readonly name: string;
    readonly label: string;
    readonly required: boolean;

    constructor(data: any) {
        this.type = data.type;
        this.name = data.name;
        this.label = data.label;
        this.required = data.required;
    }
}
