import {renderString as nunjucksRenderString} from 'nunjucks';
import {logError} from '../common/Error';
import stripHTML from '../common/helpers/StripHtml';
import getQueryParam from '../common/helpers/UrlParser';
import transport from '../common/Transport';
import EventFormatter from '../formatters/jsonld/EventFormatter';
import Formatter from '../formatters/plain/Formatter';
import IPlainObject from '../interfaces/IPlainObject';
import Event from '../models/Event';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import EventPageConfig from './config/EventPageConfig';
import WidgetFactory from './Factory';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import { isUndefined } from 'util';

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
    this.updateImage();
    this.updateDescription();
  }

  /**
   * Changes the title of the page
   */
  protected updateTitle() {
    document.title = this.event.title;
    if (this.config.eventTitleElement) {
      const titleEl = $(this.config.eventTitleElement);
      if (titleEl && titleEl.html()) {
        titleEl.html(this.event.title);
      }
    }
  }

  /**
   * Changes the event image of the page
   */
  protected updateImage() {
    if (this.config.eventImageElement) {
      const imageEl = $(this.config.eventImageElement);
      if (imageEl && this.event.coverImage.url) {
        const imageUrl = this.event.coverImage.url;
        ['data-src', 'data-image', 'src'].forEach(attr => {
          if (imageEl.attr(attr) != undefined) {
            imageEl.attr(attr, imageUrl);
          }
        });
      }
    }
  }

  /**
   * Changes the description of the page
   */
  protected updateDescription() {
    const description = stripHTML(this.event.description).substring(0, 140);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', description);
    }
  }

  /**
   * Adds JSON-LD markup to the page
   */
  protected addJsonLD() {
    const jsonLd = EventFormatter.format(this.event);
    $('head').append(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
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
      (data: IPlainObject) => {
        self.event = new Event(data, self.config);
        self.updateHTML();
        self.addJsonLD();
        self.renderWidget();
      });
  }

  private renderWidget() {
    const self = this;
    $.when(getTemplate(self.config)).done((template) => {
      const params = Object.assign( { event: self.event }, self.getTemplateParams());

      const content = template ?
        nunjucksRenderString(template, params) :
        self.templates.eventPage.render(params);

      self.$root.html(content);
      if (self.config.widgets) {
        WidgetFactory.launch({apiKey: self.apiKey}, self.config.widgets);
      }
    });
  }

  private getUrl(eventId: string) {
    return `events/${eventId}?api_key=${this.apiKey}&fields=trainer.rating&t=${this.getWidgetStats()}`;
  }

}
