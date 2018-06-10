/**
 * Contains the logic for the event registration
 */
export default class Registration {

    constructor(attrs, registrationUrl = null) {
        this.attrs = attrs;
        this.url = registrationUrl;
    }

    /**
     * Returns true if the registration for the event is closed
     * @return {boolean}
     */
    isClosed() {
        if (this._isEventEnded()) {
            return true;
        } else if (this.attrs.private) {
            return true;
        } else if (this.attrs.free && this.attrs.free_ticket_type.state.sold_out) {
            return true;
        } else {
            if (!this.attrs.free && this.attrs.paid_ticket_types.length > 0) {
                let closed = true;
                this.attrs.paid_ticket_types.forEach((item) => {
                    if (item.state.valid) {
                        closed = false;
                    }
                });
                return closed;
            } else {
                return false;
            }
        }
    }

    /**
     * Returns true if the registration for the event is open
     * @return {boolean}
     */
    isOpen() {
        return !this.isClosed();
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

    /**
     * Returns true if the event has ended
     * @return {boolean}
     * @private
     */
    _isEventEnded() {
        let endDate = new Date(this.attrs.end);
        return endDate < new Date();
    }
}
