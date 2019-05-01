import IPlainObject from '../../interfaces/IPlainObject';

/**
 * A cover image for a workshop
 */
export default class CoverImage {

  /**
   * URL to a full image
   */
  readonly url?: string;

  /**
   * URL to an original image
   */
  readonly thumbnail?: string;

  constructor(json: IPlainObject) {
    this.url = json.url ? json.url : undefined;
    this.thumbnail = json.thumbnail ? json.thumbnail : undefined;
  }
}
