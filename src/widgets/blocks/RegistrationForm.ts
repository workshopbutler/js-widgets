import * as JQuery from 'jquery';
import {logError} from '../../common/Error';
import transport from '../../common/Transport';
import IPlainObject from '../../interfaces/IPlainObject';
import Event from '../../models/Event';
import {ITemplates} from '../../templates/ITemplates';
import Localisation from '../../utils/Localisation';
import WidgetConfig from '../config/WidgetConfig';
import FormHelper from '../helpers/FormHelper';
import Widget from '../Widget';
import RegistrationPageConfig from '../config/RegistrationPageConfig';
import PaidTickets from '../../models/workshop/PaidTickets';

/**
 * Logic for the registrationPage form page
 */
export default abstract class RegistrationForm<T extends WidgetConfig> extends Widget<T> {
  protected event: Event;
  protected formHelper: FormHelper;
  protected successMessage: JQuery<HTMLElement>;
  protected form: JQuery<HTMLElement>;
  protected successRedirectUrl: string;

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
    this.$root.find('#wsb-success').hide();
  }

  protected assignEvents() {
    this.initActiveTicketSelection();
    if (this.event.state.open()) {
      this.$root.on('submit', this.onFormSubmition.bind(this));
    }
    this.initPromoActivation();
  }

  /**
   * Process the click on 'Registration' button
   * @param e {Event}
   * @private
   */
  protected onFormSubmition(e: JQuery.TriggeredEvent) {
    e.preventDefault();
    if (this.event.state.closed()) {
      logError('Widget configured incorrectly. Registration button shouldn\'t be active when the registration ' +
        'is closed');
    } else {
      if (!this.formHelper.isValidFormData()) {
        return;
      }

      const formData = this.prepareFormData(this.formHelper.getFormData());

      const url = `attendees/register?api_key=${this.apiKey}&t=${this.getWidgetStats()}`;

      this.$root.addClass('h-busy');
      $(e.target as HTMLElement).prop('disabled', true).addClass('h-busy');

      transport.post(url, formData,
        () => {
          this.formHelper.clearForm();
          if (this.successRedirectUrl && this.successRedirectUrl !== '') {
            window.location.href = this.successRedirectUrl;
          } else {
            this.successMessage.show();
            this.form.hide();
          }
          this.$root.removeClass('h-busy');
          $(e.target as HTMLElement).removeProp('disabled').removeClass('h-busy');
        });
    }
  }

  /**
   * Contains localised form errors
   */
  protected getErrorMessages(): IPlainObject {
    return {
      date: this.loc.translate('form.error.date'),
      digits: this.loc.translate('form.error.digits'),
      email: this.loc.translate('form.error.email'),
      nospace: this.loc.translate('form.error.number'),
      required: this.loc.translate('form.error.required'),
      url: this.loc.translate('form.error.url'),
    };
  }

  protected getCountries(config: RegistrationPageConfig): [string, string][] {
    const defaultCodes = ['AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU',
      'AT', 'AZ', 'AX', 'BS', 'BH', 'BD', 'BB', 'BY', 'BZ', 'BE', 'BJ', 'BM', 'BT', 'BA', 'BW', 'BN', 'BO',
      'BQ', 'BV', 'BR', 'BG', 'BF', 'BI', 'CV', 'CM', 'CA', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CD', 'CG', 'CK',
      'CI', 'CO', 'CR', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'ER', 'GQ', 'EE',
      'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'GA', 'GM', 'KH', 'KY', 'GE', 'DE', 'GH', 'GI', 'KM', 'GR',
      'GL', 'GD', 'GP', 'GG', 'GN', 'GU', 'GT', 'GW', 'GY', 'HT', 'HK', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ',
      'IE', 'IL', 'IM', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KG', 'KP', 'KR', 'KW', 'LA', 'LV', 'LB',
      'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU',
      'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI',
      'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT',
      'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN',
      'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE',
      'CH', 'SY', 'TJ', 'TW', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA',
      'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'];
    const codes = config.countryOnlyFrom ? config.countryOnlyFrom : defaultCodes;
    const countries = codes.map(code =>
      [code, this.loc.translate('country.' + code)] as [string, string],
    );
    return countries.sort((a, b) => a[1].localeCompare(b[1]));
  }

  private initActiveTicketSelection() {
    const tickets = this.$root.find('#wsb-tickets input');
    tickets.on('change', () => {
      this.toggleTicket(tickets, false);
      this.toggleTicket(tickets.filter(':checked'), true);
    });
    if (this.event.tickets instanceof PaidTickets) {
      const activeTicket = tickets.filter(`#${this.event.tickets.selectedTicketId}`);
      this.toggleTicket(activeTicket, true);
    }
  }

  private initPromoActivation() {
    this.$root.find('[data-promo-link]').on('click', e => {
      e.preventDefault();
      this.$root.find('[data-promo-code]').toggle();
    });
  }

  private toggleTicket(tickets: JQuery<HTMLElement>, on: boolean) {
    const name = 'wsb-active';
    if (on) {
      tickets.prop('checked', 'true');
      tickets.parent().addClass(name);
    } else {
      tickets.removeProp('checked');
      tickets.parent().removeClass(name);
    }
  }

  /**
   * Returns a correctly formed data to be processed by Workshop Butler API
   * @param data {object}
   * @return {*}
   */
  private prepareFormData(data: IPlainObject): IPlainObject {
    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
    data.event_id = Number(this.event.id);
    for (const item in data) {
      if (!data[item]) {
        delete data[item];
      }
    }
    return data;
  }
}
