import PlainObject = JQuery.PlainObject;
import WidgetConfig from './WidgetConfig';

/**
 * Contains @TrainerProfileConfig widget configuration options
 */
export default class TrainerProfileConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {PlainObject} Widget's options
   */
  static create(options: PlainObject): TrainerProfileConfig | null {
    if (TrainerProfileConfig.validate(options)) {
      return new TrainerProfileConfig(options);
    } else {
      return null;
    }
  }

  /**
   * Returns true if the options can be used to create the widget's config
   * @param options {PlainObject} Widget's config
   */
  protected static validate(options: PlainObject): boolean {
    return true;
  }

  /**
   * List of additional widgets, rendered on the page. Default themes support two SidebarEventList widgets,
   *  situated in #past-events and #upcoming-events
   */
  readonly widgets: PlainObject[];

  /**
   * True if a container for future workshops (#upcoming-events) should be rendered
   */
  readonly showFutureEvents: boolean;

  /**
   * True if a container for past workshops (#past-events) should be rendered
   */
  readonly showPastEvents: boolean;

  protected constructor(options: PlainObject) {
    super(options);
    this.widgets = options.widgets !== undefined ? options.widgets : [];
    this.showFutureEvents = options.futureEvents !== undefined ? options.futureEvents : true;
    this.showPastEvents = options.pastEvents !== undefined ? options.pastEvents : true;
  }
}
