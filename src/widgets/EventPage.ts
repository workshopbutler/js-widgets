import transport from '../common/Transport';
import Event from '../models/Event';
import {logError} from "../common/Error";
import getTemplate from "./helpers/_templates";
import {getQueryParam} from "../common/helpers/_urlParser";
import WidgetFactory from "../Factory";
import {ITemplates} from "../interfaces/ITemplates";
import RegistrationForm from "./blocks/RegistrationForm";
import {renderString as nunjucksRenderString} from "nunjucks"
import FormHelper from "./helpers/_form";
import {DateTime} from "luxon";
import Localisation from "../utils/Localisation";
import Formatter from "../view/Formatter";
import EventPageConfig from "./config/EventPageConfig";

/**
 * Logic for the event details
 */
export default class EventPage extends RegistrationForm<EventPageConfig> {
    protected readonly formatter: Formatter;

    /**
     * Creates a new event page
     * @param selector {HTMLElement} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates
     * @param loc {Localisation} Localisation instance
     * @param config {EventPageConfig} Configuration config
     */
    protected constructor(selector: HTMLElement,
                          apiKey: string,
                          templates: ITemplates,
                          loc: Localisation,
                          config: EventPageConfig) {
        super(selector, apiKey, templates, loc, config);
        this.formatter = new Formatter(loc);
        this.init();
        let id = getQueryParam('id');
        if (id) {
            this.loadContent(id);
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
     * Loads the event and renders the page
     * @param eventId {number}
     */
    private loadContent(eventId: string) {
        const self = this;
        const url = this.getUrl(eventId);

        transport.get(url, {},
            (data: any) => {
                self.event = new Event(data.response, self.config);
                self.renderWidget();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private renderWidget() {
        const self = this;
        $.when(getTemplate(self.config)).done(
            function (template) {
                const data = {
                    event: self.event,
                    config: self.config,
                    countries: self.getCountries(),
                    DateTime: DateTime,
                    _t: function(key: string, options: any = null) {
                        return self.loc.translate(key, options);
                    },
                    _f: function(object: any, type: string | null) {
                        return self.formatter.format(object, type);
                    }
                };
                const content = template ?
                    nunjucksRenderString(template, data) :
                    self.templates.eventPage.render(data);

                self.$root.html(content);
                self.updateHTML();
                if (self.config.widgets) {
                    WidgetFactory.launch({apiKey: self.apiKey}, self.config.widgets);
                }
                self._assignEvents();
                self.formHelper = new FormHelper({
                    $controls: self.$root.find('[data-control]')
                }, self.getErrorMessages());
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
        document.title = this.event.title;
    }

    _assignEvents() {
        if (this.event.state.open()) {
            this.$root.on('click', '[data-registration-button]', this.onRegistration.bind(this));
        }
        super.assignEvents();
    }

    /**
     * Process the click on 'Registration' button
     * @param e {Event}
     * @private
     */
    private onRegistration(e: JQuery.Event) {
        e.preventDefault();
        if (this.event.state.closed()) {
            logError("EventPage widget configured incorrectly. Registration button shouldn't be active when the registration is closed");
        } else {
            const btn = $(e.currentTarget);
            const ticketId = $(btn).data('ticket-id');
            const url = this.event.registration.getUrl(ticketId);
            if (url) {
                const newTab = window.open(url, '_blank');
                if (newTab) {
                    newTab.focus()
                }
            } else {
                $('[data-registration-block]').show();
                $('[data-post-registration-message]').hide();
                const offset = this.$root.find('[data-registration-block]').offset();
                $('html, body').animate({
                    scrollTop: offset && offset.top,
                }, 400);
            }
        }
    }

    private getUrl(eventId: string) {
        return `events/${eventId}?api_key=${this.apiKey}&fields=trainer.rating`;
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

        const config = EventPageConfig.create(options);
        if (!config) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.event.details');

            if (!data) {
                data = new EventPage(el, apiKey, templates, loc, config);
                $element.data('wsb.widget.event.details', data);
            }
        });
    }
}
