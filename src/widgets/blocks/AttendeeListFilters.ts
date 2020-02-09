import Localisation from '../../utils/Localisation';
import Filter from './Filter';
import SearchFilter from './SearchFilter';
import EventTypeFilter from './EventTypeFilter';
import SelectedValues from './SelectedValues';
import LocationFilter from './LocationFilter';

/**
 * Manages the logic for attendee list filters
 */
export default class AttendeeListFilters {

  /**
   * Active filters
   */
  filters: Filter[];

  protected root: JQuery<HTMLElement>;

  /**
   * Creates event list filters
   * @param selector {HTMLElement} JQuery selector
   * @param loc {Localisation} Localisation instance
   * @param visibleFilters {array} Configuration config
   */
  constructor(selector: HTMLElement, loc: Localisation, visibleFilters: string[]) {
    this.root = $(selector);
    this.filters = this.getFilters(visibleFilters, loc);
  }

  getSelectedValues(): SelectedValues {
    const values = new SelectedValues();
    this.filters.forEach((filter: Filter) => {
      switch(filter.name) {
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
  protected getFilters(visibleFilters: string[], loc: Localisation): Filter[] {
    const filters: Filter[] = [];
    visibleFilters.forEach(name => {
      switch(name) {
        case SearchFilter.NAME:
          filters.push(new SearchFilter(this.root, loc));
          break;
        case EventTypeFilter.NAME:
          filters.push(new EventTypeFilter(this.root, loc));
          break;
        case LocationFilter.NAME:
          filters.push(new LocationFilter(this.root, loc));
          break;
        default:
          break;
      }
    });
    return filters;
  }
}
