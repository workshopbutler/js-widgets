import UpcomingEventButtonConfig from './UpcomingEventButtonConfig';
import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';

/**
 * Configuration for 'Upcoming event' element
 */
export default class UpcomingEventConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): UpcomingEventConfig | null {
    return new UpcomingEventConfig(options);
  }

  /**
   * A url of the page with an installed 'EventPage' widget on it
   */
  readonly eventPageUrl: string;

  /**
   * A url of the page with an installed 'RegistrationPage' widget on it
   */
  readonly registrationPageUrl?: string;

  /**
   * Ids of the categories to select events from
   */
  readonly categoryIds: number[];

  /**
   * Ids of the event types to select events from
   */
  readonly typeIds: number[];

  /**
   * Configuration for the button
   */
  readonly button: UpcomingEventButtonConfig;

  protected constructor(options: IPlainObject) {
    super(options);
    this.categoryIds = options.categoryIds !== undefined ? options.categoryIds : [];
    this.typeIds = options.typeIds !== undefined ? options.typeIds : [];
    this.eventPageUrl = options.eventPageUrl;
    this.registrationPageUrl = options.registrationPageUrl;
    this.button = options.button !== undefined ?
      new UpcomingEventButtonConfig(options.button) :
      new UpcomingEventButtonConfig({});
  }
}
