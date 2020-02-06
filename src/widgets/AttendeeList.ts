import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';
import AttendeeListConfig from './config/AttendeeListConfig';
import Attendee from '../models/Attendee';
import IPlainObject from '../interfaces/IPlainObject';
import AttendeeListFilters from './blocks/AttendeeListFilters';
import PubSub from 'pubsub-js';
import URI from 'urijs';
import Paginator from './blocks/Paginator';
import {PAGINATOR_CLICK, SEARCH_CHANGED} from './blocks/event-types';

/**
 * Logic for the list of attendees
 */
export default class AttendeeList extends Widget<AttendeeListConfig> {

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

    const config = AttendeeListConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.attendee.list');

      if (!data) {
        data = new AttendeeList(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.attendee.list', data);
      }
    });
  }

  protected readonly formatter: Formatter;
  private readonly filters: AttendeeListFilters;
  private content: JQuery<HTMLElement>;
  private page = 1;
  private search?: string;

  /**
   * Creates a new attendee list
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {AttendeeListConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: AttendeeListConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);
    this.filters = new AttendeeListFilters(selector, this.loc, this.config.filters);
    this.renderPage();
    this.content = this.$root.find('[data-content]');
    this.init();
    this.subscribe();
    this.loadContent();
  }

  private subscribe() {
    PubSub.subscribe('attendee.list.reload', () => {
      this.resetPagination();
      this.loadContent();
    });
    PubSub.subscribe(PAGINATOR_CLICK, (msg: string, data: IPlainObject) => {
      this.page = data.page;
      this.loadContent();
    });
    PubSub.subscribe(SEARCH_CHANGED, (msg: string, data: IPlainObject) => {
      this.search = data.value;
      this.loadContent();
    });
  }

  private loading() {
    this.content.html('Loading...');
  }

  private resetPagination() {
    this.page = 1;
    Paginator.updateQuery(this.page);
  }

  private init() {
    if (this.config.theme) {
      this.$root.addClass(this.config.theme);
    }
    this.loading();
    this.page = Paginator.getPageFromQuery();
  }

  private renderPage() {
    const uniqueParams = {
      filters: this.filters.filters,
    };
    const params = Object.assign(uniqueParams, this.getTemplateParams());
    const content = this.templates.attendeesPage.render(params);
    this.$root.html(content);
  }

  /**
   * Loads the list of attendees and renders the page
   * @private
   */
  private loadContent() {
    const url = this.getUrl();
    this.loading();
    transport.get(url, {},
      (resp: ISuccess) => {
        const attendees = resp.data.map((x: IPlainObject) => Attendee.fromJSON(x, this.config));
        const paginator = new Paginator(this.$root, resp.total, resp.page, resp.perPage);
        this.renderContent(attendees, paginator);
      });
  }

  private renderContent(attendees: Attendee[], paginator: Paginator) {
    $.when(getTemplate(this.config)).done(template => {
      const params = Object.assign({attendees, paginator}, this.getTemplateParams());
      const content = template ?
        nunjucksRenderString(template, params) :
        this.templates.attendeesList.render(params);

      this.content.html(content);
    });
  }

  private getUrl() {
    const uri = new URI('attendees/participated');
    if (this.config.length) {
      uri.addQuery('per_page', this.config.length);
    }
    if (this.config.free !== undefined) {
      uri.addQuery('free', this.config.free);
    }
    if (this.filters.selectedLocation) {
      uri.addQuery('countries', this.filters.selectedLocation);
    }
    if (this.search) {
      uri.addQuery('q', this.search);
    } else {
      uri.removeSearch('q');
    }
    return uri.addQuery('api_key', this.apiKey)
      .addQuery('t', this.getWidgetStats())
      .addQuery('page', this.page)
      .href();
  }

}
