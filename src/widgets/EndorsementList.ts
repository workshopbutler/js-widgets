import {renderString as nunjucksRenderString} from 'nunjucks';
import transport from '../common/Transport';
import Trainer from '../models/Trainer';
import {ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import Formatter from '../view/Formatter';
import EndorsementListConfig from './config/EndorsementListConfig';
import getTemplate from './helpers/_templates';
import Widget from './Widget';
import PlainObject = JQuery.PlainObject;

/**
 * Logic for the trainer details
 */
export default class EndorsementList extends Widget<EndorsementListConfig> {

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

    const config = EndorsementListConfig.create(options);
    if (!config) {
      return;
    }

    return $elems.each((index, el) => {
      const $element = $(el);
      let data = $element.data('wsb.widget.trainer.endorsements');

      if (!data) {
        data = new EndorsementList(el, apiKey, templates, loc, config);
        $element.data('wsb.widget.trainer.endorsements', data);
      }
    });
  }

  protected readonly formatter: Formatter;
  private trainer: Trainer;

  /**
   * Creates a new endorsement list
   * @param selector {HTMLElement} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param config {EndorsementListConfig} Configuration config
   */
  protected constructor(selector: HTMLElement,
                        apiKey: string,
                        templates: ITemplates,
                        loc: Localisation,
                        config: EndorsementListConfig) {
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
      (data: PlainObject) => {
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
        self.templates.endorsementList.render(data);

      self.$root.html(content);
    });
  }

  private getUrl(trainerId: number) {
    return `facilitators/${trainerId}?api_key=${this.apiKey}`;
  }

}
