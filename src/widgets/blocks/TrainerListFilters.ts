import Trainer from '../../models/Trainer';
import Localisation from '../../utils/Localisation';
import {FilterValue} from './Filter';
import {ListFilters} from './ListFilters';

/**
 * Manages the logic for trainer list filters
 */
export default class TrainerListFilters extends ListFilters<Trainer> {
  private $root: JQuery;
  private readonly loc: Localisation;

  /**
   * Creates event list filters
   * @param selector {HTMLElement} JQuery selector
   * @param loc {Localisation} Localisation instance
   * @param visibleFilters {array} Configuration config
   */
  constructor(selector: HTMLElement, loc: Localisation, visibleFilters: any[]) {
    super();
    this.$root = $(selector);
    this.loc = loc;
    this.filters = visibleFilters;
    this.assignEvents();
  }

  protected getFilterValues(name: string, trainers: Trainer[]): FilterValue[] {
    switch (name) {
      case 'language':
        return this.getLanguageFilterData(this.loc.translate('filter.languages'), trainers);
      case 'location':
        return this.getLocationFilterData(this.loc.translate('filter.locations'), trainers);
      case 'trainer':
        return this.getTrainerFilterData(this.loc.translate('filter.trainers'), trainers);
      case 'rating':
        return this.getRatingFilterData(this.loc.translate('filter.rating'), trainers);
      default:
        return [];
    }
  }

  private assignEvents() {
    this.$root.on('change', '[data-filter]', this.filterEvents.bind(this));
  }

  /**
   * Filters the trainers in the table
   * @param e {Event}
   * @private
   */
  private filterEvents(e: Event) {
    let trainers = this.$root.find('[data-trainer-obj]').hide();
    this.$root.find('[data-filter]').each((index, el) => {
      const filterName = $(el).data('name');
      const value = $(el).val();
      const filter = this.getFilter(filterName, value);
      if (value !== 'all') {
        trainers = trainers.filter(filter);
      }
    });
    if (trainers.length) {
      this.$root.find('[data-empty-list]').hide();
      trainers.show();
    } else {
      this.$root.find('[data-empty-list]').show();
    }
  }

  /**
   * Returns a correct filter based on its name
   * @param name {string} Name of the filter
   * @param value {any} Value of the filter
   */
  private getFilter(name: string, value: any) {
    const ratingFunction = (index: number, el: HTMLElement) => {
      return $(el).data('trainer-rating') > value;
    };
    switch (name) {
      case 'location': return `[data-trainer-${name}="${value}"]`;
      case 'rating': return ratingFunction;
      default: return `[data-trainer-${name}*="${value}"]`;
    }
  }

  /**
   * Returns the data for rating filter
   * @param defaultName {string} Name of the default filter
   * @param trainers {Trainer[]} List of trainers
   */
  private getRatingFilterData(defaultName: string, trainers: Trainer[]) {
    const self = this;
    const ratings = [
      {name: 'one', value: 1},
      {name: 'two', value: 2},
      {name: 'three', value: 3},
      {name: 'four', value: 4},
      {name: 'five', value: 5},
      {name: 'six', value: 6},
      {name: 'seven', value: 7},
      {name: 'eight', value: 8},
      {name: 'nine', value: 9},
    ];
    const unfiltered = ratings.map((rating) => {
      const value = Math.floor(rating.value);
      const name = self.loc.translate(`rating.${rating.name}`);
      return new FilterValue(name, value);
    });
    return this.getFilterData(defaultName, unfiltered);
  }

  private getLanguageFilterData(defaultName: string, trainers: Trainer[]) {
    const languages = [];
    for (const trainer of trainers) {
      for (const languageId of trainer.languages) {
        const languageName = this.loc.translate(`language.${languageId}`);
        const language = new FilterValue(languageName, languageId);
        languages.push(language);
      }
    }
    return this.getFilterData(defaultName, languages);
  }

  private getLocationFilterData(defaultName: string, trainers: Trainer[]) {
    const self = this;
    const unfiltered = trainers.map((trainer) => {
      const countryName = self.loc.translate(`country.${trainer.country}`);
      return new FilterValue(countryName, trainer.country);
    });
    return this.getFilterData(defaultName, unfiltered);
  }

  private getTrainerFilterData(defaultName: string, trainers: Trainer[]) {
    const preparedData = trainers.map((trainer) => {
      const trainerName = `${trainer.firstName} ${trainer.lastName}`;
      return {
        name: trainerName,
        value: trainerName,
      };
    });
    return this.getFilterData(defaultName, preparedData);
  }

}
