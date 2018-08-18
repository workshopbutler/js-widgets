import TiledScheduleTmpl from './templates/eventList.njk';
import TableScheduleTmpl from './templates/eventTable.njk';
import EventDetailsTmpl from './templates/eventPage.njk';
import RegistrationFormTmpl from './templates/registrationPage.njk';
import SidebarTmpl from './templates/sidebarEventList.njk';
import TrainerListTmpl from './templates/trainerList.njk';
import TrainerProfileTmpl from './templates/trainerPage.njk';
import {ITemplate, ITemplates} from "./interfaces/ITemplates";

class Template implements ITemplate {
    constructor(readonly tmpl: any) { }

    render(data: any) {
        return this.tmpl.render(data);
    }
}

/**
 * Default templates, created and supported by Workshop Butler
 */
export default class DefaultTemplates implements ITemplates {
    schedule: Template;
    readonly eventPage: Template;
    readonly trainerList: Template;
    readonly trainerProfile: Template;
    readonly registrationPage: Template;
    readonly sidebarEventList: Template;

    constructor() {
        this.schedule = new Template(TiledScheduleTmpl);
        this.eventPage = new Template(EventDetailsTmpl);
        this.trainerList = new Template(TrainerListTmpl);
        this.trainerProfile = new Template(TrainerProfileTmpl);
        this.registrationPage = new Template(RegistrationFormTmpl);
        this.sidebarEventList = new Template(SidebarTmpl);
    }

    /**
     * Updates the layout of the event schedule
     * @param table {boolean} True if the layout should be 'table'
     */
    changeScheduleLayout(table: boolean) {
        if (table) {
            this.schedule = new Template(TableScheduleTmpl);
        } else {
            this.schedule = new Template(TiledScheduleTmpl);
        }
    }
}
