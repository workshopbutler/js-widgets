import transport from '../common/Transport';
import getTemplate from "./helpers/_templates";
import Event from "../models/Event";
import Filters from './blocks/EventListFilters';
import {ITemplates} from "../templates/ITemplates";
import {renderString as nunjucksRenderString} from "nunjucks"

/**
 * Logic for the list of events
 */
export default class Schedule {
    private readonly $root: JQuery;
    private readonly apiKey: string;
    private readonly templates: ITemplates;
    private readonly options: any;
    private readonly filters: Filters;
    private events: Event[];

    /**
     * Creates a new list
     * @param selector {HTMLElement} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates
     * @param options {object} Configuration options
     */
    constructor(selector: HTMLElement, apiKey: string, templates: ITemplates, options: any) {
        this.$root = $(selector);
        this.apiKey = apiKey;
        this.templates = templates;
        this.events = [];
        if (this.checkOptions(options)) {
            this.options = options;
            this.filters = new Filters(selector, options.filters);
            this.init();
            this.loadContent();
        }
    }

    private checkOptions(options: any) {
        let good = true;
        if (!options.eventPageUrl || typeof options.eventPageUrl !== 'string') {
            console.log('Attribute [eventPageUrl] is not set correctly');
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
                self.events = data.response.map(function (event: any) {
                    return new Event(event, self.options);
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
            function renderTemplate(event: Event) {
                return nunjucksRenderString(template, { event: event })
            }

            const data = {
                events: self.events,
                filters: self.filters.getFilters(self.events),
                template: template ? renderTemplate : null
            };
            const content = self.templates.eventList.render(data);
            self.$root.html(content);
        });
    }

    private getUrl() {
        let fields = 'title,schedule,location,hashed_id,free,type,registration_page,spoken_languages,sold_out,facilitators,free_ticket_type,paid_ticket_types';
        if (this.options.fields) {
            fields += ',' + this.options.fields.join(',');
        }
        return `events?api_key=${this.apiKey}&future=true&public=true&fields=${fields}`;
    }

    /**
     * @param selector {string} JQuery selector
     * @param apiKey {string} API key
     * @param templates {Templates} Templates
     * @param options {object} Configuration options
     */
    static plugin(selector: string, apiKey: string, templates: ITemplates, options: any) {
        const $elems = $(selector);
        if (!$elems.length) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.event.list');

            if (!data) {
                data = new Schedule(el, apiKey, templates, options);
                $element.data('wsb.widget.event.list', data);
            }
        });
    }
}
