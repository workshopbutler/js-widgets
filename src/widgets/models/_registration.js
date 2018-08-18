/**
 * Contains the logic for the event registration
 */
export default class Registration {

    constructor(attrs, registrationUrl = null) {
        this.attrs = attrs;
        this.url = registrationUrl;
    }

    /**
     * Returns true if it's an event promotion and an external registration form should be used
     * @return {*}
     */
    isExternalRegistrationForm() {
        const externalRegistration = this.attrs.registration_page;
        return externalRegistration && externalRegistration.custom;
    }

    /**
     * Returns the url to the registration page. If the url is null, then
     *  an on-the-page registration form is used
     *
     * @param ticketId {string|null}
     * @return {string|null}
     */
    getUrl(ticketId) {
        const externalRegistration = this.attrs.registration_page;
        const withExternalRegistration = externalRegistration && externalRegistration.custom;
        if (withExternalRegistration) {
            return externalRegistration.url;
        } else if (this.url) {
            let url = this.url + `?id=${this.attrs.hashed_id}`;
            if (ticketId) {
                url += `&ticket=${ticketId}`;
            }
            return url;
        } else {
            return null;
        }
    }

}
