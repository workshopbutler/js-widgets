import {FilterValue} from "./Filter";
import Event from "../../models/Event";
import {ListFilters} from "./ListFilters";
import Localisation from "../../utils/Localisation";

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
                return this.getLanguageFilterData(this.loc.translate('filter.languages'), events);
            case 'type':
                return this.getTypeFilterData(this.loc.translate('filter.types'), events);
            case 'location':
                return this.getLocationFilterData(this.loc.translate('filter.locations'), events);
            case 'trainer':
                return this.getTrainerFilterData(this.loc.translate('filter.trainers'), events);
            default:
                return []
        }
    }

    private getLanguageFilterData(defaultName: string, events: Event[]): FilterValue[] {
        const languages = [];
        for(let i = 0; i < events.length; i++) {
            const eventLanguages = events[i].language.spoken;
            for(let j = 0; j < eventLanguages.length; j++) {
                const languageName = this.loc.translate(`language.${eventLanguages[j]}`);
                let language = new FilterValue(languageName, eventLanguages[j]);
                languages.push(language)
            }
        }
        return this.getFilterData(defaultName, languages);
    }

    private getLocationFilterData(defaultName: string, events: Event[]): FilterValue[] {
        const self = this;
        const unfiltered = events.map(function(event) {
            const countryName = self.loc.translate(`country.${event.location.countryCode}`);
            return new FilterValue(countryName, event.location.countryCode);
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
