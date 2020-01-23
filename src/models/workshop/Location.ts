import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Represents a location of an event
 */
export default class Location {

  static fromJSON(json: IPlainObject): Location {
    return new Location(json.online, json.country, json.city);
  }

  readonly online: boolean;
  readonly countryCode: string;
  readonly city?: string;

  constructor(online: boolean, countryCode: string, city?: string) {
    this.online = online;
    this.countryCode = this.online ? '00' : countryCode;
    this.city = city;
  }
}
