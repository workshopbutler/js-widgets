import {getLocalTime, DateTime, Info} from '../utils/Time';
import IPlainObject from '../interfaces/IPlainObject';

/**
 * Represents a schedule for a workshop
 */
export default class Schedule {
  readonly start: DateTime;
  readonly end: DateTime;
  readonly timezone: string | null;
  readonly hoursPerDay: number;
  readonly totalHours: number;

  /**
   * @param attrs {IPlainObject} JSON representation of the schedule
   */
  constructor(attrs: IPlainObject) {
    // check if the browser support IANA-specified zones
    if (attrs.timezone && Info.features().zones && getLocalTime().setZone(attrs.timezon).isValid) {
      this.timezone = attrs.timezone;
    } else {
      this.timezone = null;
    }
    this.hoursPerDay = attrs.hours_per_day;
    this.totalHours = attrs.total_hours;

    this.start = DateTime.fromISO(attrs.start, {zone: this.defaultTimezone()});
    this.end = DateTime.fromISO(attrs.end, {zone: this.defaultTimezone()});
  }

  /**
   * Returns true if the event has ended
   */
  ended(): boolean {
    const now = getLocalTime().setZone(this.defaultTimezone());
    return this.end < now;
  }

  /**
   * Returns the default timezone if none exists
   */
  defaultTimezone(): string {
    return this.timezone ? this.timezone : 'UTC';
  }

  /**
   * Returns true if the event is at one day
   * @return {boolean}
   */
  atOneDay(): boolean {
    return this.start.toFormat('yyyy-MM-dd') === this.end.toFormat('yyyy-MM-dd');
  }
}
