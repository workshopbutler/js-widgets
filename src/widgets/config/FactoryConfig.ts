import {logError} from '../../common/Error';

/**
 * Defines how a factory config should look like and what properties it should have
 */
export default class FactoryConfig {

  /**
   * Creates a new FactoryConfig from raw data if possible
   * @param data {any} Configuration data
   */
  static create(data: any): FactoryConfig | null {
    if (data.apiKey && typeof data.apiKey === 'string') {
      return new FactoryConfig(data.apiKey, data.locale ? data.locale : null);
    } else {
      logError('apiKey parameter is not found');
      return null;
    }
  }

  /**
   * Locale (used for numbers, currencies, dates)
   */
  locale: string;

  /**
   * Language (used for the translation of texts)
   */
  language: string;

  /**
   * Initialises the config.
   * @param apiKey {string}
   * @param locale {string} Must have format 'xx-xx'. If null or incorrect, the default 'en-gb' locale is used
   */
  protected constructor(readonly apiKey: string, locale?: string) {
    if (locale) {
      this.parseLocale(locale);
    } else {
      this.setDefaultLocale();
    }
  }

  /**
   * Parses the input locale and sets the language and locale
   * @param locale {string} Locale. Hopefully, in 'xx-xx' format
   */
  protected parseLocale(locale: string): void {
    const parts = locale.match(/([a-zA-Z]{2})(-([a-zA-Z]{2}))?/);
    if (!parts || parts.length !== 4) {
      this.setDefaultLocale();
    } else {
      this.language = parts[1] ? parts[1].toLowerCase() : 'en';
      this.locale = locale.toLowerCase();
    }
  }

  /**
   * Sets the default values for the locale and language
   */
  protected setDefaultLocale(): void {
    this.locale = 'en-gb';
    this.language = 'en';
  }

}
