import {logError} from '../../common/Error';
import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';

/**
 * Contains @TrainerList widget configuration options
 */
export default class TrainerListConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): TrainerListConfig | null {
    if (TrainerListConfig.validate(options)) {
      return new TrainerListConfig(options);
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
    if (!options.trainerPageUrl || typeof options.trainerPageUrl !== 'string') {
      logError('Attribute [trainerPageUrl] is not set correctly');
      valid = false;
    }
    if (!options.filters || typeof options.filters !== 'object') {
      logError('Attribute [filters] is not set correctly');
      valid = false;
    }
    return valid;
  }

  /**
   * URL of the page with @TrainerProfile widget
   */
  readonly trainerPageUrl: string;

  /**
   * Names of active filters
   */
  readonly filters: string[];

  /**
   * If true, the list of badges for each trainer is shown
   */
  readonly showBadges: boolean;

  /**
   * If true, a trainer public rating is shown
   */
  readonly showRating: boolean;

  protected constructor(options: IPlainObject) {
    super(options);
    this.trainerPageUrl = options.trainerPageUrl;
    this.filters = options.filters;
    if (options.badges !== undefined) {
      this.showBadges = options.badges;
    } else {
      this.showBadges = this.filters.indexOf('badge') >= 0;
    }
    if (options.rating !== undefined) {
      this.showRating = options.rating;
    } else {
      this.showRating = this.filters.indexOf('rating') >= 0;
    }
  }

}
