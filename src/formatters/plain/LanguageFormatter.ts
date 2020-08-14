import Language from '../../models/workshop/Language';
import Localisation from '../../utils/Localisation';

/**
 * Formats the language
 */
export default class LanguageFormatter {

  static format(loc: Localisation,
                language: Language | string | string[],
                type: string | null = null): string | string[] {
    if (language instanceof Language) {
      return type === 'short' ?
        LanguageFormatter.formatShort(loc, language) :
        LanguageFormatter.formatLong(loc, language);
    }
    if (typeof language === 'string') {
      return loc.translate('language.' + language);
    }
    if (Array.isArray(language)) {
      return language.map(t => loc.translate('language.' + t));
    }
    return '';
  }

  protected static formatLong(loc: Localisation, language: Language): string {
    const prefix = language.spoken.length > 1 ?
      loc.translate('event.info.twoLangs', {first: language.spoken[0], second: language.spoken[1]}) :
      loc.translate('event.info.oneLang', {lang: language.spoken[0]});
    const suffix = language.materials ?
      loc.translate('event.info.materials', {lang: language.materials}) : '.';
    return prefix + suffix;
  }

  protected static formatShort(loc: Localisation, language: Language): string {
    return language.spoken.length > 1 ?
      loc.translate('event.info.twoLangsShort', {first: language.spoken[0], second: language.spoken[1]}) :
      loc.translate('event.info.oneLangShort', {lang: language.spoken[0]});
  }
}
