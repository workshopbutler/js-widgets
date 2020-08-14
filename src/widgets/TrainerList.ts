import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Formatter from '../formatters/plain/Formatter';
import IPlainObject from '../interfaces/IPlainObject';
import Trainer from '../models/Trainer';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import Filters, {default as TrainerListFilters} from './blocks/TrainerListFilters';
import TrainerListConfig from './config/TrainerListConfig';
import getTemplate from './helpers/Templates';
import Widget from './Widget';
import ISuccess from '../interfaces/ISuccess';

/**
 * Logic for the list of trainers
 */
export default class TrainerList extends Widget<TrainerListConfig> {

  /**
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param options {object} Configuration config
   */
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
    const config = TrainerListConfig.create(options);
    if (!config) {
      return;
    }

    return Widget.attachMe(selector, 'trainer.list', el =>
      new TrainerList(el, apiKey, templates, loc, config)
    );
  }

  protected readonly formatter: Formatter;
  private trainers: Trainer[] = [];
  private readonly filters: TrainerListFilters;

  /**
   * Creates a new list
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {TrainerListConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: TrainerListConfig) {
    super(selector, apiKey, templates, loc, config);
    this.formatter = new Formatter(loc);

    this.filters = new Filters(selector, loc, config.filters);
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
   * @private
   */
  private loadContent() {
    const url = this.getUrl();
    transport.get(url, {},
      (resp: ISuccess) => {
        this.trainers = resp.data.map((trainer: IPlainObject) => Trainer.fromJSON(trainer, this.config));
        this.render();
      });
  }

  private render() {
    $.when(getTemplate(this.config)).done(template => {
      const templateParams = this.getTemplateParams();

      function renderTemplate(trainer: Trainer) {
        const localParams = Object.assign({trainer}, templateParams);
        return nunjucksRenderString(template, localParams);
      }

      const uniqueParams = {
        filters: this.filters.getFilters(this.trainers),
        template: template ? renderTemplate : null,
        trainers: this.trainers,
      };
      const params = Object.assign(uniqueParams, templateParams);
      const content = this.templates.trainerList.render(params);
      this.$root.html(content);
    });
  }

  private getUrl(): string {
    return `facilitators?api_key=${this.apiKey}&t=${this.getWidgetStats()}&per_page=-1`;
  }

}
