import ListReactiveFilter from './ListReactiveFilter';
import Localisation from '../../utils/Localisation';
import FilterValue from './FilterValue';
import {COUNTRIES_LOADED} from './event-types';

export default class LocationFilter extends ListReactiveFilter {

  static NAME = 'location';
  static QUERY = 'location';
  protected static LOC_NAME = 'filter.locations';

  readonly visible: boolean = true;

  constructor(root: JQuery<HTMLElement>, loc: Localisation) {
    super(root, LocationFilter.LOC_NAME, LocationFilter.NAME, LocationFilter.QUERY, loc);
    this.reactOnChange(root);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    PubSub.subscribe(COUNTRIES_LOADED, function(msg: string, countries: string[]) {
      self.reactOnLoadedCountries(countries);
    });
  }

  protected reactOnLoadedCountries(countries: string[]) {
    this.values = [];
    const unfiltered = countries.filter((code: string) => code.length === 2).map(code => {
      const countryName = this.loc.translate(`country.${code}`);
      const selected = this.value === code;
      return new FilterValue(countryName, code, selected);
    });
    this.values = this.getFilterData(unfiltered);
    this.render();
  }

  /**
   * Returns unique, defined filter values
   * @param {FilterValue[]} values All available filter values
   * @return {FilterValue[]}
   */
  protected getFilterData(values: FilterValue[]): FilterValue[] {
    function onlyUnique(object: FilterValue, index: number, self: FilterValue[]) {
      return self.findIndex(value => object.value === value.value) === index;
    }

    function onlyDefined(object: FilterValue) {
      return object.value !== undefined;
    }

    const filtered = values
      .filter(onlyDefined)
      .filter(onlyUnique)
      .sort((left, right) => left.name.localeCompare(right.name));

    // there is no value in rendering a filter when you cannot select more than 1 option
    if (!filtered.length) {
      return [];
    }
    return filtered;
  }
}
