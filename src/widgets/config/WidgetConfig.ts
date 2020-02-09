import IPlainObject from '../../interfaces/IPlainObject';

export type FilterNames = string[] | [string[], string[]];

export default abstract class WidgetConfig {
  readonly template?: string;
  readonly templateUrl?: string;
  readonly fields?: string[];
  readonly theme?: string;

  /**
   * Functions passed to the widgets
   */
  readonly func: IPlainObject;

  protected constructor(options: IPlainObject) {
    this.template = options.template ? options.template : undefined;
    this.templateUrl = options.templateUrl ? options.templateUrl : undefined;
    this.fields = options.fields ? options.fields : undefined;
    this.theme = options.theme ? options.theme : undefined;
    this.func = options.func? options.func : {};
  }
}
