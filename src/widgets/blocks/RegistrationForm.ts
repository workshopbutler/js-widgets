import transport from "../../common/Transport";
import {logError} from "../../common/Error";
import FormHelper from "../helpers/_form";
import Widget from "../Widget";
import {ITemplates} from "../../interfaces/ITemplates";
import Localisation from "../../utils/Localisation";
import Event from "../../models/Event";
import JQueryEvent = JQuery.Event;
import WidgetConfig from "../config/WidgetConfig";

/**
 * Logic for the registrationPage form page
 */
export default abstract class RegistrationForm<T extends WidgetConfig> extends Widget<T> {
    protected event: Event;
    protected formHelper: FormHelper;

    /**
     * Creates a new registration form
     * @param selector {HTMLElement} JQuery selector
     * @param apiKey {string} API key
     * @param templates {ITemplates} Templates
     * @param loc {Localisation} Localisation instance
     * @param config {T} Configuration config
     */
    protected constructor(selector: HTMLElement,
                          apiKey: string,
                          templates: ITemplates,
                          loc: Localisation,
                          config: T) {
        super(selector, apiKey, templates, loc, config);
    }

    protected assignEvents() {
        if (this.event.state.open()) {
            this.$root.on('click', '[data-widget-submit]', this.onFormSubmittion.bind(this));
        }
    }

    /**
     * Process the click on 'Registration' button
     * @param e {Event}
     * @private
     */
    protected onFormSubmittion(e: JQueryEvent) {
        e.preventDefault();
        if (this.event.state.closed()) {
            logError("Widget configured incorrectly. Registration button shouldn't be active when the registration is closed");
        } else {
            if (!this.formHelper.isValidFormData()) return;

            let self = this;
            let formData = this.prepareFormData(this.formHelper.getFormData());

            const url = `attendees/register?api_key=${this.apiKey}`;

            self.$root.addClass('h-busy');
            $(e.target as HTMLElement).prop('disabled', true).addClass('h-busy');

            transport.post(url, formData,
                (data: any) => {
                    self.formHelper.clearForm();
                    self.$root.find('[data-registration-form]').hide();
                    self.$root.find('[data-post-registration-message]').show();
                    self.$root.removeClass('h-busy');
                    $(e.target as HTMLElement).removeProp('disabled').removeClass('h-busy');
                });
        }
    }

    /**
     * Contains localised form errors
     */
    protected getErrorMessages(): any {
        return {
            required: this.loc.translate('form.error.required'),
            email: this.loc.translate('form.error.email'),
            url: this.loc.translate('form.error.url'),
            date: this.loc.translate('form.error.date'),
            nospace: this.loc.translate('form.error.number'),
            digits: this.loc.translate('form.error.digits'),
        }
    }

    protected getCountries(): Array<[string, string]> {
        const codes = ["AF","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU",
            "AT","AZ","AX","BS","BH","BD","BB","BY","BZ","BE","BJ","BM","BT","BA","BW","BN","BO",
            "BQ","BV","BR","BG","BF","BI","CV","CM","CA","CF","TD","CL","CN","CX","CC","CD","CG","CK",
            "CI","CO","CR","HR","CU","CW","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","ER","GQ","EE",
            "ET","FK","FO","FJ","FI","FR","GF","PF","GA","GM","KH","KY","GE","DE","GH","GI","KM","GR",
            "GL","GD","GP","GG","GN","GU","GT","GW","GY","HT","HK","HN","HU","IS","IN","ID","IR","IQ",
            "IE","IL","IM","IT","JM","JP","JE","JO","KZ","KE","KI","KG","KP","KR","KW","LA","LV","LB",
            "LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU",
            "YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI",
            "NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT",
            "PR","QA","RE","RO","RU","RW","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN",
            "RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","SS","ES","LK","SD","SR","SJ","SZ","SE",
            "CH","SY","TJ","TW","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA",
            "AE","GB","US","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW"];
        const countries = codes.map((code) =>
            <[string, string]>[code, this.loc.translate('country.' + code)]
        );
        return countries.sort((a, b) => a[1].localeCompare(b[1]));
    }

    /**
     * Returns a correctly formed data to be processed by Workshop Butler API
     * @param data {object}
     * @return {*}
     */
    private prepareFormData(data: any): any {
        data.event_id = Number(this.event.id);
        for (let item in data) {
            if (!data[item]) delete data[item];
        }
        return data;
    }
}
