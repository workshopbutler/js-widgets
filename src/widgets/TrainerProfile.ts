import {getCountryName} from '../common/helpers/_countries';
import transport from '../common/Transport';
import getTemplate from "./helpers/_templates";
import WidgetFactory from "./Factory";
import {getQueryParam} from "../common/helpers/_urlParser";
import {ITemplates} from "../templates/ITemplates";
import Trainer from "../models/Trainer";
import {logError} from "../common/Error";
import {renderString as nunjucksRenderString} from "nunjucks"

/**
 * Logic for the trainer details
 */
export default class TrainerProfile {
    private readonly $root: JQuery;
    private readonly apiKey: string;
    private readonly templates: ITemplates;
    private readonly options: any;
    private trainer: Trainer;

    /**
     * Creates a new trainer page
     * @param selector {string} JQuery selector
     * @param apiKey {string}
     * @param templates {Templates} Templates for widgets
     * @param options {object} Configuration options
     */
    constructor(selector: HTMLElement, apiKey: string, templates: ITemplates, options: any) {
        this.$root = $(selector);
        this.apiKey = apiKey;
        this.templates = templates;
        let id = getQueryParam('id');
        if (this.checkOptions(options)) {
            this.options = options;
            this.init();
            if (id) {
                this.loadContent(parseInt(id));
            } else {
                logError("`id` query parameter is not found")
            }
        }
    }

    private checkOptions(options: any) {
        return true;
    }

    private init() {
        if (this.options.theme) {
            this.$root.addClass(this.options.theme);
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
                self.trainer = new Trainer(data.response, self.options);
                self.render();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private render() {
        const self = this;
        $.when(getTemplate(self.options)).done(
            function (template) {
                const data = {
                    trainer: self.trainer,
                    options: self.options,
                    getCountryName: getCountryName
                };
                const content = template ?
                    nunjucksRenderString(template, data) :
                    self.templates.trainerPage.render(data);

                self.$root.html(content);
                if (self.options.widgets) {
                    WidgetFactory.launch(self.apiKey, self.options.widgets);
                }
            });
    }

    private getUrl(trainerId: number) {
        return `facilitators/${trainerId}?api_key=${this.apiKey}`;
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
            let data = $element.data('wsb.widget.trainer.details');

            if (!data) {
                data = new TrainerProfile(el, apiKey, templates, options);
                $element.data('wsb.widget.trainer.details', data);
            }
        });
    }
}
