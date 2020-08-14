import DefaultTemplate from './DefaultTemplate';
import AttendeesPageTmpl from './attendees/page.njk';
import AttendeesListTmpl from './attendees/list.njk';
import TiledScheduleTmpl from './eventList.njk';
import EventDetailsTmpl from './eventPage.njk';
import TableScheduleTmpl from './eventTable.njk';
import {ITemplates} from './ITemplates';
import RegistrationFormTmpl from './registrationPage.njk';
import SidebarTmpl from './sidebarEventList.njk';
import TestimonialListTmpl from './testimonialList.njk';
import TrainerListTmpl from './trainerList.njk';
import TrainerProfileTmpl from './trainerPage.njk';
import NextEventTmpl from './nextEvent.njk';
import PromoTmpl from './promo.njk';

/**
 * Default theme's templates, created and supported by Workshop Butler
 */
export default class DefaultTemplates implements ITemplates {
  schedule: DefaultTemplate;
  readonly attendeesPage: DefaultTemplate;
  readonly attendeesList: DefaultTemplate;
  readonly eventPage: DefaultTemplate;
  readonly testimonialList: DefaultTemplate;
  readonly trainerList: DefaultTemplate;
  readonly trainerProfile: DefaultTemplate;
  readonly registrationPage: DefaultTemplate;
  readonly sidebarEventList: DefaultTemplate;
  readonly nextEvent: DefaultTemplate;
  readonly promo: DefaultTemplate;

  constructor() {
    this.schedule = new DefaultTemplate(TiledScheduleTmpl);
    this.testimonialList = new DefaultTemplate(TestimonialListTmpl);
    this.eventPage = new DefaultTemplate(EventDetailsTmpl);
    this.trainerList = new DefaultTemplate(TrainerListTmpl);
    this.trainerProfile = new DefaultTemplate(TrainerProfileTmpl);
    this.registrationPage = new DefaultTemplate(RegistrationFormTmpl);
    this.sidebarEventList = new DefaultTemplate(SidebarTmpl);
    this.attendeesPage = new DefaultTemplate(AttendeesPageTmpl);
    this.attendeesList = new DefaultTemplate(AttendeesListTmpl);
    this.nextEvent = new DefaultTemplate(NextEventTmpl);
    this.promo = new DefaultTemplate(PromoTmpl);
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
