import {logError} from '../../common/Error';
import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';
import TrainersConfig from './TrainersConfig';

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

  protected constructor(options: IPlainObject) {
    super(options);
    this.eventPageUrl = options.eventPageUrl ? options.eventPageUrl : undefined;
    this.trainers = new TrainersConfig(options.trainers);;
    this.expiredTickets = options.expiredTickets !== undefined ? options.expiredTickets : false;
    this.numberOfTickets = options.numberOfTickets !== undefined ? options.numberOfTickets : true;
    if (options.country) {
      this.countryOnlyFrom = options.country.onlyFrom !== undefined ? options.country.onlyFrom : undefined;
      this.countryDefault = options.country.default !== undefined ? options.country.default : undefined;
    }
    this.successRedirectUrl = options.successRedirectUrl !== undefined ? options.successRedirectUrl : undefined;
  }
}
