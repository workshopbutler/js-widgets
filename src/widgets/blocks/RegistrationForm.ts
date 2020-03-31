import * as JQuery from 'jquery';
import Event from '../../models/Event';
import {ITemplates} from '../../templates/ITemplates';
import Localisation from '../../utils/Localisation';
import WidgetConfig from '../config/WidgetConfig';
import Widget from '../Widget';
import PaidTickets from '../../models/workshop/PaidTickets';
import TicketSummary from '../../models/form/TicketSummary';

/**
 * Logic for the registrationPage form page
 */
export default abstract class RegistrationForm<T extends WidgetConfig> extends Widget<T> {
  protected event: Event;
  protected form: JQuery<HTMLElement>;
  protected summaryBlock: JQuery<HTMLElement>;
  protected summary: TicketSummary;

  /**
   * Creates a new registration form
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {T} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: T) {
    super(selector, apiKey, templates, loc, config);
    this.summary = new TicketSummary(loc, this.formatter);
  }

  private initActiveTicketSelection() {
    const tickets = this.$root.find('#wsb-tickets input');
    tickets.on('change', () => {
      const ticketId = tickets.filter(':checked').val() as string;
      if (this.event.tickets instanceof PaidTickets) {
        this.event.tickets.activeTicketId = ticketId;
        this.renderSummary();
      }
    });
  }

  private renderSummary() {
    if (this.event.tickets instanceof PaidTickets) {
      this.summaryBlock.html(this.summary.render(this.event.tickets));
    }
  }

}
