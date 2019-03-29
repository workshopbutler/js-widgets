/**
 * Removes HTML and Javascript form the document
 * @param html {string} HTML text
 */
export default function stripHTML(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
