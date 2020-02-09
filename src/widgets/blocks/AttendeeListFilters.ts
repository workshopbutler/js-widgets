import Localisation from '../../utils/Localisation';
import Filter, {FilterList} from './Filter';
import SearchFilter from './SearchFilter';
import EventTypeFilter from './EventTypeFilter';
import SelectedValues from './SelectedValues';
import LocationFilter from './LocationFilter';
import {FilterNames} from '../config/WidgetConfig';

/**
 * Manages the logic for attendee list filters
 */
export default class AttendeeListFilters {

  /**
   * Active filters
   */
  filters: FilterList[];

  protected root: JQuery<HTMLElement>;

  /**
   * Creates event list filters
   * @param selector {HTMLElement} JQuery selector
   * @param loc {Localisation} Localisation instance
   * @param visibleFilters {array} Configuration config
   */
  constructor(selector: HTMLElement, loc: Localisation, visibleFilters: FilterNames) {
    this.root = $(selector);
    this.filters = this.getFilters(visibleFilters, loc);
  }

  getSelectedValues(): SelectedValues {
    const values = new SelectedValues();
    this.flatMap(this.filters).forEach((filter: Filter) => {
      switch (filter.name) {
        case SearchFilter.NAME:
          values.search = filter.value;
          break;
        case EventTypeFilter.NAME:
          values.type = filter.value;
          break;
        case LocationFilter.NAME:
          values.location = filter.value;
          break;
        default:
          break;
      }
    });
    return values;
  }

  /**
   * Returns filters
   * @param visibleFilters {string[]} Filters to show
   * @param loc {Localisation} Localisation object
   */
  protected getFilters(visibleFilters: FilterNames, loc: Localisation): FilterList[] {
    const filters: FilterList[] = [];
    visibleFilters.forEach((name: string | string[] ) => {
      if (Array.isArray(name)) {
        filters.push(this.createListOfFilters(name, loc));
      } else {
        const filter = this.createFilter(name, loc);
        if (filter) {
          filters.push(filter);
        }
      }
    });
    return filters;
  }

  protected flatMap(filters: FilterList[]): Filter[] {
    const flattenFilters: Filter[] = [];
    filters.forEach((filter: FilterList) => {
      if (Array.isArray(filter)) {
        filter.forEach((value: Filter) => flattenFilters.push(value));
      } else {
        flattenFilters.push(filter);
      }
    });
    return flattenFilters;
  }

  protected createFilter(name: string, loc: Localisation): Filter | undefined {
    switch (name) {
      case SearchFilter.NAME:
        return new SearchFilter(this.root, loc);
      case EventTypeFilter.NAME:
        return new EventTypeFilter(this.root, loc);
      case LocationFilter.NAME:
        return new LocationFilter(this.root, loc);
      default:
        return undefined;
    }
  }

  protected createListOfFilters(names: string[], loc: Localisation): Filter[] {
    const filters: Filter[] = [];
    names.forEach(name => {
      const filter = this.createFilter(name, loc);
      if (filter) {
        filters.push(filter);
      }
    });
    return filters;
  }
}
