import UpcomingEventConfig from './UpcomingEventConfig';
import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Configuration for 'Promo' element
 */
export default class PromoConfig extends UpcomingEventConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): PromoConfig | null {
    return new PromoConfig(options);
  }

  /**
   * Show the timer
   */
  readonly timer: boolean;

  /**
   * Show the language of event within Location block
   */
  readonly language: boolean;

  /**
   * Show a country flag within Location block
   */
  readonly flag: boolean;

  /**
   * Defines the order of blocks (possible values: date, location, trainer)
   */
  readonly order: string[];

  protected constructor(options: IPlainObject) {
    super(options);
    this.timer = options.timer !== undefined ? options.timer : false;
    this.language = options.language !== undefined ? options.language : true;
    this.flag = options.flag !== undefined ? options.flag : false;
    this.order = options.order !== undefined ? options.order : ['date', 'location', 'trainer'];
  }
}
