import Localisation from '../../utils/Localisation';
import FilterValue from './FilterValue';
import {deleteQueryFromPath, hasValueInPath, updatePathWithQuery} from '../../common/helpers/UrlParser';
import PubSub from 'pubsub-js';
import URI from 'urijs';
import getCountryCodes from '../../utils/countries';
import Filter from './Filter';
import SearchFilter from './SearchFilter';
import {SelectFilter} from './SelectFilter';

/**
 * Manages the logic for attendee list filters
 */
export default class AttendeeListFilters {

  /**
   * The value of location filter
   */
  selectedLocation?: string;

  /**
   * Active filters
   */
  filters: Filter[];


  protected root: JQuery<HTMLElement>;

  private readonly loc: Localisation;

  /**
   * Creates event list filters
   * @param selector {HTMLElement} JQuery selector
   * @param loc {Localisation} Localisation instance
   * @param visibleFilters {array} Configuration config
   */
  constructor(selector: HTMLElement, loc: Localisation, visibleFilters: string[]) {
    this.root = $(selector);
    this.loc = loc;
    this.filters = this.getFilters(visibleFilters);
    this.init();
    this.assignEvents();
  }

  /**
   * Returns filters
   * @param visibleFilters {string[]} Filters to show
   */
  protected getFilters(visibleFilters: string[]): Filter[] {
    const filters: Filter[] = [];
    visibleFilters.forEach(name => {
      if (name === SearchFilter.NAME) {
        filters.push(new SearchFilter(this.root));
      } else {
        const values = this.getFilterValues(name);
        if (values.length) {
          const filterValue = new SelectFilter(name, values, true);
          filters.push(filterValue);
        }
      }
    });
    return filters;
  }

  protected init() {
    const dataMap = new URI().search(true);
    if (dataMap.location !== undefined) {
      this.selectedLocation = dataMap.location;
    }
  }

  /**
   * Filters the attendees
   */
  filterAttendees(e: Event) {
    e.preventDefault();
    if (e.currentTarget) {
      const filter = $(e.currentTarget);
      const value = filter.val() as string;
      const name = filter.data('name');
      switch (name) {
        case 'location':
          deleteQueryFromPath(name);
          if (value === 'all') {
            this.selectedLocation = undefined;
          } else {
            updatePathWithQuery(name, value);
            this.selectedLocation = value;
          }
          PubSub.publish('attendee.list.reload', '');
          return;
        default:
          return;
      }
    }
  }

  protected getFilterValues(name: string): FilterValue[] {
    switch (name) {
      // case 'type':
      //   return this.getTypeFilterData(this.loc.translate('filter.types'), events);
      case 'location':
        return this.getLocationFilterData(this.loc.translate('filter.locations'));
      default:
        return [];
    }
  }

  private assignEvents() {
    this.root.on('change', '[data-filter]', this.filterAttendees.bind(this));
  }

  private getLocationFilterData(defaultName: string): FilterValue[] {
    const unfiltered = getCountryCodes().map(code => {
      const countryName = this.loc.translate(`country.${code}`);
      const selected = hasValueInPath('location', code);
      return new FilterValue(countryName, code, selected);
    });

    return this.getFilterData(defaultName, unfiltered);
  }

  // private getTypeFilterData(defaultName: string, events: Event[]): FilterValue[] {
  //   const unfiltered = events.map(event => {
  //     const typeId = event.type.id.toString();
  //     const selected = isHasValueInPath('type', typeId);
  //     return new FilterValue(event.type.name, typeId, selected);
  //   });
  //   return this.getFilterData(defaultName, unfiltered);
  // }

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
