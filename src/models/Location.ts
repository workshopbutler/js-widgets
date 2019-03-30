/**
 * Represents a location of an event
 */
import IPlainObject from '../interfaces/IPlainObject';

export default class Location {
    readonly online: boolean;
    readonly countryCode: string;
    readonly city: string | null;

    /**
     * @param attrs {IPlainObject} JSON representation of the schedule
     */
    constructor(attrs: IPlainObject) {
        this.online = attrs.online;
        this.countryCode = this.online ? '00' : attrs.country_code;
        this.city = attrs.city;
    }
}
