import URI from 'urijs';

/**
 * Returns the value of query parameter or null if the parameter is not found
 * @param name {string}
 */
export default function getQueryParam(name: string) {
  let value = null;
  window.location.search.substr(1).split('&').forEach(el => {
    const param = el.split('=', 2);
    if (param.length === 2 && param[0] === name) {
      value = param[1];
    }
  });
  return value;
}

export function safeHref(): string | undefined {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.href;
  }
  return undefined;
}

/**
 * Converts the given URL to the absolute one using an existing domain
 * @param url {string} The url to convert
 */
export function absoluteURL(url: string): string {
  const uri = new URI(url);
  if (uri.host().length > 0) {
    return url;
  }
  if (typeof window !== 'undefined' && window.location) {
    return uri.absoluteTo(window.location.href).href();
  }
  return url;
}

export function updatePathWithQuery(key: string, value: string): void {
  const url = new URI().addSearch(key, value).normalizeSearch().toString();
  window.history.pushState({path: url}, '', url);
}

export function deleteQueryFromPath(key: string): void {
  const url = new URI().removeSearch(key).toString();
  window.history.pushState({path: url}, '', url);
}

export function hasValueInPath(type: string, value?: string): boolean {
  return new URI().hasQuery(type, value);
}
