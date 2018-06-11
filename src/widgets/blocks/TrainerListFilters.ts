import {getCountryName} from "../../common/helpers/_countries";
import {FilterValue} from "./Filter";
import Trainer from "../../models/Trainer";
import {ListFilters} from "./ListFilters";

/**
 * Manages the logic for trainer list filters
 */
export default class TrainerListFilters extends ListFilters<Trainer> {
    private $root: JQuery;

    /**
     * Creates event list filters
     * @param selector {HTMLElement} JQuery selector
     * @param visibleFilters {array} Configuration options
     */
    constructor(selector: HTMLElement, visibleFilters: any[]) {
        super();
        this.$root = $(selector);
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
                return this.getLanguageFilterData("All languages", trainers);
            case 'location':
                return this.getLocationFilterData("All locations", trainers);
            case 'trainer':
                return this.getTrainerFilterData("All trainers", trainers);
            default:
                return []
        }
    }

    private getLanguageFilterData(defaultName: string, trainers: Trainer[]) {
        const languages = [];
        for(let i = 0; i < trainers.length; i++) {
            const trainerLanguages = trainers[i].languages;
            for(let j = 0; j < trainerLanguages.length; j++) {
                let language = {
                    value: trainerLanguages[j],
                    name: trainerLanguages[j]
                };
                languages.push(language)
            }
        }
        return this.getFilterData(defaultName, languages);
    }

    private getLocationFilterData(defaultName: string, trainers: Trainer[]) {
        const unfiltered = trainers.map(function(trainer) {
            return { value: getCountryName(trainer.country), name: getCountryName(trainer.country) }
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
