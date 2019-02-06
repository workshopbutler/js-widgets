import i18next from 'i18next';
import en from '../locales/en.json';
import de from '../locales/de.json';
import es from '../locales/es.json';
import pt from '../locales/pt.json';
import fr from '../locales/fr.json';
import nl from '../locales/nl.json';

export default class Localisation {
  readonly locale: string;

  constructor(locale: string, language: string) {
    this.locale = locale;
    i18next.init({
      lng: language,
      debug: false,
      fallbackLng: 'en',
      resources: {
        en: {
          translation: en,
        },
        de: {
          translation: de
        },
        es: {
          translation: es
        },
        pt: {
          translation: pt
        },
        fr: {
          translation: fr
        },
        nl: {
          translation: nl
        }
      }
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
}
