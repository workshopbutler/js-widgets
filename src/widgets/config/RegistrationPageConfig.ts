import {logError} from '../../common/Error';
import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';
import TrainersConfig from './TrainersConfig';
import {isBoolean, isString} from '../../utils/validators';

/**
 * The registration page widgets supports the injection of values from search query into the form. It works this way:
 *  - The search query is parsed and the values are extracted.
 *  - The widget inserts the extracted values into the related form fields.
 *  - If the field is configured to be hidden, then the user is not able to change the value as
 *    it's hidden from the form
 *
 * This interface describes the configuration for each field.
 *
 * @param {string} to The name of the field to which the value should be injected. For example,
 *                    if the search param is `ref` but the field name is `reference`, then a user sets `to=reference`.
 * @param {boolean} hidden If true, the field will not be displayed in the form if the search parameter is present.
 */
export interface SearchToFormFieldConfig {
  to: string;
  hidden: boolean;
}

/**
 * Contains @RegistrationPageConfig widget configuration options
 */
export default class RegistrationPageConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): RegistrationPageConfig | null {
    if (RegistrationPageConfig.validate(options)) {
      return new RegistrationPageConfig(options);
    } else {
      return null;
    }
  }

  /**
   * Returns true if the options can be used to create the widget's config
   * @param options {IPlainObject} Widget's config
   */
  protected static validate(options: IPlainObject): boolean {
    let valid = true;
    if (options.eventPageUrl && typeof options.eventPageUrl !== 'string') {
      logError('Attribute [eventPageUrl] must be string');
      valid = false;
    }
    return valid;
  }

  readonly eventPageUrl?: string;

  /**
   * Trainers' configuration
   */
  readonly trainers: TrainersConfig;

  /**
   * When true, expired tickets are shown
   */
  readonly expiredTickets: boolean;

  /**
   * When true, the number of left tickets for each ticket type is shown
   */
  readonly numberOfTickets: boolean;

  /**
   * Array of country codes to use for the registration form
   */
  readonly countryOnlyFrom: string[];

  /**
   * Preselected default country
   */
  readonly countryDefault: string;

  /**
   * Redirect to success page url instead of only showing success message
   */
  readonly successRedirectUrl: string;

  /**
   * Default ticket id will be used if no URL param has been provided
   */
  readonly ticketId?: string;

  /**
   * Default event id will be used if no URL param has been provided
   */
  readonly eventId?: string;

  /**
   * The names of search parameters that should be injected into the form together with their configurations
   */
  readonly searchToFieldConfigs: Map<string, SearchToFormFieldConfig>;

  protected constructor(options: IPlainObject) {
    super(options);
    this.eventPageUrl = options.eventPageUrl ? options.eventPageUrl : undefined;
    this.trainers = new TrainersConfig(options.trainers);
    this.expiredTickets = options.expiredTickets !== undefined ? options.expiredTickets : false;
    this.numberOfTickets = options.numberOfTickets !== undefined ? options.numberOfTickets : true;
    if (options.country) {
      this.countryOnlyFrom = options.country.onlyFrom !== undefined ? options.country.onlyFrom : undefined;
      this.countryDefault = options.country.default !== undefined ? options.country.default : undefined;
    }
    this.successRedirectUrl = options.successRedirectUrl !== undefined ? options.successRedirectUrl : undefined;
    this.ticketId = options.ticketId ? options.ticketId : undefined;
    this.eventId = options.eventId ? options.eventId : undefined;
    this.searchToFieldConfigs = Array.isArray(options.forwardSearchParams) ?
      RegistrationPageConfig.processSearchToFormFieldOption(options.forwardSearchParams) :
      new Map();
  }

  /**
   * Converts `forwardSearchParams` option to a map of search parameters and their configurations.
   * The correct format is: [{name: 'searchName', to: 'fieldName', hidden: false}, ...]
   *
   * However, the method is very forgiving and will handle any format for the search param configuration if it has
   * `name` property. In this case, the `to` property is set to `name` value, and the `hidden` property is set to false
   *
   * @param options {IPlainObject[]} The array of search parameters configurations
   * @protected
   */
  protected static processSearchToFormFieldOption(options: IPlainObject[]): Map<string, SearchToFormFieldConfig> {
    const values = new Map();
    options.forEach(x => {
      if (isString(x.name)) {
        const name = x.name;
        const to = isString(x.to) ? x.to : name;
        const hidden = isBoolean(x.hidden) ? x.hidden : false;
        values.set(name, {to, hidden});
      }
    });
    return values;
  }
}
