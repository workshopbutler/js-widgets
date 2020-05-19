import {logError} from '../../common/Error';
import IPlainObject from '../../interfaces/IPlainObject';
import DefaultSettings from './DefaultSettings';
import {ScheduleColumnType} from './ScheduleColumnType';
import WidgetConfig from './WidgetConfig';
import FeaturedConfig from './FeaturedConfig';

/**
 * Contains @Schedule widget configuration options
 */
export default class ScheduleConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): ScheduleConfig | null {
    if (ScheduleConfig.validate(options)) {
      return new ScheduleConfig(options);
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
    if (!options.eventPageUrl || typeof options.eventPageUrl !== 'string') {
      logError('Attribute [eventPageUrl] is not set correctly');
      valid = false;
    }
    if (!options.filters || typeof options.filters !== 'object') {
      logError('Attribute [filters] is not set correctly');
      valid = false;
    }
    return valid;
  }

  /**
   * A url of the page with an installed 'EventPage' widget on it
   */
  readonly eventPageUrl: string;

  /**
   * Category ID to filter the events
   */
  readonly categoryId?: number;

  /**
   * Event Type ID to filter the events
   */
  readonly eventTypeId?: number;

  /**
   * A url of the page with an installed 'RegistrationPage' widget on it
   */
  readonly registrationPageUrl?: string;

  /**
   * All active filters
   */
  readonly filters: string[];

  /**
   * Visible table columns
   */
  readonly cols: ScheduleColumnType[];

  /**
   * When true, the name of trainer is shown
   */
  readonly trainerName: boolean;

  /**
   * When true, 'Register' button leads directly to the registration page
   */
  readonly registration: boolean;

  /**
   * Pattern for the event page url
   */
  readonly eventPagePattern: string;

  /**
   * A list of 'expand' attributes, sent to API
   */
  readonly expand: string[];

  /**
   * Maximum number of events to show
   */
  readonly length: number;

  /**
   * Show only future events (default) or ones from the past
   */
  readonly future: boolean;

  /**
   * Filter events by trainerId
   */
  readonly trainerId?: number;

  /**
   * When true, only featured events are shown
   */
  readonly onlyFeatured: boolean;

  /**
   * Configuration for featured events;
   */
  readonly featured: FeaturedConfig;

  protected constructor(options: IPlainObject) {
    super(options);
    this.eventPageUrl = options.eventPageUrl;
    this.registrationPageUrl = options.registrationPageUrl;
    this.filters = options.filters;
    const defaultCols = [ScheduleColumnType.Schedule, ScheduleColumnType.Location, ScheduleColumnType.Title,
      ScheduleColumnType.Register];
    this.cols = options.cols !== undefined ? options.cols : defaultCols;
    this.trainerName = options.trainerName !== undefined ? options.trainerName : true;
    this.registration = options.registration !== undefined ? options.registration : false;
    this.categoryId = options.categoryId;
    this.eventTypeId = options.eventTypeId;
    this.eventPagePattern = options.eventPagePattern !== undefined ?
      options.eventPagePattern :
      DefaultSettings.eventPagePattern;
    if (this.eventPagePattern.includes('{{category}}') || this.filters.includes('category')) {
      this.expand = ['category'];
    } else {
      this.expand = [];
    }
    this.length = options.length !== undefined ? options.length : undefined;
    this.future = options.future !== undefined ? options.future : true;
    this.trainerId = options.trainerId !== undefined ? options.trainerId : undefined;
    this.onlyFeatured = options.onlyFeatured !== undefined ? options.onlyFeatured : false;
    this.featured = new FeaturedConfig(options.featured);
  }

}
