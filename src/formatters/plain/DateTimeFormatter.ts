import {DateTime} from 'luxon';

/**
 * Formats a DateTime object
 */
export default class DateTimeFormatter {
  static format(locale: string, dateTime: DateTime, withTime = false): string {
    const thisYear = DateTime.local().setZone(dateTime.zoneName).year === dateTime.year;
    const dateFormat = this.getDateFormat(withTime, thisYear);
    return dateTime.setLocale(locale).toLocaleString(dateFormat);
  }

  /**
     * Returns a correct format for date localisation
     * @param withTime {boolean} True if time should be shown
     * @param thisYear {boolean} True if the date is in this year
     */
  protected static getDateFormat(withTime: boolean, thisYear: boolean): any {
    if (withTime) {
      return thisYear ?
        {month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'} :
        DateTime.DATETIME_MED;
    } else {
      return thisYear ?
        {month: 'long', day: 'numeric'} :
        DateTime.DATE_FULL;
    }
  }
}
