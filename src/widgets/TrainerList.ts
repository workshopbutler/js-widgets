import transport from '../common/Transport';
import getTemplate from "./helpers/_templates";
import {ITemplates} from "../templates/ITemplates";
import Filters, {default as TrainerListFilters} from './blocks/TrainerListFilters';
import Trainer from "../models/Trainer";
import {renderString as nunjucksRenderString} from "nunjucks"

/**
 * Logic for the list of trainers
 */
export default class TrainerList {
    private readonly $root: JQuery;
    private readonly apiKey: string;
    private readonly templates: ITemplates;
    private readonly options: any;
    private trainers: Trainer[];
    private readonly filters: TrainerListFilters;

    /**
     * Creates a new list
     * @param selector {HTMLElement} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates for widgets
     * @param options {object} Configuration options
     */
    constructor(selector: HTMLElement, apiKey: string, templates: ITemplates, options: any) {
        this.$root = $(selector);
        this.apiKey = apiKey;
        this.templates = templates;
        this.trainers = [];
        if (this.checkOptions(options)) {
            this.options = options;
            this.filters = new Filters(selector, options.filters);
            this.init();
            this.loadContent();
        }
    }

    checkOptions(options: any) {
        let good = true;
        if (!options.trainerPageUrl || typeof options.trainerPageUrl !== 'string') {
            console.log('Attribute [trainerPageUrl] is not set correctly');
            good = false;
        }
        if (!options.filters || typeof options.filters !== 'object') {
            console.log('Attribute [filters] is not set correctly');
            good = false;
        }
        return good;
    }

    private init() {
        if (this.options.theme) {
            this.$root.addClass(this.options.theme);
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
                    return new Trainer(trainer, self.options);
                });
                self.render();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private render() {
        const self = this;
        $.when(getTemplate(self.options)).done(function (template) {
            function renderTemplate(trainer: Trainer) {
                return nunjucksRenderString(template, { trainer: trainer })
            }

            const data = {
                trainers: self.trainers,
                filters: self.filters.getFilters(self.trainers),
                template: template ? renderTemplate : null,
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
     * @param templates {ITemplates} Templates for widgets
     * @param options {object} Configuration options
     */
    static plugin(selector: string, apiKey: string, templates: ITemplates, options: any) {
        const $elems = $(selector);
        if (!$elems.length) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.trainer.list');

            if (!data) {
                data = new TrainerList(el, apiKey, templates, options);
                $element.data('wsb.widget.trainer.list', data);
            }
        });
    }
}
