import transport from '../common/Transport';
import getTemplate from "./helpers/_templates";
import {ITemplates} from "../interfaces/ITemplates";
import Filters, {default as TrainerListFilters} from './blocks/TrainerListFilters';
import Trainer from "../models/Trainer";
import {renderString as nunjucksRenderString} from "nunjucks"
import Widget from "./Widget";
import Localisation from "../utils/Localisation";
import Formatter from "../view/Formatter";
import TrainerListConfig from "./config/TrainerListConfig";

/**
 * Logic for the list of trainers
 */
export default class TrainerList extends Widget<TrainerListConfig> {
    private trainers: Trainer[] = [];
    private readonly filters: TrainerListFilters;
    protected readonly formatter: Formatter;

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
            (data: any) => {
                self.trainers = (data.response as any[]).map(function(trainer: any) {
                    return new Trainer(trainer, self.config);
                });
                self.render();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private render() {
        const self = this;
        $.when(getTemplate(self.config)).done(function (template) {
            function renderTemplate(trainer: Trainer) {
                return nunjucksRenderString(template, { trainer: trainer })
            }

            const data = {
                trainers: self.trainers,
                filters: self.filters.getFilters(self.trainers),
                template: template ? renderTemplate : null,
                _t: function(key: string, options: any = null) {
                    return self.loc.translate(key, options);
                },
                _f: function(object: any, type: string | null) {
                    return self.formatter.format(object, type);
                }
            };
            const content = self.templates.trainerList.render(data);
            self.$root.html(content);
        });
    }

    private getUrl(): string {
        return `facilitators?api_key=${this.apiKey}`;
    }

    /**
     * @param selector {string} JQuery selector
     * @param apiKey {string} API key
     * @param templates {Templates} Templates
     * @param loc {Localisation} Localisation instance
     * @param options {object} Configuration config
     */
    static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
        const $elems = $(selector);
        if (!$elems.length) return;

        const config = TrainerListConfig.create(options);
        if (!config) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.trainer.list');

            if (!data) {
                data = new TrainerList(el, apiKey, templates, loc, config);
                $element.data('wsb.widget.trainer.list', data);
            }
        });
    }
}
