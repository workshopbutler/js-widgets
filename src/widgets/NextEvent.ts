import {ITemplate, ITemplates} from '../templates/ITemplates';
import Localisation from '../utils/Localisation';
import UpcomingEventConfig from './config/UpcomingEventConfig';
import UpcomingEvent from './UpcomingEvent';
import Widget from './Widget';

/**
 * Logic for the 'Next event' element
 */
export default class NextEvent extends UpcomingEvent<UpcomingEventConfig> {

  /**
   * @param selector {string} JQuery selector
   * @param apiKey {string} API key
   * @param templates {ITemplates} Templates
   * @param loc {Localisation} Localisation instance
   * @param options {object} Configuration config
   */
  static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
    const config = UpcomingEventConfig.create(options);
    if (!config) {
      return;
    }

    return Widget.attachMe(selector, 'next.event', el =>
      new NextEvent(el, apiKey, templates, loc, config)
    );
  }

  /**
   * Returns widget's template
   * @protected
   */
  protected getTemplate(): ITemplate {
    return this.templates.nextEvent;
  }
}
