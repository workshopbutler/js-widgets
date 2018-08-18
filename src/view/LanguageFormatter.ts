import Localisation from "../utils/Localisation";
import Language from "../models/Language";

/**
 * Formats the language
 */
export default class LanguageFormatter {
    static format(loc: Localisation, language: Language): string {
        const prefix = language.spoken.length > 1 ?
            loc.translate('event.info.twoLangs', { first: language.spoken[0], second: language.spoken[1]}) :
            loc.translate('event.info.oneLang', { lang: language.spoken[0]}) ;
        let suffix = language.materials ?
            loc.translate('event.info.materials', { lang: language.materials }) : '.';
        return prefix + suffix;
    }
}
