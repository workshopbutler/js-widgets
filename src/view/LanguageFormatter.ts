import Language from '../models/Language';
import Localisation from '../utils/Localisation';

/**
 * Formats the language
 */
export default class LanguageFormatter {
    static format(loc: Localisation, language: Language): string {
        const prefix = language.spoken.length > 1 ?
            loc.translate('event.info.twoLangs', { first: language.spoken[0], second: language.spoken[1]}) :
            loc.translate('event.info.oneLang', { lang: language.spoken[0]}) ;
        const suffix = language.materials ?
            loc.translate('event.info.materials', { lang: language.materials }) : '.';
        return prefix + suffix;
    }
}
