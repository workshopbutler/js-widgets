export default class CoverImageConfig {

  /**
   * True if cover image must be shown
   */
  readonly show: boolean = false;

  /**
   * ID of the HTML element where to put a cover image
   *
   * When defined, cover image is shown outside of default template (like header image)
   */
  readonly placeholder?: string = undefined;

  /**
   * Width of the cover image (used only if placeholder is defined)
   */
  readonly width?: string = undefined;

  /**
   * Height of the cover image (used only if placeholder is defined)
   */
  readonly height?: string = undefined;

  constructor(show = false, placeholder?: string, width?: string, height?: string) {
    this.show = show;
    this.placeholder = placeholder;
    this.width = width;
    this.height = height;
  }

  showOutside() {
    return this.show && this.placeholder !== undefined;
  }

  showInside() {
    return this.show && this.placeholder === undefined;
  }
}
