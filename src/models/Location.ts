/**
 * Represents a location of an event
 */
export default class Location {
    readonly online: boolean;
    readonly countryCode: string;
    readonly city: string | null;

    /**
     * @param attrs {any} JSON representation of the schedule
     */
    constructor(attrs: any) {
        this.online = attrs.online;
        this.countryCode = this.online ? "00" : attrs.country_code;
        this.city = attrs.city;
    }
}
