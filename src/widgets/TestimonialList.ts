import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import IPlainObject from '../interfaces/IPlainObject';
import Trainer from '../models/Trainer';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import Formatter from '../view/Formatter';
import TestimonialListConfig from './config/TestimonialListConfig';
import getTemplate from './helpers/_templates';
import Widget from './Widget';

/**
 * Logic for the list of trainer's testimonials
 */
export default class TestimonialList extends Widget<TestimonialListConfig> {

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

    const config = TestimonialListConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.trainer.testimonials');

      if (!data) {
        data = new TestimonialList(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.trainer.testimonials', data);
      }
    });
  }

  protected readonly formatter: Formatter;
  private trainer: Trainer;

  /**
   * Creates a new testimonial list
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {TestimonialListConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: TestimonialListConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);
    this.init();
    this.loadContent(config.trainerId);
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
    const self = this;
    const url = this.getUrl(trainerId);
    transport.get(url, {},
      (data: IPlainObject) => {
        self.trainer = new Trainer(data, self.config);
        self.render();
      });
  }

  private render() {
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
        trainer: self.trainer,
      };
      const content = template ?
        nunjucksRenderString(template, data) :
        self.templates.testimonialList.render(data);

      self.$root.html(content);
    });
  }

  private getUrl(trainerId: number) {
    return `facilitators/${trainerId}?api_key=${this.apiKey}`;
  }

}
