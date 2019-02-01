import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';

/**
 * Contains @TrainerProfileConfig widget configuration options
 */
export default class TrainerProfileConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): TrainerProfileConfig | null {
    if (TrainerProfileConfig.validate(options)) {
      return new TrainerProfileConfig(options);
    } else {
      return null;
    }
  }

  /**
   * Returns true if the options can be used to create the widget's config
   * @param options {IPlainObject} Widget's config
   */
  protected static validate(options: IPlainObject): boolean {
    return true;
  }

  /**
   * List of additional widgets, rendered on the page. Default themes support two SidebarEventList widgets,
   *  situated in #past-events and #upcoming-events
   */
  readonly widgets: IPlainObject[];

  /**
   * True if a container for future workshops (#upcoming-events) should be rendered
   */
  readonly showFutureEvents: boolean;

  /**
   * True if a container for past workshops (#past-events) should be rendered
   */
  readonly showPastEvents: boolean;

  protected constructor(options: IPlainObject) {
    super(options);
    this.widgets = options.widgets !== undefined ? options.widgets : [];
    this.showFutureEvents = options.futureEvents !== undefined ? options.futureEvents : true;
    this.showPastEvents = options.pastEvents !== undefined ? options.pastEvents : true;
  }
}
