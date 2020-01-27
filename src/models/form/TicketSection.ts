import Section from './Section';
import Event from '../Event';
import IPlainObject from '../../interfaces/IPlainObject';
import PaidTickets from '../workshop/PaidTickets';

export default class TicketSection extends Section {
  static readonly ID = 'ticket';
  static readonly PROMO = 'promo_code';

  /**
   * True if the promo fields is present
   */
  readonly withPromo: boolean = false;

  /**
   * True if the tax should be excluded
   */
  readonly excludedTax: boolean = false;

  /**
   * Tax amount
   */
  readonly tax?: number;

  protected readonly event: Event;

  constructor(readonly name: string | null, fields: IPlainObject[], event: Event) {
    super(TicketSection.ID, name, fields, event);
    this.withPromo = this.fields.find(t => t.name === TicketSection.PROMO) !== undefined;
    this.excludedTax = (event.tickets as PaidTickets).excludedTax;
    this.event = event;
    this.tax = (event.tickets as PaidTickets).tax;
  }

  showSummary(): boolean {
    return !this.excludedTax || this.tax !== undefined;
  }
}
