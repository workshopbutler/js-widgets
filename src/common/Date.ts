/**
 * Returns well-formatted date
 * @param date {string}
 * @returns {string}
 */
export function formatDate(date: Date): string {
    const options = { year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString('gb', options);
}
