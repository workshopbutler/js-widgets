import IPaidTicketType from '../../interfaces/IPaidTicketType';
import IPlainObject from '../../interfaces/IPlainObject';
import PaidTicketType from './PaidTicketType';

export default class PaidTickets {

  static fromJSON(json: IPlainObject, timezone?: string | undefined): PaidTickets {
    const types = json.types.map((ticket: IPlainObject) =>
      PaidTicketType.fromJSON(ticket, timezone),
    );
    return new PaidTickets(types, json.tax_excluded, json.tax_rate, json.tax_validation);
  }

  /**
   * True when the tax validation is required
   */
  readonly validateTax: boolean;

  /**
   * True when a sales tax is NOT included in the price
   */
  readonly excludedTax: boolean;

  /**
   * Tax size (in percents)
   */
  readonly tax: number | null;

  /**
   * Available ticket types for a workshop
   */
  readonly types: IPaidTicketType[];

  /**
   * Returns the id of the first active paid ticket if it exists
   */
  activeTicketId: string | null;

  constructor(types: IPaidTicketType[], excludedTax: boolean, tax: number, validateTax: boolean) {
    this.types = types;
    this.excludedTax = excludedTax;
    this.tax = tax ? tax : null;
    this.validateTax = !!validateTax;
    this.activeTicketId = this.getActiveTicketId();
  }

  /**
   * Returns active paid types, which a user can register to
   * @return {IPaidTicketType[]}
   */
  active() {
    return this.types.filter(ticket => ticket.active());
  }

  inFuture() {
    return this.types.filter(ticket => ticket.inFuture());
  }

  ended() {
    return this.types.filter(ticket => ticket.ended());
  }

  firstActiveTicket(): PaidTicketType | undefined {
    if (this.activeTicketId) {
      return this.types.find(t => t.id === this.activeTicketId);
    } else {
      const active = this.active();
      if (active.length) {
        return active[0];
      } else {
        return undefined;
      }
    }
  }

  protected getActiveTicketId() {
    const active = this.firstActiveTicket();
    if (active) {
      return active.id;
    } else {
      return null;
    }
  }

}
