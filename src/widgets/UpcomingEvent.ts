import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import {ITemplate, ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import UpcomingEventConfig from './config/UpcomingEventConfig';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';
import IPlainObject from '../interfaces/IPlainObject';
import Event from '../models/Event';
import {getLocalTime} from '../utils/Time';
import Duration from '../models/utils/Duration';

/**
 * Logic for the 'UpcomingEvent' abstract element
 */
export default abstract class UpcomingEvent<T extends UpcomingEventConfig> extends Widget<T> {

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
   * @param config {T extends UpcomingEventConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: T) {
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
      const startsIn = this.event ? new Duration(this.event.schedule.start.diffNow()) : null;

      const params = Object.assign({event: this.event, startsIn}, this.getTemplateParams());
      const content = template ?
        nunjucksRenderString(template, params) :
        this.getTemplate().render(params);

      this.$root.html(content);
    });
  }

  /**
   * Returns widget's template
   * @protected
   */
  protected abstract getTemplate(): ITemplate;

  /**
   * Returns API request url
   * @private
   */
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
