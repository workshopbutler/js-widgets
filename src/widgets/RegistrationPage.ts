import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import IPlainObject from '../interfaces/IPlainObject';
import Event from '../models/Event';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import RegistrationPageConfig from './config/RegistrationPageConfig';
import FormHelper from './helpers/FormHelper';
import getTemplate from './helpers/Templates';
import getCountryCodes from '../utils/countries';
// @ts-ignore
import SharedRegistrationForm from './helpers/SharedRegistrationForm';
import PaymentConfig from './helpers/PaymentConfig';
import Widget from './Widget';
import RegistrationFormConfig from './helpers/RegistrationFormConfig';

/**
 * Logic for the registration form page
 */
export default class RegistrationPage extends Widget<RegistrationPageConfig> {

  protected event: Event;

  /**
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates for widgets
   * @param loc {Localisation} Localisation instance
   * @param options {object} Configuration config
   */
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: IPlainObject) {
    const config = RegistrationPageConfig.create(options);
    if (!config) {
      return;
    }

    return Widget.attachMe(selector, 'registration.form', el =>
      new RegistrationPage(el, apiKey, templates, loc, config)
    );
  }

  protected readonly formatter: Formatter;
  private ticketId: string;

  /**
   * Creates a new registration page
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {RegistrationPageConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: RegistrationPageConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);
    this.ticketId = config.ticketId || '';
    let id = config.eventId || '';

    window.location.search.substr(1).split('&').forEach(el => {
      const param = el.split('=', 2);
      if (param.length === 2 && param[0] === 'id') {
        id = param[1];
      } else if (param.length === 2 && param[0] === 'ticket') {
        this.ticketId = param[1];
      }
    });
    this.init();
    this.loadContent(id);
  }

  /**
   * Updates key elements of the page
   */
  protected updateHTML() {
    this.updateTitle();
  }

  /**
   * Changes the title of the page
   */
  protected updateTitle() {
    document.title = this.event.title;
  }

  private init() {
    if (this.config.theme) {
      this.$root.addClass(this.config.theme);
    }
  }

  /**
   * Loads the event and renders the page
   * @param eventId {string}
   * @private
   */
  private loadContent(eventId: string) {
    const url = this.getUrl(eventId);

    transport.get(url, {},
      (data: IPlainObject) => {
        this.event = Event.fromJSON(data.data, this.config);
        this.renderRegistrationForm();
      });
  }

  private renderRegistrationForm() {
    $.when(getTemplate(this.config)).done(template => {
      this.updateHTML();
      const uniqueParams = {
        countries: this.getCountries(this.config),
        event: this.event,
        ticket: this.ticketId,
      };
      const params = Object.assign(uniqueParams, this.getTemplateParams());

      const content = template ?
        nunjucksRenderString(template, params) :
        this.templates.registrationPage.render(params);
      this.$root.html(content);
      this.$root.data('widget.shared.registration.form', this.getForm());

      // this.summaryBlock = this.$root.find('[data-summary]');

    });
  }

  private getForm() {
    const formHelper = new FormHelper(
      this.$root.find('[data-control]'),
      this.getErrorMessages());

    const paymentConfig = this.getPaymentConfig();
    const formConfig = new RegistrationFormConfig(this.event.id,
      this.config.searchToFieldConfigs,
      this.config.successRedirectUrl);
    return new SharedRegistrationForm(this.$root.find('.wsb-body'), formHelper,
      formConfig, paymentConfig);
  }

  private getPaymentConfig() {
    const registerUrl = `attendees/register?api_key=${this.apiKey}&t=${this.getWidgetStats()}`;
    const preRegisterUrl = `attendees/pre-register?api_key=${this.apiKey}&t=${this.getWidgetStats()}`;
    const taxValidationUrl = `tax-validation/:number?api_key=${this.apiKey}&t=${this.getWidgetStats()}`
      + `&lang=${this.formatter.getLocale()}`;

    return new PaymentConfig(this.event.cardPayment?.active || false, this.event.free,
      this.event.cardPayment?.testMode() || false, preRegisterUrl, registerUrl, taxValidationUrl,
      this.event.cardPayment?.stripePublicKey, this.event.cardPayment?.stripeClientId,
      this.event.payPalPayment?.clientId);
  }

  private getUrl(eventId: string) {
    return `events/${eventId}?api_key=${this.apiKey}&fields=trainer.rating&t=${this.getWidgetStats()}`;
  }

  private getCountries(config: RegistrationPageConfig): [string, string][] {
    const codes = config.countryOnlyFrom ? config.countryOnlyFrom : getCountryCodes();
    const countries = codes.map(code =>
      [code, this.loc.translate('country.' + code)] as [string, string],
    );
    return countries.sort((a, b) => a[1].localeCompare(b[1]));
  }

  /**
   * Contains localised form errors
   */
  protected getErrorMessages(): IPlainObject {
    return {
      'date': this.loc.translate('form.error.date'),
      'digits': this.loc.translate('form.error.digits'),
      'email': this.loc.translate('form.error.email'),
      'nospace': this.loc.translate('form.error.number'),
      'required': this.loc.translate('form.error.required'),
      'url': this.loc.translate('form.error.url'),
      'form.error.attendee.exist': this.loc.translate('form.error.attendee'),
    };
  }
}
