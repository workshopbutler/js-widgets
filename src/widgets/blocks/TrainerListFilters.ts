import {FilterValue} from "./Filter";
import Trainer from "../../models/Trainer";
import {ListFilters} from "./ListFilters";
import Localisation from "../../utils/Localisation";

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

    private assignEvents() {
        this.$root.on('change', '[data-filter]', this.filterEvents.bind(this))
    }

    /**
     * Filters the trainers in the table
     * @param e {Event}
     * @private
     */
    private filterEvents(e: Event) {
        let trainers = this.$root.find('[data-trainer-obj]').hide();
        this.$root.find('[data-filter]').each(function (index, el) {
            const filterName = $(el).data('name');
            const value = $(el).val();
            const filter = filterName === 'location' ?
                `[data-trainer-${filterName}="${value}"]` :
                `[data-trainer-${filterName}*="${value}"]`;
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


    protected getFilterValues(name: string, trainers: Trainer[]): FilterValue[] {
        switch(name) {
            case 'language':
                return this.getLanguageFilterData(this.loc.translate('filter.languages'), trainers);
            case 'location':
                return this.getLocationFilterData(this.loc.translate('filter.locations'), trainers);
            case 'trainer':
                return this.getTrainerFilterData(this.loc.translate('filter.trainers'), trainers);
            default:
                return []
        }
    }

    private getLanguageFilterData(defaultName: string, trainers: Trainer[]) {
        const languages = [];
        for(let i = 0; i < trainers.length; i++) {
            const trainerLanguages = trainers[i].languages;
            for(let j = 0; j < trainerLanguages.length; j++) {
                const languageName = this.loc.translate(`language.${trainerLanguages[j]}`);
                let language = new FilterValue(languageName, trainerLanguages[j]);
                languages.push(language)
            }
        }
        return this.getFilterData(defaultName, languages);
    }

    private getLocationFilterData(defaultName: string, trainers: Trainer[]) {
        const self = this;
        const unfiltered = trainers.map(function(trainer) {
            const countryName = self.loc.translate(`country.${trainer.country}`);
            return new FilterValue(countryName, trainer.country);
        });
        return this.getFilterData(defaultName, unfiltered);
    }

    private getTrainerFilterData(defaultName: string, trainers: Trainer[]) {
        const preparedData = trainers.map(trainer => {
            const trainerName = `${trainer.firstName} ${trainer.lastName}`;
            return {
                value: trainerName,
                name: trainerName
            };
        });
        return this.getFilterData(defaultName, preparedData);
    }

}
