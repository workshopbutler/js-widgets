import {logError} from '../../common/Error';
import {absoluteURL, safeHref} from '../../common/helpers/UrlParser';
import IPlainObject from '../../interfaces/IPlainObject';
import Event from '../../models/Event';
import WidgetConfig from './WidgetConfig';

/**
 * Contains @EventPageConfig widget configuration options
 */
export default class EventPageConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): EventPageConfig | null {
    if (EventPageConfig.validate(options)) {
      return new EventPageConfig(options);
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
    if (options.withTrainers && (!options.trainerPageUrl || typeof options.trainerPageUrl !== 'string')) {
      logError('Attribute [trainerPageUrl] is not set correctly while [withTrainers=true]');
      valid = false;
    }
    return valid;
  }

  /**
   * When true, the trainers who run the event are shown
   */
  readonly trainers: boolean;

  /**
   * URL to the page with @TrainerProfile widget
   */
  readonly trainerPageUrl?: string;

  /**
   * URL to the page with RegistrationPage widget
   */
  readonly registrationPageUrl?: string;

  /**
   * URL for this page, taken from 'window' object if it exists
   */
  readonly eventPageUrl?: string;

  /**
   * List of additional widgets, rendered on the page. Default themes support one SidebarEventList widget
   * on #upcoming-events
   */
  readonly widgets: IPlainObject[];

  /**
   * True if a container for future workshops (#upcoming-events) should be rendered
   */
  readonly showFutureEvents: boolean;

  /**
   * When true, expired tickets are shown
   */
  readonly expiredTickets: boolean;

  /**
   * When true, the number of left tickets for each ticket type is shown
   */
  readonly numberOfTickets: boolean;

  /**
   * Callback function to parse event data into markup
   */
  readonly preRenderCallback: (event: Event) => void;

  protected constructor(options: IPlainObject) {
    super(options);
    this.trainers = options.trainers !== undefined ? options.trainers : false;
    this.trainerPageUrl = options.trainerPageUrl ? absoluteURL(options.trainerPageUrl) : undefined;
    this.registrationPageUrl = options.registrationPageUrl ? absoluteURL(options.registrationPageUrl) : undefined;
    this.widgets = options.widgets !== undefined ? options.widgets : [];
    this.expiredTickets = options.expiredTickets !== undefined ? options.expiredTickets : true;
    this.numberOfTickets = options.numberOfTickets !== undefined ? options.numberOfTickets : true;
    this.showFutureEvents = options.futureEvents !== undefined ? options.futureEvents : true;
    this.preRenderCallback = typeof(options.preRenderCallback) === 'function' ? options.preRenderCallback : undefined;
    this.eventPageUrl = safeHref();
  }

}
