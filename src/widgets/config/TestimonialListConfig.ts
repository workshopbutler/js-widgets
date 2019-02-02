import {logError} from '../../common/Error';
import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';

/**
 * Contains @TestimonialList widget configuration options
 */
export default class TestimonialListConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): TestimonialListConfig | null {
    if (TestimonialListConfig.validate(options)) {
      return new TestimonialListConfig(options);
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

  protected constructor(options: IPlainObject) {
    super(options);
    this.trainerId = options.trainerId;
  }
}
