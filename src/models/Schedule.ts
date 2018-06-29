import {DateTime} from "luxon";
import Timezones from "../common/Timezones";

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
     * @param attrs {any} JSON representation of the schedule
     */
    constructor(attrs: any) {
        this.timezone = attrs.timezone;
        this.hoursPerDay = attrs.hours_per_day;
        this.totalHours = attrs.total_hours;

        const timezone = this.timezone ? this.timezone : 'UTC';
        this.start = DateTime.fromFormat(attrs.start, 'yyyy-MM-dd HH:mm', { zone: timezone });
        this.end = DateTime.fromFormat(attrs.end, 'yyyy-MM-dd HH:mm', { zone: timezone });
    }

    /**
     * Returns a formatted schedule. You can pass what part of the schedule to get:
     *   - start_short - Start date
     *   - start_long  - Start date and time
     *   - end_short   - End date
     *   - end_long    - End date and time
     *   - full_short  - Start and end date
     *   - full_long   - Start and end date/time
     *   - timezone_short  - Timezone abbreviation
     *   - timezone_long   - Timezone name
     * @part {string} Defines which part of the schedule to format
     * @return {string}
     */
    format(part: string = 'full_long'): string {
        const longFormat = this.timezone ? 'DDD, t' : 'DDD';
        const shortFormat = 'DDD';
        switch(part) {
            case 'start_long': return this.start.toFormat(longFormat);
            case 'start_short': return this.start.toFormat(shortFormat);
            case 'end_long': return this.end.toFormat(longFormat);
            case 'end_short': return this.end.toFormat(shortFormat);
            case 'timezone_long': return this.start.offsetNameLong;
            case 'timezone_short':
                return Timezones.shortName(this.start.offsetNameLong) || this.start.offsetNameShort;
            case 'full_short': return this.formatFullDate(this.start, this.end);
            case 'full_long':
                if (!this.timezone) {
                    return this.formatFullDate(this.start, this.end);
                } else {
                    return this.formatFullDateTime(this.start, this.end);
                }
            default:
                return '';
        }
    }

    /**
     * Returns a formatted schedule with start and end times
     *
     * @param start {DateTime} The start datetime of the event
     * @param end {DateTime} The end datetime of the event
     * @return {string}
     */
    protected formatFullDate(start: DateTime, end: DateTime): string  {
        const shortFormat = 'DDD';
        if (this.atOneDay()) {
            return start.toFormat(shortFormat);
        } else if (start.year != end.year || start.month != end.month) {
            return `${start.toFormat(shortFormat)} — ${end.toFormat(shortFormat)}`
        } else {
            return `${start.toFormat('d')} — ${end.toFormat('d MMMM yyyy')}`;
        }
    }

    /**
     * Returns a formatted schedule with start and end times
     *
     * @param start {DateTime} The start datetime of the event
     * @param end {DateTime} The end datetime of the event
     * @return {string}
     */
    protected formatFullDateTime(start: DateTime, end: DateTime): string  {
        if (this.atOneDay()) {
            const date = start.toFormat('DDD');
            const time = `${start.toFormat('t')}—${end.toFormat('t')}`;
            return `${date}, ${time}`;
        } else {
            return `${start.toFormat('DDD, t')} — ${end.toFormat('DDD, t')}`;
        }
    }


    /**
     * Returns true if the event is at one day
     * @return {boolean}
     */
    atOneDay(): boolean {
        return this.start.toFormat('yyyy-MM-dd') == this.end.toFormat('yyyy-MM-dd');
    }

}
