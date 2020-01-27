import IPaidTicketType from '../../interfaces/IPaidTicketType';
import IPlainObject from '../../interfaces/IPlainObject';
import PaidTicketType from './PaidTicketType';

export default class PaidTickets {

  static fromJSON(json: IPlainObject, timezone: string): PaidTickets {
    const types = json.types.map((ticket: IPlainObject) =>
      PaidTicketType.fromJSON(ticket, timezone),
    );
    return new PaidTickets(types, json.vat_excluded, json.vat_amount);
  }

  /**
   * True when a sales tax is NOT included in the price
   */
  readonly excludedTax: boolean;

  /**
   * Tax size (in percents)
   */
  readonly tax?: number;

  /**
   * Available ticket types for a workshop
   */
  readonly types: IPaidTicketType[];

  /**
   * Returns the id of the first active paid ticket if it exists
   */
  activeTicketId: string | null;

  constructor(types: IPaidTicketType[], excludedTax: boolean, tax?: number) {
    this.types = types;
    this.excludedTax = excludedTax;
    this.tax = tax ? tax : undefined;
    this.activeTicketId = this.getActiveTicketId();
  }

  getActiveTicket(): PaidTicketType | undefined {
    if (this.activeTicketId) {
      return this.types.find(t => t.id === this.activeTicketId);
    } else {
      const active = this.getActive();
      if (active.length) {
        return active[0];
      } else {
        return undefined;
      }
    }
  }

  protected getActiveTicketId() {
    const active = this.getActiveTicket();
    if (active) {
      return active.id;
    } else {
      return null;
    }
  }

  /**
   * Returns active paid types, which a user can register to
   * @return {IPaidTicketType[]}
   */
  protected getActive() {
    return this.types.filter(ticket => ticket.active());
  }
}
