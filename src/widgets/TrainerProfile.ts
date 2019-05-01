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
        const params = Object.assign( { trainer: self.trainer }, self.getTemplateParams());
        const content = template ?
          nunjucksRenderString(template, params) :
          self.templates.trainerProfile.render(params);

        self.$root.html(content);
        self.updateHTML();
        if (self.config.widgets) {
          WidgetFactory.launch({apiKey: self.apiKey}, self.config.widgets);
        }
      });
  }

  private getUrl(trainerId: number) {
    return `facilitators/${trainerId}?api_key=${this.apiKey}&t=${this.getWidgetStats()}`;
  }
}
