import IPlainObject from '../../interfaces/IPlainObject';

/**
 * A cover image for a workshop
 */
export default class CoverImage {

  static fromJSON(json?: IPlainObject): CoverImage {
    return json ? new CoverImage(json.url, json.thumbnail) : new CoverImage();
  }

  /**
   * URL to a full image
   */
  readonly url?: string;

  /**
   * URL to the thumbnail
   */
  readonly thumbnail?: string;

  constructor(url?: string, thumbnail?: string) {
    this.url = url ? url : undefined;
    this.thumbnail = thumbnail ? thumbnail : undefined;
  }
}
