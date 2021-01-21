/**
 * Returns 2-letter language code from the name of the language. If the language code is unknown,
 *  the language itself is returned
 *
 * We have to do it as API returns full names of the languages right now
 * @param language {string} Language
 */
export default function getLangCode(language: string): string {
  const langs = new Map<string, string>([
    ['Arabic', 'AR'],
    ['Bulgarian', 'BG'],
    ['Czech', 'CS'],
    ['Danish', 'DA'],
    ['German', 'DE'],
    ['English', 'EN'],
    ['Spanish', 'ES'],
    ['Finnish', 'FI'],
    ['French', 'FR'],
    ['Hebrew', 'HE'],
    ['Croatian', 'HR'],
    ['Hungarian', 'HU'],
    ['Italian', 'IT'],
    ['Japanese', 'JA'],
    ['Georgian', 'KA'],
    ['Korean', 'KO'],
    ['Macedonian', 'MK'],
    ['Dutch', 'NL'],
    ['Norwegian', 'NO'],
    ['Polish', 'PL'],
    ['Portuguese', 'PT'],
    ['Romanian', 'RO'],
    ['Russian', 'RU'],
    ['Slovakian', 'SK'],
    ['Slovenian', 'SL'],
    ['Serbian', 'SR'],
    ['Swedish', 'SV'],
    ['Turkish', 'TR'],
    ['Vietnamese', 'VI'],
    ['Chinese', 'ZH'],
  ]);
  const code = langs.get(language);
  return code ? code : language;
}
