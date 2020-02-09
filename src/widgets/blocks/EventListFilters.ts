import Event from '../../models/Event';
import Localisation from '../../utils/Localisation';
import FilterValue from './FilterValue';
import {ListFilters} from './ListFilters';
import {deleteQueryFromPath, hasValueInPath, updatePathWithQuery,} from '../../common/helpers/UrlParser';
import Type from '../../models/workshop/Type';

/**
 * Manages the logic for event list filters
 */
export default class EventListFilters extends ListFilters<Event> {
  protected root: JQuery<HTMLElement>;
  private readonly loc: Localisation;

  /**
   * Creates event list filters
   * @param selector {HTMLElement} JQuery selector
   * @param loc {Localisation} Localisation instance
   * @param visibleFilters {array} Configuration config
   */
  constructor(selector: HTMLElement, loc: Localisation, visibleFilters: string[]) {
    super();
    this.root = $(selector);
    this.loc = loc;
    this.filters = visibleFilters;
    this.assignEvents();
  }

  /**
   * Filters the events in the table
   */
  filterEvents() {
    let events = this.root.find('[data-event-obj]').hide();
    this.root.find('[data-filter]').each((index, el) => {
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
      this.root.find('[data-empty-list]').hide();
      events.show();
    } else {
      this.root.find('[data-empty-list]').show();
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
    this.root.on('change', '[data-filter]', this.filterEvents.bind(this));
  }

  private getLanguageFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const languages = [];
    for (const event of events) {
      const eventLanguages = event.language.spoken;
      for (const eventLanguage of eventLanguages) {
        const languageName = this.loc.translate(`language.${eventLanguage}`);
        const selected = hasValueInPath('language', eventLanguage);
        const language = new FilterValue(languageName, eventLanguage, selected);
        languages.push(language);
      }
    }
    return this.getFilterData(defaultName, languages);
  }

  private getLocationFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const unfiltered = events.map(event => {
      const countryCode = event.location.countryCode;
      const countryName = this.loc.translate(`country.${countryCode}`);
      const selected = hasValueInPath('location', countryCode);
      return new FilterValue(countryName, event.location.countryCode, selected);
    });

    return this.getFilterData(defaultName, unfiltered);
  }

  private getTrainerFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const trainers: FilterValue[] = [];
    for (const event of events) {
      for (const eventTrainer of event.trainers) {
        const trainerName = `${eventTrainer.firstName} ${eventTrainer.lastName}`;
        const selected = hasValueInPath('trainer', trainerName);
        const trainer = new FilterValue(trainerName, trainerName, selected);
        trainers.push(trainer);
      }
    }
    return this.getFilterData(defaultName, trainers);
  }

  private getCategoryFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const unfiltered = events.filter(event => event.category !== undefined)
      .map(event => {
        if (event.category) {
          const categoryId = event.category.id.toString();
          const selected = hasValueInPath('category', categoryId);
          return new FilterValue(event.category.name, categoryId, selected);
        } else {
          return new FilterValue('', '');
        }
      });
    return this.getFilterData(defaultName, unfiltered);
  }

  private getTypeFilterData(defaultName: string, events: Event[]): FilterValue[] {
    const unfiltered = events.map(event => {
      if (event.type && event.type instanceof Type) {
        const typeId = event.type.id.toString();
        const selected = hasValueInPath('type', typeId);
        return new FilterValue(event.type.name, typeId, selected);
      } else {
        return undefined;
      }
    }).filter((value: FilterValue | undefined) => value !== undefined);
    return this.getFilterData(defaultName, unfiltered as FilterValue[]);
  }
}
