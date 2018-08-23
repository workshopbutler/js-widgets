/**
 * Contains the logic for the event registration
 */
export default class RegistrationPage {
    readonly external: boolean;
    readonly url?: string;

    constructor(attrs: any, registrationUrl: string | null = null, eventId: string) {
        if (attrs) {
            this.external = attrs.custom;
            this.url = attrs.url;
        }
        if (!this.external && registrationUrl) {
            this.url = RegistrationPage.getInternalUrl(registrationUrl, eventId);
        }
    }

    /**
     * Returns a correctly formed url for a registration page of the event
     * @param registrationPageUrl {string} Url of the page with RegistrationPage widget
     * @param eventId {string} Hashed event id
     */
    protected static getInternalUrl(registrationPageUrl: string, eventId: string): string {
        return registrationPageUrl + `?id=${eventId}`;
    }

}
