import Event from './Event';
import IPlainObject from '../interfaces/IPlainObject';

/**
 * Represents a workshop's attendee
 */
export default class Attendee {

  static fromJSON(json: IPlainObject, options: IPlainObject): Attendee {
    const countryCode = json.address ? json.address.country : undefined;
    const city = json.address ? json.address.city : undefined;
    const event = json.event ? Event.fromJSON(json.event, options) : undefined;
    return new Attendee(json.id, json.first_name, json.last_name, countryCode, city, json.organisation,
      json.certificate, event);
  }

  constructor(readonly id: number,
              readonly firstName: string,
              readonly lastName: string,
              readonly countryCode?: string,
              readonly city?: string,
              readonly company?: string,
              readonly certificate?: string,
              readonly event?: Event) {
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
