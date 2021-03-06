import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import Trainer from '../models/Trainer';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import TestimonialListConfig from './config/TestimonialListConfig';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';

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
    const config = TestimonialListConfig.create(options);
    if (!config) {
      return;
    }

    return Widget.attachMe(selector, 'testimonials', el =>
      new TestimonialList(el, apiKey, templates, loc, config)
    );
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
    const url = this.getUrl(trainerId);
    transport.get(url, {},
      (resp: ISuccess) => {
        this.trainer = Trainer.fromJSON(resp.data, this.config);
        this.render();
      });
  }

  private render() {
    $.when(getTemplate(this.config)).done(template => {
      const params = Object.assign({ trainer: this.trainer }, this.getTemplateParams());
      const content = template ?
        nunjucksRenderString(template, params) :
        this.templates.testimonialList.render(params);

      this.$root.html(content);
    });
  }

  private getUrl(trainerId: number) {
    return `facilitators/${trainerId}?api_key=${this.apiKey}`;
  }

}
