import {countries} from '../common/helpers/_countries';
import transport from '../common/Transport';
import Event from '../models/Event';
import {formatPrice} from "../common/Price";
import {formatTicketDescription, getCombinedTicketTypeDescription, getTicketTypeState} from "../common/Ticket";
import {formatDate} from "../common/Date";
import {logError} from "../common/Error";
import getTemplate from "./helpers/_templates";
import {getQueryParam} from "../common/helpers/_urlParser";
import WidgetFactory from "./Factory";
import {formatLanguages} from "../common/Language";
import {ITemplates} from "../templates/ITemplates";
import RegistrationForm from "./blocks/RegistrationForm";
import {renderString as nunjucksRenderString} from "nunjucks"
import FormHelper from "./helpers/_form";

/**
 * Logic for the event details
 */
export default class EventPage extends RegistrationForm {
    private readonly templates: ITemplates;
    private readonly options: any;

    /**
     * Creates a new list
     * @param selector {string} JQuery selector
     * @param apiKey {string}
     * @param templates {Templates} Templates
     * @param options {object} Configuration options
     */
    constructor(selector: HTMLElement, apiKey: string, templates: ITemplates, options: any) {
        super(selector, apiKey);
        this.event = null;
        this.templates = templates;
        if (this.checkOptions(options)) {
            this.options = options;
            this.init();
            let id = getQueryParam('id');
            if (id) {
                this.loadContent(id);
            } else {
                logError("`id` query parameter is not found")
            }
        }
    }

    private checkOptions(options: any) {
        let good = true;
        if (options.withTrainers && (!options.trainerPageUrl || typeof options.trainerPageUrl !== 'string')) {
            console.log('Attribute [trainerPageUrl] is not set correctly');
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
     * Loads the event and renders the page
     * @param eventId {number}
     */
    private loadContent(eventId: string) {
        const self = this;
        const url = this.getUrl(eventId);

        transport.get(url, {},
            (data: any) => {
                self.event = new Event(data.response, self.options);
                self.renderWidget();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private renderWidget() {
        const self = this;
        $.when(getTemplate(self.options)).done(
            function (template) {
                const data = {
                    event: self.event,
                    options: self.options,
                    countries: countries,
                    formatPrice: formatPrice,
                    formatTicket: getCombinedTicketTypeDescription,
                    formatTicketState: getTicketTypeState,
                    formatDate: formatDate,
                    formatTicketDescription: formatTicketDescription,
                    formatLanguages: formatLanguages
                };
                const content = template ?
                    nunjucksRenderString(template, data) :
                    self.templates.eventPage.render(data);

                self.$root.html(content);
                if (self.options.widgets) {
                    WidgetFactory.launch(self.apiKey, self.options.widgets);
                }
                self._assignEvents();
                self.formHelper = new FormHelper({
                    $controls: self.$root.find('[data-control]')
                });
            });
    }

    _assignEvents() {
        if (this.event.registration.isOpen()) {
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
        if (this.event.registration.isClosed()) {
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
     * @param options {object} Configuration options
     */
    static plugin(selector: string, apiKey: string, templates: ITemplates, options: any) {
        const $elems = $(selector);
        if (!$elems.length) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.event.details');

            if (!data) {
                data = new EventPage(el, apiKey, templates, options);
                $element.data('wsb.widget.event.details', data);
            }
        });
    }
}
