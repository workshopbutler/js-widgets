/**
 * Configuration for featured events
 */
import IPlainObject from '../../interfaces/IPlainObject';

export default class FeaturedConfig {

  /**
   * When true, featured events are highlighted
   */
  readonly highlight: boolean;

  /**
   * When true, featured events go first in the schedule
   */
  readonly onTop: boolean;

  constructor(options?: IPlainObject) {
    this.highlight = options?.highlight !== undefined ? options?.highlight : true;
    this.onTop = options?.onTop !== undefined ? options?.highlight : false;
  }
}
