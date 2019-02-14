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
      case 'badge':
        return this.getBadgeFilterData(this.loc.translate('filter.badge'), trainers);
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
    const experienceFunction = (index: number, el: HTMLElement) => {
      const exp = $(el).data('trainer-exp');
      switch (value) {
        case 'one': return exp < 1;
        case 'three': return exp <= 3 && exp >= 1;
        case 'five': return exp > 3 && exp <= 5;
        case 'seven': return exp > 5 && exp <= 7;
        case 'more': return exp > 7;
        default: return false;
      }
    };
    switch (name) {
      case 'experience': return experienceFunction;
      case 'rating': return ratingFunction;
      default: return `[data-trainer-${name}*="${value}"]`;
    }
  }

  /**
   * Returns the data for experience filter
   * @param defaultName {string} Name of the default filter
   * @param trainers {Trainer[]} List of trainers
   */
  private getExperienceFilterData(defaultName: string, trainers: Trainer[]) {
    const self = this;
    const experience = ['one', 'three', 'five', 'seven', 'more'];
    const unfiltered = experience.map((value) => {
      const name = self.loc.translate(`experience.${value}`);
      return new FilterValue(name, value);
    });
    return this.getFilterData(defaultName, unfiltered);
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
      const name = self.loc.translate(`rating.${rating.name}`);
      return new FilterValue(name, rating.value);
    });
    return this.getFilterData(defaultName, unfiltered);
  }

  /**
   * Returns the data for badge filter
   * @param defaultName {string} Name of the default filter
   * @param trainers {Trainer[]} List of trianers
   */
  private getBadgeFilterData(defaultName: string, trainers: Trainer[]) {
    const badges = [];
    for (const trainer of trainers) {
      for (const badge of trainer.badges) {
        badges.push(new FilterValue(badge.name, badge.name));
      }
    }
    return this.getFilterData(defaultName, badges);
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
    const countries = [];
    const self = this;
    for (const trainer of trainers) {
      for (const countryCode of trainer.worksIn) {
        const countryName = this.loc.translate(`country.${countryCode}`);
        const country = new FilterValue(countryName, countryCode);
        countries.push(country);
      }
    }
    return this.getFilterData(defaultName, countries);
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
