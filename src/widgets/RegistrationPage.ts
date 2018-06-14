import FormHelper from "./helpers/_form";
import transport from "../common/Transport";
import {formatPrice} from "../common/Price";
import {getCombinedTicketTypeDescription, getTicketTypeState} from "../common/Ticket";
import {formatDate} from "../common/Date";
import {countries} from "../common/helpers/_countries";
import Event from "../models/Event";
import getTemplate from "./helpers/_templates";
import {ITemplates} from "../templates/ITemplates";
import {renderString as nunjucksRenderString} from "nunjucks"
import RegistrationForm from "./blocks/RegistrationForm";

/**
 * Logic for the registration form page
 */
export default class RegistrationPage extends RegistrationForm {
    private readonly templates: ITemplates;
    private ticketId: string;
    private readonly options: any;

    /**
     * Creates a new list
     * @param selector {string} JQuery selector
     * @param apiKey {string}
     * @param templates {Templates} Templates for widgets
     * @param options {object} Configuration options
     */
    constructor(selector: HTMLElement, apiKey: string, templates: ITemplates, options: any) {
        super(selector, apiKey);
        this.templates = templates;
        this.event = null;
        this.ticketId = '';
        let id: string = '';

        const self = this;

        window.location.search.substr(1).split('&').forEach(function(el) {
            let param = el.split('=', 2);
            if (param.length === 2 && param[0] === 'id') {
                id = param[1];
            } else if (param.length === 2 && param[0] === 'ticket') {
                self.ticketId = param[1];
            }
        });
        if (this.checkOptions(options)) {
            this.options = options;
            this.init();
            this.loadContent(id);
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
     * Loads the event and renders the page
     * @param eventId {string}
     * @private
     */
    private loadContent(eventId: string) {
        const self = this;
        const url = this.getUrl(eventId);

        transport.get(url, {},
            (data: any) => {
                self.event = new Event(data.response, self.options);
                self.renderRegistrationForm();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private renderRegistrationForm() {
        const self = this;

        $.when(getTemplate(self.options)).done(
            function (template) {
                const data = {
                    event: self.event,
                    options: self.options,
                    ticket: self.ticketId,
                    countries: countries,
                    formatPrice: formatPrice,
                    formatTicket: getCombinedTicketTypeDescription,
                    formatTicketState: getTicketTypeState,
                    formatDate: formatDate
                };
                const content = template ?
                    nunjucksRenderString(template, data) :
                    self.templates.registrationPage.render(data);

                self.$root.html(content);
                self.assignEvents();

                self.formHelper = new FormHelper({
                    $controls: self.$root.find('[data-control]')
                });
            });
    }

    private getUrl(eventId: string) {
        return `events/${eventId}?api_key=${this.apiKey}`;
    }

    /**
     * @param selector {string} JQuery selector
     * @param apiKey {string} API key
     * @param templates {Templates} Templates for widgets
     * @param options {object} Configuration options
     */
    static plugin(selector: string, apiKey: string, templates: ITemplates, options: any) {
        const $elems = $(selector);
        if (!$elems.length) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.registration.form');

            if (!data) {
                data = new RegistrationPage(el, apiKey, templates, options);
                $element.data('wsb.widget.registration.form', data);
            }
        });
    }
}
