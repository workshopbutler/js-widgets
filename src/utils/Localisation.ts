import i18next from 'i18next';
import IPlainObject from '../interfaces/IPlainObject';
import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import nl from '../locales/nl.json';
import pt from '../locales/pt.json';
import no from '../locales/no.json';

/**
 * Controls the translation of message tokens to actual strings
 */
export default class Localisation {
  readonly locale: string;

  /**
   * Initialises i18next locale
   * @param locale {string} Widget's locale
   * @param language {string} Widget's language
   * @param dict {IPlainObject} User dictionary to replace some default values
   */
  constructor(locale: string, language: string, dict: IPlainObject) {
    this.locale = locale;
    i18next.init({
      debug: false,
      fallbackLng: 'en',
      lng: language,
      resources: {
        de: {
          translation: dict.de ? this.deepCopy(de, dict.de) : de,
        },
        en: {
          translation: dict.en ? this.deepCopy(en, dict.en) : en,
        },
        es: {
          translation: dict.es ? this.deepCopy(es, dict.es) : es,
        },
        fr: {
          translation: dict.fr ? this.deepCopy(fr, dict.fr) : fr,
        },
        no: {
          translation: dict.no ? this.deepCopy(no, dict.no) : no,
        },
        nl: {
          translation: dict.nl ? this.deepCopy(nl, dict.nl) : nl,
        },
        pt: {
          translation: dict.pt ? this.deepCopy(pt, dict.pt) : pt,
        },
      },
    });
  }

  /**
   * Returns a translated term by its key
   * @param key {string}
   * @param options {any} Options for the key
   */
  translate(key: string, options: any = null): string {
    return i18next.t(key, options);
  }

  /**
   * Replaces the values from default dictionary by the values from user dictionary
   * @param defaultDict {IPlainObject} Default dictionary
   * @param userDict {IPlainObject} User dictionary
   */
  protected deepCopy(defaultDict: IPlainObject, userDict: IPlainObject): IPlainObject {
    for (const i in userDict) {
      if (this.isObject(userDict[i]) && this.isObject(defaultDict[i])) {
        this.deepCopy(defaultDict[i], userDict[i]);
      } else {
        defaultDict[i] = userDict[i];
      }
    }
    return defaultDict;
  }

  /**
   * Returns true if the object is a real object
   */
  protected isObject(mayBeObject: IPlainObject|undefined): boolean {
    return mayBeObject !== null && typeof mayBeObject === 'object';
  }
}
