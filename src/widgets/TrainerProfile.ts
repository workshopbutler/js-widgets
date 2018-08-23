import transport from '../common/Transport';
import getTemplate from "./helpers/_templates";
import WidgetFactory from "../Factory";
import {getQueryParam} from "../common/helpers/_urlParser";
import {ITemplates} from "../interfaces/ITemplates";
import Trainer from "../models/Trainer";
import {logError} from "../common/Error";
import {renderString as nunjucksRenderString} from "nunjucks"
import Widget from "./Widget";
import Localisation from "../utils/Localisation";
import Formatter from "../view/Formatter";
import TrainerProfileConfig from "./config/TrainerProfileConfig";

/**
 * Logic for the trainer details
 */
export default class TrainerProfile extends Widget<TrainerProfileConfig> {
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
        let id = getQueryParam('id');
        this.init();
        if (id) {
            this.loadContent(parseInt(id));
        } else {
            logError("`id` query parameter is not found")
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
            (data: any) => {
                self.trainer = new Trainer(data.response, self.config);
                self.render();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private render() {
        const self = this;
        $.when(getTemplate(self.config)).done(
            function (template) {
                const data = {
                    trainer: self.trainer,
                    options: self.config,
                    _t: function(key: string, options: any = null) {
                        return self.loc.translate(key, options);
                    },
                    _f: function(object: any, type: string | null) {
                        return self.formatter.format(object, type);
                    }
                };
                const content = template ?
                    nunjucksRenderString(template, data) :
                    self.templates.trainerProfile.render(data);

                self.$root.html(content);
                self.updateHTML();
                if (self.config.widgets) {
                    WidgetFactory.launch({apiKey: self.apiKey}, self.config.widgets);
                }
            });
    }

    /**
     * Updates key elements of the page
     */
    protected updateHTML() {
        this.updateTitle();
    }

    /**
     * Changes the title of the page
     */
    protected updateTitle() {
        document.title = this.trainer.fullName();
    }

    private getUrl(trainerId: number) {
        return `facilitators/${trainerId}?api_key=${this.apiKey}`;
    }

    /**
     * @param selector {string} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates
     * @param loc {Localisation} Localisation instance
     * @param options {object} Configuration config
     */
    static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
        const $elems = $(selector);
        if (!$elems.length) return;

        const config = TrainerProfileConfig.create(options);
        if (!config) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.trainer.details');

            if (!data) {
                data = new TrainerProfile(el, apiKey, templates, loc, config);
                $element.data('wsb.widget.trainer.details', data);
            }
        });
    }
}
