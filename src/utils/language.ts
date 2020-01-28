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
    ['Chinese', 'ZH'],
    ['Croatian', 'HR'],
    ['Czech', 'CS'],
    ['Danish', 'DA'],
    ['Dutch', 'NL'],
    ['English', 'EN'],
    ['Finnish', 'FI'],
    ['French', 'FR'],
    ['German', 'DE'],
    ['Italian', 'IT'],
    ['Slovenian', 'SL'],
    ['Japanese', 'JA'],
    ['Norwegian', 'NO'],
    ['Polish', 'PL'],
    ['Portuguese', 'PT'],
    ['Romanian', 'RO'],
    ['Russian', 'RU'],
    ['Spanish', 'ES'],
    ['Swedish', 'SV'],
    ['Serbian', 'SR'],
    ['Turkish', 'TR'],
    ['Vietnamese', 'VI'],
    ['Korean', 'KO'],
    ['Georgian', 'KA'],
    ['Slovakian', 'SK'],
  ]);
  const code = langs.get(language);
  return code ? code : language;
}
