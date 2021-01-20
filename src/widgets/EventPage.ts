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
    const config = EventPageConfig.create(options);
    if (!config) {
      return;
    }

    return Widget.attachMe(selector, 'event.details', el =>
      new EventPage(el, apiKey, templates, loc, config)
    );
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
    this.updateDescription();
  }

  /**
   * Changes the title of the page
   */
  protected updateTitle() {
    document.title = this.event.title;
  }

  /**
   * Changes the description of the page
   */
  protected updateDescription() {
    const description = stripHTML(this.event.description ?? '').substring(0, 140);
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
    const url = this.getUrl(eventId);

    transport.get(url, {},
      (data: IPlainObject) => {
        this.event = Event.fromJSON(data.data, this.config);
        this.updateHTML();
        this.addJsonLD();
        this.renderWidget();
      });
  }

  /**
   * Initialize top testimonials slider
   */
  protected initTestimonialsTop() {
    const owl = $(`.owl-carousel-testimonial`);

    $(`.wsb-testimonials-counter .total`)
      .text(owl.find("> div").length);


    owl.owlCarousel({
      items: 1,
      dots: false,
      nav: true
    });

    owl.on('changed.owl.carousel', function(e) {
      $(`.wsb-testimonials-counter .current`)
        .text(+e.item.index + 1);
    });
  }

  private renderWidget() {
    $.when(getTemplate(this.config)).done(template => {
      const params = Object.assign({event: this.event}, this.getTemplateParams());

      const content = template ?
        nunjucksRenderString(template, params) :
        this.templates.eventPage.render(params);

      this.$root.html(content);
      this.renderCoverImage();
      if (this.config.widgets) {
        WidgetFactory.launch({apiKey: this.apiKey}, this.config.widgets);
      }

      // init testimonial slider
      $.getScript(
        'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js'
      ).done(() => { this.initTestimonialsTop(); });

    });
  }

  private renderCoverImage() {
    if (this.event.coverImage && this.config.coverImage.showOutside()) {
      let html = `<img src="${this.event.coverImage.url}"`;
      html += this.config.coverImage.width ? ` width="${this.config.coverImage.width}" ` : '';
      html += this.config.coverImage.height ? ` height="${this.config.coverImage.height}" ` : '';
      html += '/>';
      $(this.config.coverImage.placeholder as string).html(html);
    }
  }

  private getUrl(eventId: string) {
    let expand = 'trainer.stats';
    if (this.config.trainers.bio) {
      expand += ',trainer.bio';
    }
    return `events/${eventId}?api_key=${this.apiKey}&expand=${expand}&t=${this.getWidgetStats()}`;
  }

}
