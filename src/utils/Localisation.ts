import i18next from 'i18next';
import IPlainObject from '../interfaces/IPlainObject';
import * as resources from '../locales';
/**
 * Controls the translation of message tokens to actual strings
 */
export default class Localisation {
  readonly locale: string;

  /**
   * Initialises i18next locale
   * @param locale {string} Widget's locale
   * @param language {string} Widget's language
   * @param userDict {IPlainObject} User dictionary to replace some default values
   */
  constructor(locale: string, language: string, userDict: IPlainObject) {
    const dict = (resources as any)[language];
    const skinnyResource: IPlainObject = {};
    skinnyResource[language] = {
      translation: userDict[language] ? this.deepCopy(dict, userDict[language]) : dict,
    };
    this.locale = locale;
    i18next.init({
      debug: false,
      fallbackLng: language,
      lng: language,
      resources: skinnyResource,
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
  protected isObject(mayBeObject: IPlainObject | undefined): boolean {
    return mayBeObject !== null && typeof mayBeObject === 'object';
  }
}
