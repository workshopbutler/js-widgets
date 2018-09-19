import {renderString as nunjucksRenderString} from 'nunjucks';
import {logError} from '../common/Error';
import {getQueryParam} from '../common/helpers/_urlParser';
import transport from '../common/Transport';
import WidgetFactory from '../Factory';
import {ITemplates} from '../interfaces/ITemplates';
import Event from '../models/Event';
import Localisation from '../utils/Localisation';
import Formatter from '../view/Formatter';
import EventPageConfig from './config/EventPageConfig';
import getTemplate from './helpers/_templates';
import Widget from './Widget';
import PlainObject = JQuery.PlainObject;

/**
 * Logic for the event details
 */
export default class EventPage extends Widget<EventPageConfig> {

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

    const config = EventPageConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.event.details');

      if (!data) {
        data = new EventPage(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.event.details', data);
      }
    });
  }

  protected readonly formatter: Formatter;
  protected event: Event;

  /**
   * Creates a new event page
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {EventPageConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: EventPageConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);
    this.init();
    const id = getQueryParam('id');
    if (id) {
      this.loadContent(id);
    } else {
      logError('`id` query parameter is not found');
    }
  }

  /**
   * Updates key elements of the page
   */
  protected updateHTML() {
    this.updateTitle();
  }

  /**
   * Changes the title of the page
   */
  protected updateTitle() {
    document.title = this.event.title;
  }

  private init() {
    if (this.config.theme) {
      this.$root.addClass(this.config.theme);
    }
  }

  /**
   * Loads the event and renders the page
   * @param eventId {number}
   */
  private loadContent(eventId: string) {
    const self = this;
    const url = this.getUrl(eventId);

    transport.get(url, {},
      (data: PlainObject) => {
        self.event = new Event(data, self.config);
        self.renderWidget();
      });
  }

  private renderWidget() {
    const self = this;
    $.when(getTemplate(self.config)).done((template) => {
      const data = {
        _f: (object: any, type: string | null) => {
          return self.formatter.format(object, type);
        },
        _t: (key: string, options: any = null) => {
          return self.loc.translate(key, options);
        },
        config: self.config,
        event: self.event,
      };
      const content = template ?
        nunjucksRenderString(template, data) :
        self.templates.eventPage.render(data);

      self.$root.html(content);
      self.updateHTML();
      if (self.config.widgets) {
        WidgetFactory.launch({apiKey: self.apiKey}, self.config.widgets);
      }
    });
  }

  private getUrl(eventId: string) {
    return `events/${eventId}?api_key=${this.apiKey}&fields=trainer.rating`;
  }

}
