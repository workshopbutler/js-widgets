import Event from '../Event';
import Country from './Country';
import Field, {FieldType} from './Field';
import Select from './Select';
import Ticket from './Ticket';
import PaidTickets from '../workshop/PaidTickets';

/**
 * Form section, which contains a number of fields
 */
export default class Section {

  /**
   * Creates all fields, including tickets
   * @param fieldData {any} JSON field data
   * @param event {Event} Form's event
   */
  protected static createAnyField(fieldData: any, event: Event): Field | null {
    switch (fieldData.type) {
    case FieldType.Select:
      return new Select(fieldData);
    case FieldType.Country:
      return new Country(fieldData);
    case FieldType.Ticket:
      if (event.tickets instanceof PaidTickets) {
        return event.soldOut ? null : new Ticket(fieldData, event.tickets);
      } else {
        return null;
      }
    default:
      return new Field(fieldData);
    }
  }

  readonly fields: Field[];

  constructor(readonly id: string, readonly name: string | null, data: any, event: Event) {
    this.fields = data.map(
      (fieldData: any) => Section.createAnyField(fieldData, event),
    ).filter(
      (field: Field | null) => field instanceof Field,
    );
  }
}
