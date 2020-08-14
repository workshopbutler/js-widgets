import {Duration as LuxonDuration} from 'luxon';

export default class Duration {

  readonly days: number;
  readonly hours: number;
  readonly minutes: number;

  constructor(duration: LuxonDuration) {
    this.days = Math.floor(duration.as('days'));
    this.hours = Math.floor(duration.as('hours')) - this.days * 24;
    this.minutes = Math.floor(duration.as('minutes')) - (this.days * 24 + this.hours) * 60;
  }
}
