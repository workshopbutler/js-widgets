import {getCountryName} from "../../common/helpers/_countries";
import {FilterValue} from "./Filter";
import Event from "../../models/Event";
import {ListFilters} from "./ListFilters";

/**
 * Manages the logic for event list filters
 */
export default class EventListFilters extends ListFilters<Event> {
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
     * Filters the events in the table
     * @param e {Event}
     * @private
     */
    private filterEvents(e: Event) {
        let events = this.$root.find('[data-event-obj]').hide();
        this.$root.find('[data-filter]').each(function (index, el) {
            const filterName = $(el).data('name');
            const value = $(el).val();
            const filter = (filterName === 'type' || filterName === 'location') ?
                `[data-event-${filterName}="${value}"]` :
                `[data-event-${filterName}*="${value}"]`;
            if (value !== 'all') {
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
        switch(name) {
            case 'language':
                return this.getLanguageFilterData("All languages", events);
            case 'type':
                return this.getTypeFilterData("All types", events);
            case 'location':
                return this.getLocationFilterData("All locations", events);
            case 'trainer':
                return this.getTrainerFilterData("All trainers", events);
            default:
                return []
        }
    }

    private getLanguageFilterData(defaultName: string, events: Event[]): FilterValue[] {
        const languages = [];
        for(let i = 0; i < events.length; i++) {
            const eventLanguages = events[i].spokenLanguages;
            for(let j = 0; j < eventLanguages.length; j++) {
                let language = new FilterValue(eventLanguages[j], eventLanguages[j]);
                languages.push(language)
            }
        }
        return this.getFilterData(defaultName, languages);
    }

    private getLocationFilterData(defaultName: string, events: Event[]): FilterValue[] {
        const unfiltered = events.map(function(event) {
            return new FilterValue(getCountryName(event.country), event.country);
        });
        return this.getFilterData(defaultName, unfiltered);
    }

    private getTrainerFilterData(defaultName: string, events: Event[]): FilterValue[] {
        const trainers: FilterValue[] = [];
        for(let i = 0; i < events.length; i++) {
            const eventTrainers = events[i].trainers;
            for(let j = 0; j < eventTrainers.length; j++) {
                const trainerName = `${eventTrainers[j].firstName} ${eventTrainers[j].lastName}`;
                let trainer = new FilterValue(trainerName, trainerName);
                trainers.push(trainer)
            }
        }
        return this.getFilterData(defaultName, trainers);
    }

    private getTypeFilterData(defaultName: string, events: Event[]): FilterValue[] {
        const unfiltered = events.map(function(event) {
            return new FilterValue(event.type.name, event.type.id)
        });
        return this.getFilterData(defaultName, unfiltered);
    }

}
