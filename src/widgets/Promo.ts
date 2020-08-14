import {ITemplate, ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import UpcomingEvent from './UpcomingEvent';
import Widget from './Widget';
import PromoConfig from './config/PromoConfig';

/**
 * Logic for the 'Promo' element
 */
export default class Promo extends UpcomingEvent<PromoConfig> {

  /**
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param options {object} Configuration config
   */
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
    const config = PromoConfig.create(options);
    if (!config) {
      return;
    }

    return Widget.attachMe(selector, 'promo', el =>
      new Promo(el, apiKey, templates, loc, config)
    );
  }

  /**
   * Returns widget's template
   * @protected
   */
  protected getTemplate(): ITemplate {
    return this.templates.promo;
  }
}
