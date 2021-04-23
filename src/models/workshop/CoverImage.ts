import IPlainObject from '../../interfaces/IPlainObject';

/**
 * A cover image for a workshop
 */
export default class CoverImage {

  static fromJSON(json?: IPlainObject): CoverImage {
    return json ? new CoverImage(json.url, json.thumbnail, json.thumbnail_m) : new CoverImage();
  }

  /**
   * URL to a full image
   */
  readonly url?: string;

  /**
   * URL to the small thumbnail
   */
  readonly thumbnail?: string;

  /**
   * URL to the medium thumbnail
   */
  readonly thumbnailMedium?: string;

  constructor(url?: string, thumbnail?: string, thumbnailMedium?: string) {
    this.url = url ? url : undefined;
    this.thumbnail = thumbnail ? thumbnail : undefined;
    this.thumbnailMedium = thumbnailMedium ? thumbnailMedium : undefined;
  }

}
