import FormHelper from "./helpers/_form";
import transport from "../common/Transport";
import Event from "../models/Event";
import getTemplate from "./helpers/_templates";
import {ITemplates} from "../interfaces/ITemplates";
import {renderString as nunjucksRenderString} from "nunjucks"
import RegistrationForm from "./blocks/RegistrationForm";
import Localisation from "../utils/Localisation";
import Formatter from "../view/Formatter";
import RegistrationPageConfig from "./config/RegistrationPageConfig";

/**
 * Logic for the registration form page
 */
export default class RegistrationPage extends RegistrationForm<RegistrationPageConfig> {
    private ticketId: string;
    protected readonly formatter: Formatter;

    /**
     * Creates a new registration page
     * @param selector {HTMLElement} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates
     * @param loc {Localisation} Localisation instance
     * @param config {RegistrationPageConfig} Configuration config
     */
    protected constructor(selector: HTMLElement,
                          apiKey: string,
                          templates: ITemplates,
                          loc: Localisation,
                          config: RegistrationPageConfig) {
        super(selector, apiKey, templates, loc, config);
        this.formatter = new Formatter(loc);
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
        this.init();
        this.loadContent(id);
    }

    private init() {
        if (this.config.theme) {
            this.$root.addClass(this.config.theme);
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
                self.event = new Event(data.response, self.config);
                self.renderRegistrationForm();
            },
            (data: any) => {
                console.log(data);
            });
    }

    private renderRegistrationForm() {
        const self = this;

        $.when(getTemplate(self.config)).done(
            function (template) {
                const data = {
                    event: self.event,
                    config: self.config,
                    ticket: self.ticketId,
                    countries: self.getCountries(),
                    _t: function(key: string, options: any = null) {
                        return self.loc.translate(key, options);
                    },
                    _f: function(object: any, type: string | null) {
                        return self.formatter.format(object, type);
                    }
                };
                const content = template ?
                    nunjucksRenderString(template, data) :
                    self.templates.registrationPage.render(data);

                self.$root.html(content);
                self.assignEvents();

                self.formHelper = new FormHelper({
                    $controls: self.$root.find('[data-control]')
                }, self.getErrorMessages());
            });
    }

    private getUrl(eventId: string) {
        return `events/${eventId}?api_key=${this.apiKey}&fields=trainer.rating`;
    }

    /**
     * @param selector {string} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates for widgets
     * @param loc {Localisation} Localisation instance
     * @param options {object} Configuration config
     */
    static plugin(selector: string, apiKey: string, templates: ITemplates, loc: Localisation, options: any) {
        const $elems = $(selector);
        if (!$elems.length) return;

        const config = RegistrationPageConfig.create(options);
        if (!config) return;

        return $elems.each((index, el) => {
            let $element = $(el);
            let data = $element.data('wsb.widget.registration.form');

            if (!data) {
                data = new RegistrationPage(el, apiKey, templates, loc, config);
                $element.data('wsb.widget.registration.form', data);
            }
        });
    }
}
