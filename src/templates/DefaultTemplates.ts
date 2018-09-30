import DefaultTemplate from './DefaultTemplate';
import {ITemplates} from './ITemplates';
import TestimonialListTmpl from './testimonialList.njk';
import TiledScheduleTmpl from './eventList.njk';
import EventDetailsTmpl from './eventPage.njk';
import TableScheduleTmpl from './eventTable.njk';
import RegistrationFormTmpl from './registrationPage.njk';
import SidebarTmpl from './sidebarEventList.njk';
import TrainerListTmpl from './trainerList.njk';
import TrainerProfileTmpl from './trainerPage.njk';

/**
 * Default theme's templates, created and supported by Workshop Butler
 */
export default class DefaultTemplates implements ITemplates {
    schedule: DefaultTemplate;
    readonly eventPage: DefaultTemplate;
    readonly testimonialList: DefaultTemplate;
    readonly trainerList: DefaultTemplate;
    readonly trainerProfile: DefaultTemplate;
    readonly registrationPage: DefaultTemplate;
    readonly sidebarEventList: DefaultTemplate;

    constructor() {
        this.schedule = new DefaultTemplate(TiledScheduleTmpl);
        this.testimonialList = new DefaultTemplate(TestimonialListTmpl);
        this.eventPage = new DefaultTemplate(EventDetailsTmpl);
        this.trainerList = new DefaultTemplate(TrainerListTmpl);
        this.trainerProfile = new DefaultTemplate(TrainerProfileTmpl);
        this.registrationPage = new DefaultTemplate(RegistrationFormTmpl);
        this.sidebarEventList = new DefaultTemplate(SidebarTmpl);
    }

    /**
     * Updates the layout of the event schedule
     * @param table {boolean} True if the layout should be 'table'
     */
    changeScheduleLayout(table: boolean) {
        if (table) {
            this.schedule = new DefaultTemplate(TableScheduleTmpl);
        } else {
            this.schedule = new DefaultTemplate(TiledScheduleTmpl);
        }
    }
}
