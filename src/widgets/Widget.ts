import Formatter from '../formatters/plain/Formatter';
import IPlainObject from '../interfaces/IPlainObject';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import WidgetConfig from './config/WidgetConfig';

declare const WIDGET_VERSION: string;

export default abstract class Widget<T extends WidgetConfig> {
  protected readonly $root: JQuery;
  protected readonly apiKey: string;
  protected readonly templates: ITemplates;
  protected readonly config: T;
  protected readonly loc: Localisation;
  protected readonly formatter: Formatter;

  /**
   * Attaches the component to the HTML elements
   * @param selector {string} HTML element selector
   * @param property {string} Name of the property to store the component
   * @param callback {Function} Component initialisation function
   */
  protected static attachMe<K extends Widget<any>>(selector: string,
                                                   property: string,
                                                   callback: (el: HTMLElement) => K) {
    const $elems = $(selector);
    if (!$elems.length) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      const identifier = `wsb.widget.${property}`;
      let data = $element.data(identifier);

      if (!data) {
        data = callback(el);
        $element.data(identifier, data);
      }
    });
  }

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
      _f: (object: any, type: string | null) => this.formatter.format(object, type),
      _t: (key: string, options: any = null) => this.loc.translate(key, options),
      config: this.config,
    };
  }
}
