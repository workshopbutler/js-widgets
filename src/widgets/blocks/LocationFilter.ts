import ListReactiveFilter from './ListReactiveFilter';
import Localisation from '../../utils/Localisation';
import FilterValue from './FilterValue';
import getCountryCodes from '../../utils/countries';

export default class LocationFilter extends ListReactiveFilter {

  static NAME = 'location';
  static QUERY = 'location';
  protected static LOC_NAME = 'filter.locations';

  readonly visible: boolean = true;

  constructor(root: JQuery<HTMLElement>, loc: Localisation) {
    super(root, LocationFilter.LOC_NAME, LocationFilter.NAME, LocationFilter.QUERY, loc);
    this.reactOnChange(root);
    this.values = this.getFilterValues(this.loc.translate(this.localisationId));
  }

  private getFilterValues(defaultName: string): FilterValue[] {
    const unfiltered = getCountryCodes().map(code => {
      const countryName = this.loc.translate(`country.${code}`);
      const selected = this.value === code;
      return new FilterValue(countryName, code, selected);
    });

    return this.getFilterData(defaultName, unfiltered);
  }

  /**
   * Returns unique, defined filter values
   * @param {string} defaultName Name of default value
   * @param {FilterValue[]} values All available filter values
   * @return {FilterValue[]}
   */
  protected getFilterData(defaultName: string, values: FilterValue[]): FilterValue[] {
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
    const all = {value: 'all', name: defaultName};
    filtered.unshift(all);
    return filtered;
  }
}
