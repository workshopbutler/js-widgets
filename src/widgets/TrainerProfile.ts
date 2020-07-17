import {renderString as nunjucksRenderString} from 'nunjucks';
import {logError} from '../common/Error';
import stripHTML from '../common/helpers/StripHtml';
import getQueryParam from '../common/helpers/UrlParser';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import IPlainObject from '../interfaces/IPlainObject';
import Trainer from '../models/Trainer';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import TrainerProfileConfig from './config/TrainerProfileConfig';
import WidgetFactory from './Factory';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';

/**
 * Logic for the trainer details
 */
export default class TrainerProfile extends Widget<TrainerProfileConfig> {

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

    const config = TrainerProfileConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.trainer.details');

      if (!data) {
        data = new TrainerProfile(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.trainer.details', data);
      }
    });
  }

  protected readonly formatter: Formatter;
  private trainer: Trainer;

  /**
   * Creates a new trainer page
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {TrainerProfileConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: TrainerProfileConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);
    const id = getQueryParam('id');
    this.init();
    if (id) {
      this.loadContent(parseInt(id, 0));
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
    document.title = this.trainer.fullName();
  }

  /**
   * Changes the description of the page
   */
  protected updateDescription() {
    const description = stripHTML(this.trainer.bio).substring(0, 140);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', description);
    }
  }

  /**
   * Load slider script
   */
  protected loadSliderScript() {
    const url: string = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js';

    $("body").append($("<script />", { src: url }));

    const intId = setInterval(() => {
      if ($.fn.owlCarousel) {
        clearInterval(intId);
        this.initTestimonialsSlider('testimonial');
        if (window.innerWidth <= 480) {
          this.initTestimonialsSlider('comment');
        };
      };
    }, 100);
  }

  /**
   * Initialization of testimonials slider
   */
  protected initTestimonialsSlider(type) {
    const owl = $(`.owl-carousel-${type}`);

    $(`.wsb-testimonials-counter-${type} .total`)
      .text(owl.find("> div").length);

    owl.owlCarousel({
      items: 1,
      dots: false
    });

    owl.on('changed.owl.carousel', function(e) {
      $(`.wsb-testimonials-counter-${type} .current`).text(+e.item.index + 1);
    });
  }

  private init() {
    if (this.config.theme) {
      this.$root.addClass(this.config.theme);
    }
  }

  /**
   * Loads the trainer and renders the page
   * @param trainerId {number}
   * @private
   */
  private loadContent(trainerId: number) {
    const url = this.getUrl(trainerId);
    transport.get(url, {},
      (resp: ISuccess) => {
        this.trainer = Trainer.fromJSON(resp.data, this.config);
        this.render();
      });
  }

  private render() {
    $.when(getTemplate(this.config)).done(template => {
      const params = Object.assign( { trainer: this.trainer }, this.getTemplateParams());
      const content = template ?
        nunjucksRenderString(template, params) :
        this.templates.trainerProfile.render(params);

      this.$root.html(content);
      this.updateHTML();

      if (this.config.widgets) {
        WidgetFactory.launch({apiKey: this.apiKey}, this.config.widgets);
      };

      this.loadSliderScript();
    });
  }

  private getUrl(trainerId: number) {
    return `facilitators/${trainerId}?api_key=${this.apiKey}&t=${this.getWidgetStats()}`;
  }
}
