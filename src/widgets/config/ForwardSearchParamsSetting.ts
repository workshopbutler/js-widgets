import URI from 'urijs';

export type ForwardSearchParamsSettingType = boolean | string | undefined;

export interface WithPassSearchParamsSetting {
  forwardSearchParams: ForwardSearchParamsSettingType;
}

/**
 * This setting defines if the search params in URL should be passed to other widgets within between-widget navigation.
 * For example, when we navigate from the event page widget to the registration form widget, the query params
 * could be added to the registration form widget URL to trace referrals.
 *
 * If `forward` is set to `true`, search params will be passed further. Some params could be replaced if they are
 * reserved by the widget (like `id`).
 *
 * A user can specify which params should be forwarded by providing a list of params separated by comma.
 */
export default class ForwardSearchParamsSetting {

  /**
   * If `forward` is set to `true`, search params will be passed further. Some params could be replaced if they are
   * reserved by the widget (like `id`).
   *
   * @default false
   * @type {boolean}
   */
  readonly forward: boolean;

  /**
   * A set of parameters that should be forwarded.
   *
   * @default Seq()
   * @type {Set<string>}
   */
  readonly limitParams: Set<string>;

  constructor(value: ForwardSearchParamsSettingType) {
    this.forward = value ? (typeof value === 'boolean' ? value : true) : false;
    this.limitParams = value ? ForwardSearchParamsSetting.parseParameters(value) : new Set();
  }

  createUrl(url: string, params: { [key: string]: string | number }): string {
    const search = this.forward ? window.location.search : '';
    const uri = new URI(url + search);
    if (this.forward && this.limitParams.size > 0) {
      Object.entries(uri.search(true)).forEach(value => {
        const [key] = value;
        if (!this.limitParams.has(key)) {
          uri.removeSearch(key);
        }
      });
    }
    this.addSearchParams(uri, params);
    return uri.toString();
  }

  /**
   * Applies the given query params to the given URI, and replaces the value of existing ones.
   *
   * @param uri {URI} the URI to apply the query params to
   * @param params {Object} the query params to apply
   * @protected
   */
  protected addSearchParams(uri: URI, params: { [key: string]: string | number }): void {
    const map = new Map<string, string | number>(Object.entries(params));
    map.forEach((value, key) => {
      if (uri.hasSearch(key)) {
        uri.setSearch(key, value.toString());
      } else {
        uri.addSearch(key, value);
      }
    });
  }

  private static parseParameters(param: boolean | string): Set<string> {
    if (typeof param === 'string') {
      return new Set(param.split(',').map(s => s.trim()));
    }
    return new Set<string>();
  }
}
