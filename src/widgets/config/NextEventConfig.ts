import NextEventButtonConfig from './NextEventButtonConfig';
import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';

/**
 * Configuration for 'Next button' element
 */
export default class NextEventConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): NextEventConfig | null {
    return new NextEventConfig(options);
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
   * Id of the category to select events from
   */
  readonly categoryId: number | null;

  /**
   * Ids of the event types to select events from
   */
  readonly eventTypeIds: number[];

  /**
   * Configuration for the button
   */
  readonly button: NextEventButtonConfig;

  protected constructor(options: IPlainObject) {
    super(options);
    this.categoryId = options.categoryId !== undefined ? options.categoryId : null;
    this.eventTypeIds = options.eventTypeIds !== undefined ? options.eventTypeIds : [];
    this.eventPageUrl = options.eventPageUrl;
    this.registrationPageUrl = options.registrationPageUrl;
    this.button = options.button !== undefined ?
      new NextEventButtonConfig(options.button) :
      new NextEventButtonConfig({});
  }
}
