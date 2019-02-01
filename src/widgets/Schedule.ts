import {renderString as nunjucksRenderString} from 'nunjucks';
import {logError} from '../common/Error';
import transport from '../common/Transport';
import IPlainObject from '../interfaces/IPlainObject';
import Event from '../models/Event';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import Formatter from '../view/Formatter';
import Filters from './blocks/EventListFilters';
import ScheduleConfig from './config/ScheduleConfig';
import getTemplate from './helpers/_templates';
import Widget from './Widget';

/**
 * Logic for the list of events
 */
export default class Schedule extends Widget<ScheduleConfig> {

  /**
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {DefaultTemplates} DefaultTemplates
   * @param loc {Localisation} Localisation instance
   * @param options {object} Configuration config
   */
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
    const $elems = $(selector);
    if (!$elems.length) {
      logError("Page element, referenced in 'target' attribute, is not found");
      return;
    }
    const config = ScheduleConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.event.list');

      if (!data) {
        data = new Schedule(el, apiKey, templates, loc, options);
        $element.data('wsb.widget.event.list', data);
      }
    });
  }

  protected readonly formatter: Formatter;
  private readonly filters: Filters;
  private events: Event[];

  /**
   * Creates a new schedule
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} DefaultTemplates
   * @param loc {Localisation} Localisation instance
   * @param config {ScheduleConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: ScheduleConfig) {
    super(selector, apiKey, templates, loc, config);
    this.events = [];
    this.formatter = new Formatter(loc);

    this.filters = new Filters(selector, this.loc, config.filters);
    this.init();
    this.loadContent();
  }

  private init() {
    if (this.config.theme) {
      this.$root.addClass(this.config.theme);
    }
  }

  /**
   * Loads events and renders the table
   * @private
   */
  private loadContent() {
    const self = this;

    const url = this.getUrl();
    transport.get(url, {},
      (data: IPlainObject[]) => {
        self.events = data.map((event: IPlainObject) => {
          return new Event(event, self.config);
        });
        self.render();
      });
  }

  private render() {
    const self = this;
    $.when(getTemplate(self.config)).done((template) => {
      function renderTemplate(event: Event) {
        return nunjucksRenderString(template, { event });
      }

      const data = {
        _f: (object: any, type: string | null) => {
          return self.formatter.format(object, type);
        },
        _t: (key: string, options: any = null) => {
          return self.loc.translate(key, options);
        },
        config: self.config,
        events: self.events,
        filters: self.filters.getFilters(self.events),
        template: template ? renderTemplate : null,
      };
      const content = self.templates.schedule.render(data);
      self.$root.html(content);
    });
  }

  private getUrl() {
    let fields = 'title,schedule,location,hashed_id,free,type,registration_page,' +
      'spoken_languages,sold_out,facilitators,free_ticket_type,paid_ticket_types';
    if (this.config.fields) {
      fields += ',' + this.config.fields.join(',');
    }
    let categoryId = '';
    if (this.config.categoryId) {
      categoryId = `&categoryId=${this.config.categoryId}`;
    }
    const query = `future=true&public=true&fields=${fields}${categoryId}`;
    return `events?api_key=${this.apiKey}&${query}&t=${this.getWidgetStats()}`;
  }

}
