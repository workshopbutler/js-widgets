import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import NextEventConfig from './config/NextEventConfig';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';
import IPlainObject from '../interfaces/IPlainObject';
import Event from '../models/Event';

/**
 * Logic for the 'Next event' element
 */
export default class NextEvent extends Widget<NextEventConfig> {

  /**
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param options {object} Configuration config
   */
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
    const $elems = $(selector);
    if (!$elems.length) {
      return;
    }

    const config = NextEventConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.next.event');

      if (!data) {
        data = new NextEvent(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.next.event', data);
      }
    });
  }

  protected readonly formatter: Formatter;

  /**
   * Next event
   */
  private event: Event | null;

  /**
   * Creates a new testimonial list
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {NextEventConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: NextEventConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);
    this.init();
    this.loadContent();
  }

  private init() {
    if (this.config.theme) {
      this.$root.addClass(this.config.theme);
    }
  }

  /**
   * Loads the event and renders the element
   * @private
   */
  private loadContent() {
    const url = this.getUrl();
    transport.get(url, {},
      (data: ISuccess) => {
        const events = data.data.map((e: IPlainObject) => Event.fromJSON(e, this.config));
        if (events.length === 0) {
          this.event = null;
        } else {
          this.event = events[0];
        }
        this.render();
      });
  }

  private render() {
    $.when(getTemplate(this.config)).done(template => {
      const params = Object.assign({event: this.event}, this.getTemplateParams());
      const content = template ?
        nunjucksRenderString(template, params) :
        this.templates.nextEvent.render(params);

      this.$root.html(content);
    });
  }

  private getUrl() {
    let categoryId = '';
    if (this.config.categoryId) {
      categoryId = `&categoryId=${this.config.categoryId}`;
    }
    let eventTypeId = '';
    if (this.config.eventTypeIds) {
      eventTypeId = `&eventType=${this.config.eventTypeIds.join(',')}`;
    }
    const query = `dates=future&sort=+start_date&public=true${categoryId}` +
      `${eventTypeId}`;
    return `events?api_key=${this.apiKey}&${query}&t=${this.getWidgetStats()}&per_page=1`;
  }

}
