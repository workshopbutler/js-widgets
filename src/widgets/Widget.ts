import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import WidgetConfig from './config/WidgetConfig';
import IPlainObject from '../interfaces/IPlainObject';
import Formatter from '../view/Formatter';

declare var WIDGET_VERSION: string;

export default abstract class Widget<T extends WidgetConfig> {
  protected readonly $root: JQuery;
  protected readonly apiKey: string;
  protected readonly templates: ITemplates;
  protected readonly config: T;
  protected readonly loc: Localisation;
  protected readonly formatter: Formatter;

  /**
   * Creates a new widget
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {T} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: T) {
    this.$root = $(selector);
    this.apiKey = apiKey;
    this.templates = templates;
    this.loc = loc;
    this.config = config;
    this.formatter = new Formatter(loc);
  }

  /**
   * Returns a properly-formatted statistics about this widget
   */
  protected getWidgetStats(): string {
    return `j;${WIDGET_VERSION};${this.config.theme}`;
  }

  /**
   * Returns parameters that could be used in templates
   */
  protected getTemplateParams(): IPlainObject {
    return {
      _f: (object: any, type: string | null) => {
        return this.formatter.format(object, type);
      },
      _t: (key: string, options: any = null) => {
        return this.loc.translate(key, options);
      },
      config: this.config,
    };
  }
}
