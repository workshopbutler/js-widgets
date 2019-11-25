import URI from 'urijs';

/**
 * Returns the value of query parameter or null if the parameter is not found
 * @param name {string}
 */
export default function getQueryParam(name: string) {
  let value = null;
  window.location.search.substr(1).split('&').forEach((el) => {
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

export function createURL(): URL {
  const {location} = window;
  const path: string = location.protocol + '//' + location.host + location.pathname + location.search;
  return new URL(path);
}

/**
 * Converts the given new URL() to the string with qyery params
 * @param url {new URL}
 */
export function generateUrlWithQueryToString(url: URL): string {
  return `${url.protocol}//${url.host}${url.pathname}${url.search}`;
}

export function updatePathWithQuery(key: string, value: string): void {
  if (history.pushState) {
    const url = createURL();
    url.searchParams.append(key, value);
    const result = generateUrlWithQueryToString(url);
    window.history.pushState({path: result}, '', result);
  }
}

export function deleteQueryFromPath(key: string): void {
  if (history.pushState) {
    const url = createURL();
    url.searchParams.delete(key);
    const result = generateUrlWithQueryToString(url);
    window.history.pushState({path: result}, '', result);
  }
}

export function isHasValueInPath(type: string, value: string): boolean {
  const url = createURL();
  const findValue = url.searchParams.getAll(type);

  if (findValue.length === 1) {
    return findValue[0] === value;
  }

  return false;
}
