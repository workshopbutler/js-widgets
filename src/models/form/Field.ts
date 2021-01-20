/**
 * Valid field types
 */
export enum FieldType {
  Country = 'country',
  Checkbox = 'checkbox',
  TextArea = 'textarea',
  Select = 'select',
  Radio = 'radio',
  Ticket = 'ticket',
  Text = 'text',
  Email = 'email',
  Date = 'date',
}

/**
 * Represents a form field
 */
export default class Field {
  readonly type: FieldType;
  readonly name: string;
  readonly label: string;
  readonly required: boolean;
  readonly custom: boolean;

  constructor(data: any) {
    this.type = data.type;
    this.name = data.name;
    this.label = data.label;
    this.required = data.required;
    // the only way to determine if the field is a custom one
    // is to check its name which should be only contain some numbers
    // and letters
    const regex = /[0-9a-f]{8}/;
    if (regex.test(this.name)) {
      this.custom = true;
    } else {
      this.custom = false;
    }
  }
}
