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
import {FILTER_CHANGED, PAGINATOR_CLICKED, TYPES_LOADED} from './blocks/event-types';
import Type from '../models/workshop/Type';

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
  private filters: AttendeeListFilters;
  private types: Map<number, Type> = new Map();
  private content: JQuery<HTMLElement>;
  private page = 1;

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
    this.subscribe();
    this.renderPage();
    this.content = this.$root.find('[data-content]');
    this.init();

    const uri = new URI('event-types')
      .addQuery('sort', 'name')
      .addQuery('api_key', this.apiKey)
      .addQuery('t', this.getWidgetStats());

    transport.get(uri.href(), {}, (response: ISuccess) => {
      const types = response.data.map((value: IPlainObject) => new Type(value));
      const filteredTypes = this.filterTypes(types);
      filteredTypes.forEach((type: Type) => this.types.set(type.id, type));
      PubSub.publish(TYPES_LOADED, filteredTypes );
      this.loadContent();
    });
  }

  protected filterTypes(types: Type[]): Type[] {
    if (this.config.typeIds.length > 0) {
      return types.filter((value: Type) => this.config.typeIds.includes(value.id));
    } else {
      return types;
    }
  }

  private subscribe() {
    PubSub.subscribe(FILTER_CHANGED, () => {
      this.resetPagination();
      this.loadContent();
    });
    PubSub.subscribe(PAGINATOR_CLICKED, (msg: string, data: IPlainObject) => {
      this.page = data.page;
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
        const attendees: Attendee[] = resp.data.map((x: IPlainObject) => Attendee.fromJSON(x, this.config));
        attendees.forEach((value: Attendee) => {
          if (value.event?.type && typeof value.event.type === 'number') {
            value.event.type = this.types.get(value.event.type);
          }
        });
        const paginator = new Paginator(this.$root, this.loc, resp.total, resp.page, resp.perPage);
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
    const selectedValues = this.filters.getSelectedValues();
    const uri = new URI('attendees/participated');
    if (this.config.length) {
      uri.addQuery('per_page', this.config.length);
    }
    if (this.config.free !== undefined) {
      uri.addQuery('free', this.config.free);
    }
    if (selectedValues.location && selectedValues.location !== 'all') {
      uri.addQuery('countries', selectedValues.location);
    }
    let typeIds = this.config.typeIds;
    if (selectedValues.type && selectedValues.type !== 'all') {
      typeIds = [parseInt(selectedValues.type, 10)];
    }
    if (typeIds.length > 0) {
      uri.addQuery('event.typeIds', typeIds.join(','));
    }
    if (selectedValues.search) {
      uri.addQuery('q', selectedValues.search);
    }

    return uri.addQuery('api_key', this.apiKey)
      .addQuery('t', this.getWidgetStats())
      .addQuery('page', this.page)
      .href();
  }

}
