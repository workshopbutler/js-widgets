import Event from '../../models/Event';
import Localisation from '../../utils/Localisation';
import FilterValue from './FilterValue';
import {ListFilters} from './ListFilters';

/**
 * Manages the logic for event list filters
 */
export default class EventListFilters extends ListFilters<Event> {
  private $root: JQuery;
  private readonly loc: Localisation;

  /**
   * Creates event list filters
   * @param selector {HTMLElement} JQuery selector
   * @param loc {Localisation} Localisation instance
   * @param visibleFilters {array} Configuration config
   */
  constructor(selector: HTMLElement, loc: Localisation, visibleFilters: string[]) {
    super();
    this.$root = $(selector);
    this.loc = loc;
    this.filters = visibleFilters;
    this.assignEvents();
  }

  protected getFilterValues(name: string, events: Event[]): FilterValue[] {
    switch (name) {
      case 'category':
        return this.getCategoryFilterData(this.loc.translate('filter.categories'), events);
      case 'language':
        return this.getLanguageFilterData(this.loc.translate('filter.languages'), events);
      case 'type':
        return this.getTypeFilterData(this.loc.translate('filter.types'), events);
      case 'location':
        return this.getLocationFilterData(this.loc.translate('filter.locations'), events);
      case 'trainer':
        return this.getTrainerFilterData(this.loc.translate('filter.trainers'), events);
      default:
        return [];
    }
  }

  private assignEvents() {
    this.$root.on('change', '[data-filter]', this.filterEvents.bind(this));
  }

  /**
   * Filters the events in the table
   * @param e {Event}
   * @public
   */
  public filterEvents(e?: Event) {
    let events = this.$root.find('[data-event-obj]').hide();
    this.$root.find('[data-filter]').each((index, el) => {
      const filterName = $(el).data('name');
      const value = $(el).val();
      const filter = (filterName === 'type' || filterName === 'location' || filterName === 'category') ?
        `[data-event-${filterName}="${value}"]` :
        `[data-event-${filterName}*="${value}"]`;
      this.deletePath(`${filterName}`);
      if (value !== 'all') {
        this.updatePath(`${filterName}`, `${value}`);
        events = events.filter(filter);
      }
    });
    if (events.length) {
      this.$root.find('[data-empty-list]').hide();
      events.show();
    } else {
      this.$root.find('[data-empty-list]').show();
    }
  }

  private getLanguageFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const languages = [];
    for (const event of events) {
      const eventLanguages = event.language.spoken;
      for (const eventLanguage of eventLanguages) {
        const languageName = this.loc.translate(`language.${eventLanguage}`);
        const selected = this.parseSearchPath('language', eventLanguage);
        const language = new FilterValue(languageName, eventLanguage, selected);
        languages.push(language);
      }
    }
    return this.getFilterData(defaultName, languages);
  }

  private getLocationFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const self = this;
    const unfiltered = events.map((event) => {
      const countryCode = event.location.countryCode;
      const countryName = self.loc.translate(`country.${countryCode}`);
      const selected = this.parseSearchPath('location', countryCode);
      return new FilterValue(countryName, event.location.countryCode, selected);
    });

    return this.getFilterData(defaultName, unfiltered);
  }

  private getTrainerFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const trainers: FilterValue[] = [];
    for (const event of events) {
      const eventTrainers = event.trainers;
      for (const eventTrainer of eventTrainers) {
        const trainerName = `${eventTrainer.firstName} ${eventTrainer.lastName}`;
        const selected = this.parseSearchPath('trainers', trainerName);
        const trainer = new FilterValue(trainerName, trainerName, selected);
        trainers.push(trainer);
      }
    }
    return this.getFilterData(defaultName, trainers);
  }

  private getCategoryFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const unfiltered = events.filter((event) => event.category !== undefined)
      .map((event) => {
        if (event.category) {
          const selected = this.parseSearchPath('category', event.category.id.toString());
          return new FilterValue(event.category.name, event.category.id.toString(), selected);
        } else {
          return new FilterValue('', '');
        }
      });
    return this.getFilterData(defaultName, unfiltered);
  }

  private getTypeFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const unfiltered = events.map((event) => {
      const selected = this.parseSearchPath('type', event.type.id.toString());
      return new FilterValue(event.type.name, event.type.id.toString(), selected);
    });
    return this.getFilterData(defaultName, unfiltered);
  }

  private updatePath(key: string, value: string): void {
    if (history.pushState) {
      const newUrl = this.generateUrl();
      newUrl.searchParams.append(key, value);
      const urls = `${newUrl.protocol}//${newUrl.host}${newUrl.pathname}${newUrl.search}`;
      window.history.pushState({path: urls},'', urls);
    }
  }

  private deletePath(key: string): void {
    if (history.pushState) {
      const newUrl = this.generateUrl();
      newUrl.searchParams.delete(key);
      const urls = `${newUrl.protocol}//${newUrl.host}${newUrl.pathname}${newUrl.search}`;
      window.history.pushState({path: urls},'', urls);
    }
  }

  private generateUrl(): any {
    const {
      location,
    } = window;
    const path: string = location.protocol + '//' + location.host + location.pathname + location.search;
    return new URL(path);
  }

  private parseSearchPath(type: string, value: string): boolean {
    const createURL = this.generateUrl();
    const findValue = createURL.searchParams.getAll(type);
    return findValue[0] === value;
  }
}
