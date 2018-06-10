import Event from "../models/Event";

/**
 * Returns a pretty-formatted spoken and materials languages of the workshop
 * @param {Event} workshop
 * @return {string}
 */
export function formatLanguages(workshop: Event): string {
    let languages = workshop.spokenLanguages;
    let materialLanguage = workshop.materialsLanguage;
    let prefix = 'Event is in ' + languages[0];
    if (languages.length > 1) {
        prefix += ' and ' + languages[1];
    }
    let suffix = '.';
    if (materialLanguage) {
        suffix = ', all materials and handouts are in ' + materialLanguage;
    }
    return prefix + suffix;
}
