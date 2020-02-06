import {SelectFilter} from './SelectFilter';
import FilterValue from './FilterValue';
import SearchFilter from './SearchFilter';
import Filter from './Filter';

export abstract class ListFilters<T> {

  /**
   * Name of the filters
   */
  protected filters: string[];

  /**
   * Element root
   */
  protected root: JQuery<HTMLElement>;

  /**
   * Returns non-empty filters
   * @param objects {array} List of objects
   */
  getFilters(objects: T[]): Filter[] {
    const filters: Filter[] = [];
    this.filters.forEach(name => {
      if (name === SearchFilter.NAME) {
        filters.push(new SearchFilter(this.root));
      } else {
        const values = this.getFilterValues(name, objects);
        if (values.length) {
          const filterValue = new SelectFilter(name, values, true);
          filters.push(filterValue);
        }
      }
    });
    // here we try to accommodate both ajax and non-ajax filters
    return filters.filter(filter => filter.visible);
  }

  protected abstract getFilterValues(name: string, objects: T[]): FilterValue[];

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
