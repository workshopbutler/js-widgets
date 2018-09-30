import {logError} from '../../common/Error';
import WidgetConfig from './WidgetConfig';
import PlainObject = JQuery.PlainObject;

/**
 * Contains @TestimonialList widget configuration options
 */
export default class TestimonialListConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {PlainObject} Widget's options
   */
  static create(options: PlainObject): TestimonialListConfig | null {
    if (TestimonialListConfig.validate(options)) {
      return new TestimonialListConfig(options);
    } else {
      return null;
    }
  }

  /**
   * Returns true if the options can be used to create the widget's config
   * @param options {PlainObject} Widget's config
   */
  protected static validate(options: PlainObject): boolean {
    let valid = true;
    if (!options.trainerId || typeof options.trainerId !== 'number') {
      logError('Attribute [trainerId] is not set correctly');
      valid = false;
    }
    return valid;
  }

  /**
   * Trainer ID to show the testimonials for
   */
  readonly trainerId: number;

  protected constructor(options: PlainObject) {
    super(options);
    this.trainerId = options.trainerId;
  }
}
