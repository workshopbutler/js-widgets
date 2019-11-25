import Event from '../../models/Event';
import Localisation from '../../utils/Localisation';
import FilterValue from './FilterValue';
import {ListFilters} from './ListFilters';
import {
  deleteQueryFromPath,
  isHasValueInPath,
  updatePathWithQuery,
} from '../../common/helpers/UrlParser';

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

  /**
   * Filters the events in the table
   * @param e {Event}
   */
  filterEvents(e?: Event) {
    let events = this.$root.find('[data-event-obj]').hide();
    this.$root.find('[data-filter]').each((index, el) => {
      const filterName = $(el).data('name');
      const value = $(el).val();
      const filter = (filterName === 'type' || filterName === 'location' || filterName === 'category') ?
        `[data-event-${filterName}="${value}"]` :
        `[data-event-${filterName}*="${value}"]`;
      deleteQueryFromPath(`${filterName}`);
      if (value !== 'all') {
        updatePathWithQuery(`${filterName}`, `${value}`);
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

  private getLanguageFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const languages = [];
    for (const event of events) {
      const eventLanguages = event.language.spoken;
      for (const eventLanguage of eventLanguages) {
        const languageName = this.loc.translate(`language.${eventLanguage}`);
        const selected = isHasValueInPath('language', eventLanguage);
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
      const selected = isHasValueInPath('location', countryCode);
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
        const selected = isHasValueInPath('trainers', trainerName);
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
          const categoryId = event.category.id.toString();
          const selected = isHasValueInPath('category', categoryId);
          return new FilterValue(event.category.name, categoryId, selected);
        } else {
          return new FilterValue('', '');
        }
      });
    return this.getFilterData(defaultName, unfiltered);
  }

  private getTypeFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const unfiltered = events.map((event) => {
      const typeId = event.type.id.toString();
      const selected = isHasValueInPath('type', typeId);
      return new FilterValue(event.type.name, typeId, selected);
    });
    return this.getFilterData(defaultName, unfiltered);
  }
}
