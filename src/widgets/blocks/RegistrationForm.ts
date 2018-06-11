import transport from "../../common/Transport";
import {logError} from "../../common/Error";
import FormHelper from "../helpers/_form";

/**
 * Logic for the registration form page
 */
export default class RegistrationForm {
    protected readonly $root: JQuery;
    protected readonly apiKey: string;
    protected event: any;
    protected formHelper: FormHelper;

    /**
     * Creates a new list
     * @param selector {string} JQuery selector
     * @param apiKey {string}
     */
    constructor(selector: HTMLElement, apiKey: string) {
        this.$root = $(selector);
        this.apiKey = apiKey;
        this.event = null;
    }

    protected assignEvents() {
        if (this.event.registration.isOpen()) {
            this.$root.on('click', '[data-widget-submit]', this.onFormSubmittion.bind(this));
        }
    }

    /**
     * Process the click on 'Registration' button
     * @param e {Event}
     * @private
     */
    protected onFormSubmittion(e: Event) {
        e.preventDefault();
        if (this.event.registration.isClosed()) {
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
