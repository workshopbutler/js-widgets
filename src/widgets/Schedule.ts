import {renderString as nunjucksRenderString} from 'nunjucks';
import {logError} from '../common/Error';
import transport from '../common/Transport';
import IPlainObject from '../interfaces/IPlainObject';
import Event from '../models/Event';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import Filters from './blocks/EventListFilters';
import ScheduleConfig from './config/ScheduleConfig';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';

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
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: IPlainObject) {
    const $elems = $(selector);
    if (!$elems.length) {
      logError("Page element, referenced in 'target' attribute, is not found");
      return;
    }

    // Add tag element for mobile view
    options.cols = ['wsb-tag-mob', ...options.cols];

    const config = ScheduleConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widgets.event.list');
      if (!data) {
        data = new Schedule(el, apiKey, templates, loc, config);
        $element.data('wsb.widgets.event.list', data);
      }
    });
  }

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
    const url = this.getUrl();
    transport.get(url, {},
      (data: ISuccess) => {
        let events = data.data.map((e: IPlainObject) => Event.fromJSON(e, this.config));
        if (this.config.onlyFeatured) {
          events = events.filter((event: Event) => event.featured);
        }
        if (this.config.featured.onTop) {
          events = events.filter((e: Event) => e.featured).concat(events.filter((e: Event) => !e.featured));
        }
        if (this.config.length && this.config.length >= 0) {
          events = events.slice(0, this.config.length);
        }
        this.events = events;
        this.render();
      });
  }

  private render() {
    $.when(getTemplate(this.config)).done(template => {
      const templateParams = this.getTemplateParams();

      function renderTemplate(event: Event) {
        const localParams = Object.assign({event}, templateParams);
        return nunjucksRenderString(template, localParams);
      }

      const uniqueParams = {
        events: this.events,
        filters: this.filters.getFilters(this.events),
        template: template ? renderTemplate : null,
      };
      const params = Object.assign(uniqueParams, templateParams);
      const content = this.templates.schedule.render(params);
      this.$root.html(content).promise().done(() => {
        this.filters.filterEvents();
      });
    });
  }

  private getUrl() {
    let categoryId = '';
    if (this.config.categoryId) {
      categoryId = `&categoryId=${this.config.categoryId}`;
    }
    let eventTypeId = '';
    if (this.config.eventTypeId) {
      eventTypeId = `&eventType=${this.config.eventTypeId}`;
    }
    let trainerId = '';
    if (this.config.trainerId) {
      trainerId = `&trainerId=${this.config.trainerId}`;
    }
    let expand = '';
    if (this.config.expand.length > 0) {
      expand = `&expand=${this.config.expand.toString()}`;
    }
    const dates = this.config.future ? 'future' : 'past';
    let sort = '+start_date';
    if (!this.config.future) {
      sort = '-start_date';
    }
    const query = `dates=${dates}&sort=${sort}&public=true${categoryId}` +
      `${eventTypeId}${trainerId}${expand}`;
    return `events?api_key=${this.apiKey}&${query}&t=${this.getWidgetStats()}&per_page=-1`;
  }

}
