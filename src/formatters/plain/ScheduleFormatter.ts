import {getLocalTime, DateTime} from '../../utils/Time';
import Timezones from '../../common/Timezones';
import Schedule from '../../models/Schedule';
import DateTimeFormatter from './DateTimeFormatter';

/**
 * Formats the schedule
 */
export default class ScheduleFormatter {
  static format(locale: string, schedule: Schedule, part: string | null): string {
    return this.formatSchedule(locale, schedule, part ? part : 'interval_with_time');
  }

  /**
   * Returns a formatted schedule. You can pass what part of the schedule to get:
   *   - start - Start date
   *   - start_with_time  - Start date and time
   *   - end   - End date
   *   - end_with_time    - End date and time
   *   - interval  - Start and end date
   *   - interval_with_time   - Start and end date/time
   *   - timezone_abbr  - Timezone abbreviation
   *   - timezone   - Timezone name
   * @param locale {string} Current locale
   * @param schedule {Schedule} Event's schedule
   * @param part {string} Defines which part of the schedule to format
   * @return {string}
   */
  protected static formatSchedule(locale: string, schedule: Schedule, part = 'interval_with_time'): string {
    // Start/end time for events were added in the same version the timezone was added.
    // So if the timezone exist, we can show time. Otherwise, only the dates.
    const withTime = schedule.timezone != null;
    switch (part) {
      case 'start_with_time':
        return DateTimeFormatter.format(locale, schedule.start, withTime);
      case 'start':
        return DateTimeFormatter.format(locale, schedule.start);
      case 'end_with_time':
        return DateTimeFormatter.format(locale, schedule.end, withTime);
      case 'end':
        return DateTimeFormatter.format(locale, schedule.end);
      case 'timezone':
        return schedule.timezone ? schedule.start.offsetNameLong : '';
      case 'timezone_abbr':
        return schedule.timezone ?
          Timezones.shortName(schedule.start.offsetNameLong) || schedule.start.offsetNameShort :
          '';
      case 'interval':
        return ScheduleFormatter.formatFullDate(locale, schedule);
      case 'interval_with_time':
        if (!schedule.timezone) {
          return ScheduleFormatter.formatFullDate(locale, schedule);
        } else {
          return ScheduleFormatter.formatFullDateTime(locale, schedule);
        }
      default:
        return '';
    }
  }

  /**
   * Returns a formatted schedule with start and end dates
   */
  protected static formatFullDate(locale: string, schedule: Schedule): string {
    const noLocalPartsSupport = getLocalTime().setLocale(locale).toLocaleParts().length === 0;
    if (schedule.atOneDay()) {
      return DateTimeFormatter.format(locale, schedule.start);
    } else if (schedule.start.year !== schedule.end.year ||
      schedule.start.month !== schedule.end.month ||
      noLocalPartsSupport) {
      const start = DateTimeFormatter.format(locale, schedule.start);
      const end = DateTimeFormatter.format(locale, schedule.end);
      return `${start} \u2013 ${end}`;
    } else {
      return this.formatSameMonthInterval(locale, schedule.start, schedule.end);
    }
  }

  /**
   * Formats a date interval for the same month in a localised manner
   *
   * For example, the interval 19-20 April 2018 will be
   *  - April 19-20, 2018 in US
   *  - 19-20 April 2018 in Germany
   */
  protected static formatSameMonthInterval(locale: string, start: DateTime, end: DateTime): string {
    const thisYear = getLocalTime().setZone(start.zoneName).year === start.year;
    const options = thisYear ? {month: 'long', day: 'numeric'} : {month: 'long', day: 'numeric', year: 'numeric'};
    const startParts = start.setLocale(locale).toLocaleParts(options);
    const endParts = end.setLocale(locale).toLocaleParts(options);
    let interval = '';
    for (let i = 0; i < startParts.length; i++) {
      if (startParts[i].value === endParts[i].value) {
        interval += startParts[i].value;
      } else {
        interval += `${startParts[i].value}–${endParts[i].value}`;
      }
    }
    return interval;
  }

  /**
   * Returns a formatted schedule with start and end times
   */
  protected static formatFullDateTime(locale: string, schedule: Schedule): string {
    if (schedule.atOneDay()) {
      const date = DateTimeFormatter.format(locale, schedule.start);
      const time = `${schedule.start.toFormat('t')}\u2013${schedule.end.toFormat('t')}`;
      return `${date}, ${time}`;
    } else {
      const start = DateTimeFormatter.format(locale, schedule.start, true);
      const end = DateTimeFormatter.format(locale, schedule.end, true);
      return `${start} \u2013 ${end}`;
    }
  }

}
