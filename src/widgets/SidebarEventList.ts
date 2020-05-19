import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import IPlainObject from '../interfaces/IPlainObject';
import Event from '../models/Event';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import SidebarEventListConfig from './config/SidebarEventListConfig';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';

/**
 * Logic for the sidebar list of events
 */
export default class SidebarEventList extends Widget<SidebarEventListConfig> {

  /**
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param options {object} Configuration config
   */
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: IPlainObject) {
    const $elems = $(selector);
    if (!$elems.length) {
      return;
    }

    const config = SidebarEventListConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.sidebar.event.list');

      if (!data) {
        data = new SidebarEventList(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.sidebar.event.list', data);
      }
    });
  }

  protected readonly formatter: Formatter;
  private readonly $list: JQuery;
  private events: Event[];

  /**
   * Creates a new list
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates for widgets
   * @param loc {Localisation} Localisation instance
   * @param config {SidebarEventListConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: SidebarEventListConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);

    this.$list = this.$root.find('[data-events-list]');
    this.events = [];
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
   */
  private loadContent() {
    $.when(this.getVisitorCountry()).done(country => {
      const length = this.config.length ? this.config.length : 3;
      const url = this.getUrl(country, length);
      transport.get(url, {},
        (resp: ISuccess) => {
          let events = resp.data.map((e: IPlainObject) => Event.fromJSON(e, this.config));
          events = events.filter((e: Event) => e.hashedId !== this.config.excludeId);
          if (this.config.featured.onTop) {
            events = events.filter((e: Event) => e.featured).concat(events.filter((e: Event) => !e.featured));
          }
          this.events = events;
          this.renderUpcomingEventList();
        });
    });
  }

  /**
   * Sends a request to detect the country of the visitor if needed
   * @private
   */
  private getVisitorCountry() {
    const defer = $.Deferred();

    if (this.config.country && this.config.country === 'detect') {
      transport.get(`/utils/country?api_key=${this.apiKey}`, {},
        (data: any) => {
          defer.resolve(data.response.country);
        },
        () => {
          defer.resolve(null);
        });
    } else {
      defer.resolve(this.config.country);
    }
    return defer.promise();
  }

  private renderUpcomingEventList() {
    $.when(getTemplate(this.config)).done(template => {
      const templateParams = this.getTemplateParams();

      function renderTemplate(event: Event) {
        const localParams = Object.assign({event}, templateParams);
        return nunjucksRenderString(template, localParams);
      }

      const uniqueParams = {
        events: this.events,
        template: renderTemplate,
      };
      const params = Object.assign(uniqueParams, templateParams);
      if (params.events.length) {
        const content = this.templates.sidebarEventList.render(params);
        this.$list.html(content);
        if (this.config.hideIfEmpty) {
          this.$root.show();
        }
      } else {
        if (this.config.hideIfEmpty) {
          this.$root.hide();
        } else {
          this.$list.html(this.loc.translate('sidebar.noEvents'));
        }
      }
    });
  }

  /**
   * Makes a request string
   * @param country {string|null}
   * @param length {number} Number of events in the widget
   * @return {string}
   * @private
   */
  private getUrl(country: string, length: number) {
    let fields = 'title,location,hashed_id,schedule,free,spoken_languages';
    if (this.config.fields) {
      fields += ',' + this.config.fields.join(',');
    }
    const dates = this.config.future ? 'future' : 'past';
    let sort = '+start_date';
    if (!this.config.future) {
      sort = '-start_date';
    }
    let url = `events?api_key=${this.apiKey}&dates=${dates}&sort=${sort}&public=true&fields=${fields}&` +
      `t=${this.getWidgetStats()}&per_page=${length}`;
    if (country) {
      url += `&countryCode=${country}`;
    }
    if (this.config.eventType) {
      url += `&eventType=${this.config.eventType}`;
    }
    if (this.config.trainerId) {
      url += `&trainerId=${this.config.trainerId}`;
    }
    if (this.config.categoryId) {
      url += `&categoryId=${this.config.categoryId}`;
    }
    if (this.config.expand.length > 0) {
      url += `&expand=${this.config.expand.toString()}`;
    }
    return url;
  }
}
