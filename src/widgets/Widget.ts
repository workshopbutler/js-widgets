import {ITemplates} from '../interfaces/ITemplates';
import Localisation from '../utils/Localisation';
import WidgetConfig from './config/WidgetConfig';

export default abstract class Widget<T extends WidgetConfig> {
    protected readonly $root: JQuery;
    protected readonly apiKey: string;
    protected readonly templates: ITemplates;
    protected readonly config: T;
    protected readonly loc: Localisation;

    /**
     * Creates a new widget
     * @param selector {HTMLElement} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates
     * @param loc {Localisation} Localisation instance
     * @param config {T} Configuration config
     */
    protected constructor(selector: HTMLElement,
                          apiKey: string,
                          templates: ITemplates,
                          loc: Localisation,
                          config: T) {
        this.$root = $(selector);
        this.apiKey = apiKey;
        this.templates = templates;
        this.loc = loc;
        this.config = config;
    }

}
