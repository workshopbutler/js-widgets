import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';
import {logError} from '../../common/Error';

/**
 * Contains @AttendeeList widget configuration options
 */
export default class AttendeeListConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): AttendeeListConfig | null {
    if (AttendeeListConfig.validate(options)) {
      return new AttendeeListConfig(options);
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
    if (options.length) {
      if (typeof options.length !== 'number') {
        logError('Attribute [length] must be a number');
        valid = false;
      } else if (options.length < 1) {
        logError('Attribute [length] must be bigger than 0');
        valid = false;
      } else if (options.length > 100) {
        logError('Attribute [length] must be smaller than 101');
        valid = false;
      }
    }
    return valid;
  }

  /**
   * All active filters
   */
  readonly filters: string[];

  /**
   * True if only attendees from free events are needed, false otherwise
   */
  readonly free?: boolean;

  /**
   * Number of records per page (min - 1, max - 100)
   */
  readonly length?: number;

  protected constructor(options: IPlainObject) {
    super(options);
    this.free = options.free;
    this.length = options.length;
    this.filters = options.filters;
  }
}
