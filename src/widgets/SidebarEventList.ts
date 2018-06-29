import transport from '../common/Transport';
import getTemplate from "./helpers/_templates";
import {ITemplates} from "../templates/ITemplates";
import Event from "../models/Event";
import {renderString as nunjucksRenderString} from "nunjucks"

/**
 * Logic for the sidebar list of events
 */
export default class SidebarEventList {
    private readonly $root: JQuery;
    private readonly $list: JQuery;
    private readonly apiKey: string;
    private readonly templates: ITemplates;
    private events: Event[];
    private readonly options: any;

    /**
     * Creates a new list
     * @param selector {string} JQuery selector
     * @param apiKey {string} API key
     * @param templates {Templates} Templates for widgets
     * @param options {object} Configuration options
     */
    constructor(selector: HTMLElement, apiKey: string, templates: ITemplates, options: any) {
        this.$root = $(selector);
        this.$list = this.$root.find('[data-events-list]');
        this.apiKey = apiKey;
        this.templates = templates;
        this.events = [];
        if (this.checkOptions(options)) {
            this.options = options;
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
        return good;
    }

    private init() {
        if (this.options.theme) {
            this.$root.addClass(this.options.theme);
        }
    }

    /**
     * Loads events and renders the table
     */
    private loadContent() {
        const self = this;

        $.when(this.getVisitorCountry()).done((country) => {
            const url = this.getUrl(country);
            transport.get(url, {},
                (data: any) => {
                    const events =  data.response.filter((event: any) => event.hashed_id !== self.options.excludeId);
                    const length = self.options.length ? self.options.length : 3;
                    self.events = events.slice(0, length).map(function (event: any) {
                        return new Event(event, self.options);
                    });
                    self.renderUpcomingEventList();
                },
                (data: any) => {
                    console.log(data);
                });
        });
    }

    /**
     * Sends a request to detect the country of the visitor if needed
     * @private
     */
    private getVisitorCountry() {
        let defer = $.Deferred();

        const self = this;
        if (this.options.country && this.options.country === 'detect') {
            transport.get(`/utils/country?api_key=${self.apiKey}`, {},
                (data: any) => {
                    defer.resolve(data.response.country);
                },
                () => {
                    defer.resolve(null);
                });
        } else {
            defer.resolve(this.options.country);
        }
        return defer.promise();
    }

    private renderUpcomingEventList() {
        const self = this;
        $.when(getTemplate(self.options)).done(function (template) {
            function renderTemplate(event: Event) {
                return nunjucksRenderString(template, { event: event })
            }

            const data = {
                events: self.events,
                template: renderTemplate
            };
            if (data.events.length) {
                const content = self.templates.sidebar.render(data);
                self.$list.html(content);
                if (self.options.hideIfEmpty) {
                    self.$root.show();
                }
            } else {
                if (self.options.hideIfEmpty) {
                    self.$root.hide();
                } else {
                    self.$list.html('No events');
                }
            }
        });
    }

    /**
     * Makes a request string
     * @param country {string|null}
     * @return {string}
     * @private
     */
    private getUrl(country: string) {
        let fields =  'title,location,hashed_id,schedule,free,spoken_languages';
        if (this.options.fields) {
            fields += ',' + this.options.fields.join(',');
        }
        let future = this.options.future !== false;
        let url = `events?api_key=${this.apiKey}&future=${future}&public=true&fields=${fields}`;
        if (country) {
            url += `&countryCode=${country}`;
        }
        if (this.options.eventType) {
            url += `&eventType=${this.options.eventType}`;
        }
        if (this.options.trainer) {
            url += `&trainerId=${this.options.trainer}`;
        }
        return url;
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
            let data = $element.data('wsb.widget.sidebar.event.list');

            if (!data) {
                data = new SidebarEventList(el, apiKey, templates, options);
                $element.data('wsb.widget.sidebar.event.list', data);
            }
        });
    }
}
