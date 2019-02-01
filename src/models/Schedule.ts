import {DateTime, Info} from 'luxon';

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
        // check if the browser support IANA-specified zones
        if (attrs.timezone && Info.features().zones && DateTime.local().setZone(attrs.timezon).isValid) {
            this.timezone = attrs.timezone;
        } else {
            this.timezone = null;
        }
        this.hoursPerDay = attrs.hours_per_day;
        this.totalHours = attrs.total_hours;

        this.start = DateTime.fromFormat(attrs.start, 'yyyy-MM-dd HH:mm', { zone: this.defaultTimezone() });
        this.end = DateTime.fromFormat(attrs.end, 'yyyy-MM-dd HH:mm', { zone: this.defaultTimezone() });
    }

    /**
     * Returns true if the event has ended
     */
    ended(): boolean {
        const now = DateTime.local().setZone(this.defaultTimezone());
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
