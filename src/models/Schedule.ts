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

  static fromJSON(json: IPlainObject): Schedule {
    return new Schedule(
      json.start,
      json.end,
      json.timezone,
      json.hours_per_day,
      json.total_hours
    );
  }

  constructor(
    start: string,
    end: string,
    timezone: string | null,
    hoursPerDay: number,
    totalHours: number,
  ) {
    // check if the browser support IANA-specified zones (may conflicts with polyfill in some browsers)
    if (timezone && Info.features().zones && getLocalTime().setZone(timezone).isValid) {
      this.timezone = timezone;
    } else {
      this.timezone = null;
    }
    this.hoursPerDay = hoursPerDay;
    this.totalHours = totalHours;

    this.start = DateTime.fromISO(start, {zone: this.defaultTimezone()});
    this.end = DateTime.fromISO(end, {zone: this.defaultTimezone()});
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
