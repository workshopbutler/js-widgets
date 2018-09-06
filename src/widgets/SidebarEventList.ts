import transport from '../common/Transport';
import getTemplate from "./helpers/_templates";
import {ITemplates} from "../interfaces/ITemplates";
import Event from "../models/Event";
import {renderString as nunjucksRenderString} from "nunjucks"
import Widget from "./Widget";
import Localisation from "../utils/Localisation";
import Formatter from "../view/Formatter";
import SidebarEventListConfig from "./config/SidebarEventListConfig";
import PlainObject = JQuery.PlainObject;

/**
 * Logic for the sidebar list of events
 */
export default class SidebarEventList extends Widget<SidebarEventListConfig> {
    private readonly $list: JQuery;
    protected readonly formatter: Formatter;
    private events: Event[];

    /**
     * Creates a new list
     * @param selector {string} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates for widgets
     * @param loc {Localisation} Localisation instance
     * @param config {SidebarEventListConfig} Configuration config
     */
    protected constructor(selector: HTMLElement,
                          apiKey: string,
                          templates: ITemplates,
                          loc: Localisation,
                          config: SidebarEventListConfig) {
        super(selector, apiKey, templates, loc, config);
        this.formatter = new Formatter(loc);

        this.$list = this.$root.find('[data-events-list]');
        this.events = [];
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
     */
    private loadContent() {
        const self = this;

        $.when(this.getVisitorCountry()).done((country) => {
            const url = this.getUrl(country);
            transport.get(url, {},
                (data: PlainObject[]) => {
                    const events =  data.filter((event: PlainObject) => event.hashed_id !== self.config.excludeId);
                    const length = self.config.length ? self.config.length : 3;
                    self.events = events.slice(0, length).map(function (event: any) {
                        return new Event(event, self.config);
                    });
                    self.renderUpcomingEventList();
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
        if (this.config.country && this.config.country === 'detect') {
            transport.get(`/utils/country?api_key=${self.apiKey}`, {},
                (data: any) => {
                    defer.resolve(data.response.country);
                },
                () => {
                    defer.resolve(null);
                });
        } else {
            defer.resolve(this.config.country);
        }
        return defer.promise();
    }

    private renderUpcomingEventList() {
        const self = this;
        $.when(getTemplate(self.config)).done(function (template) {
            function renderTemplate(event: Event) {
                return nunjucksRenderString(template, { event: event })
            }

            const data = {
                events: self.events,
                template: renderTemplate,
                _t: function(key: string, options: any = null) {
                    return self.loc.translate(key, options);
                },
                _f: function(object: any, type: string | null) {
                    return self.formatter.format(object, type);
                }
            };
            if (data.events.length) {
                const content = self.templates.sidebarEventList.render(data);
                self.$list.html(content);
                if (self.config.hideIfEmpty) {
                    self.$root.show();
                }
            } else {
                if (self.config.hideIfEmpty) {
                    self.$root.hide();
                } else {
                    self.$list.html(self.loc.translate('sidebar.noEvents'));
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
        if (this.config.fields) {
            fields += ',' + this.config.fields.join(',');
        }
        let future = this.config.future;
        let url = `events?api_key=${this.apiKey}&future=${future}&public=true&fields=${fields}`;
        if (country) {
            url += `&countryCode=${country}`;
        }
        if (this.config.eventType) {
            url += `&eventType=${this.config.eventType}`;
        }
        if (this.config.trainerId) {
            url += `&trainerId=${this.config.trainerId}`;
        }
        return url;
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

        const config = SidebarEventListConfig.create(options);
        if (!config) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.sidebar.event.list');

            if (!data) {
                data = new SidebarEventList(el, apiKey, templates, loc, config);
                $element.data('wsb.widget.sidebar.event.list', data);
            }
        });
    }
}
