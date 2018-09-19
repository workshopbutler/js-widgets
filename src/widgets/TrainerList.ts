import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Trainer from '../models/Trainer';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import Formatter from '../view/Formatter';
import Filters, {default as TrainerListFilters} from './blocks/TrainerListFilters';
import TrainerListConfig from './config/TrainerListConfig';
import getTemplate from './helpers/_templates';
import Widget from './Widget';
import PlainObject = JQuery.PlainObject;

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
    const $elems = $(selector);
    if (!$elems.length) {
      return;
    }

    const config = TrainerListConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.trainer.list');

      if (!data) {
        data = new TrainerList(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.trainer.list', data);
      }
    });
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
    const self = this;

    const url = this.getUrl();
    transport.get(url, {},
      (data: PlainObject[]) => {
        self.trainers = data.map((trainer: PlainObject) => {
          return new Trainer(trainer, self.config);
        });
        self.render();
      });
  }

  private render() {
    const self = this;
    $.when(getTemplate(self.config)).done((template) => {
      function renderTemplate(trainer: Trainer) {
        return nunjucksRenderString(template, { trainer });
      }

      const data = {
        _f: (object: any, type: string | null) => {
          return self.formatter.format(object, type);
        },
        _t: (key: string, options: any = null) => {
          return self.loc.translate(key, options);
        },
        filters: self.filters.getFilters(self.trainers),
        template: template ? renderTemplate : null,
        trainers: self.trainers,
      };
      const content = self.templates.trainerList.render(data);
      self.$root.html(content);
    });
  }

  private getUrl(): string {
    return `facilitators?api_key=${this.apiKey}`;
  }

}
