export function dateInterval(startDate: Date, endDate: Date, withoutYear: boolean = false): string {
    let withYear = (typeof withoutYear == 'undefined') || !withoutYear;
    let months: any = {
        0: ["Jan", "January"],
        1: ["Feb", "February"],
        2: ["Mar", "March"],
        3: ["Apr", "April"],
        4: ["May", "May"],
        5: ["Jun", "June"],
        6: ["Jul", "July"],
        7: ["Aug", "August"],
        8: ["Sep", "September"],
        9: ["Oct", "October"],
        10: ["Nov", "November"],
        11: ["Dec", "December"]
    };

    if (!(startDate && endDate)) return '';

    let strStart = '';
    let strEnd = '';

    if (withYear) {
        if (startDate.getFullYear() != endDate.getFullYear()){
            strStart += startDate.getFullYear();
        }
        strEnd += endDate.getFullYear();
    }

    let monthNameIndex = + !withYear;
    if (startDate.getMonth() != endDate.getMonth()){
        strStart = months[startDate.getMonth()][monthNameIndex] + ' ' + strStart;
    }
    strEnd = months[endDate.getMonth()][monthNameIndex] + ' ' + strEnd;

    if (startDate.getDate() != endDate.getDate()){
        strStart = startDate.getDate() + ' ' + strStart;
    }
    strEnd = endDate.getDate() + ' ' + strEnd;

    return $.trim(strStart)? `${strStart} — ${strEnd}`: strEnd;
}

/**
 * Returns well-formatted date
 * @param date {string}
 * @returns {string}
 */
export function formatDate(date: Date): string {
    const options = { year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString('gb', options);
}
