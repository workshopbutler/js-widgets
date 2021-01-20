import ScheduleFormatter from '../formatters/plain/ScheduleFormatter';
import IPlainObject from '../interfaces/IPlainObject';
import DefaultSettings from '../widgets/config/DefaultSettings';
import Category from './workshop/Category';
import EventState from './workshop/EventState';
import Form from './form/Form';
import FreeTicketType from './workshop/FreeTicketType';
import Language from './workshop/Language';
import Location from './workshop/Location';
import RegistrationPage from './workshop/RegistrationPage';
import Schedule from './Schedule';
import Trainer from './Trainer';
import Type from './workshop/Type';
import CoverImage from './workshop/CoverImage';
import PaidTickets from './workshop/PaidTickets';
import Payment from './workshop/Payment';
import Testimonial from './Testimonial';

export default class Event {

  static fromJSON(json: IPlainObject, options: IPlainObject): Event {
    const schedule = new Schedule(json.schedule);
    const location = Location.fromJSON(json.location);
    const language = Language.fromJSON(json.language);
    const trainers = Event.getTrainers(json, options);
    const tickets = Event.getTickets(json.free, json.tickets, schedule.defaultTimezone());
    const registrationPage = new RegistrationPage(json.registration_page, options.registrationPageUrl, json.hashed_id);
    const type = json.type ? (typeof json.type === 'number' ? json.type : new Type(json.type)) : undefined;
    const coverImage = CoverImage.fromJSON(json.cover_image);
    const category = json.category ? new Category(json.category) : undefined;
    const payment = Payment.fromJSON(json.card_payment);
    const featured = !!json.featured;
    const testimonials = json.testimonials?.map((testimonial: IPlainObject) => Testimonial.fromJSON(testimonial)) || [];
    return new Event(options, json.id, json.hashed_id, json.title, schedule, language, location,
      registrationPage, trainers, testimonials,tickets, json.confirmed, json.free, json.private, json.sold_out, json.description,
      type, category, coverImage, payment, featured, json.form
    );
  }

  private static getTickets(free: boolean,
                            tickets: IPlainObject,
                            timezone: string): FreeTicketType | PaidTickets | undefined {
    if (tickets.free || tickets.paid) {
      return free ?
        FreeTicketType.fromJSON(tickets.free) :
        PaidTickets.fromJSON(tickets.paid, timezone);
    } else {
      return undefined;
    }
  }

  private static getTrainers(attrs: any, options: any): Trainer[] {
    const trainers: any[] = attrs.trainers;
    if (trainers) {
      return trainers.map(trainer => Trainer.fromJSON(trainer, options));
    } else {
      return [];
    }
  }

  readonly private: boolean;
  readonly url: string;
  readonly registrationForm?: Form;
  readonly state: EventState;

  constructor(options: IPlainObject,
              readonly id: number,
              readonly hashedId: string,
              public title: string,
              public schedule: Schedule,
              public language: Language,
              public location: Location,
              public registrationPage: RegistrationPage,
              public trainers: Trainer[] = [],
              readonly testimonials: Testimonial[] = [], // list of testimonials for the event
              public tickets?: FreeTicketType | PaidTickets,
              public confirmed = false,
              public free = false,
              privat = false,
              public soldOut = false,
              public description?: string,
              public type?: Type | number,
              public category?: Category,
              public coverImage: CoverImage = new CoverImage(),
              public payment?: Payment,
              public featured: boolean = false,
              formJSON?: IPlainObject) {

    this.registrationForm = Form.fromJSON(formJSON, this);
    this.private = privat;
    this.url = this.buildUrl(options);
    this.state = new EventState(this);
  }

  /**
   * Returns the list of trainer's names
   */
  nameOfTrainers(): string[] {
    return this.trainers.map(trainer => trainer.fullName());
  }

  withTickets(): boolean {
    if (this.tickets instanceof FreeTicketType) {
      return !this.tickets.withUnlimitedSeats();
    }
    if (this.tickets instanceof PaidTickets) {
      return this.tickets.types.length > 0;
    }
    return false;
  }

  protected buildUrl(options: IPlainObject): string {
    const pattern = options.eventPagePattern ? options.eventPagePattern : DefaultSettings.eventPagePattern;
    const categoryName = this.category ? this.category.name : '';
    const dates = this.replaceSpaces(ScheduleFormatter.format('en', this.schedule, 'interval'));
    const queryParams = pattern
      .replace('{{id}}', this.hashedId)
      .replace('{{title}}', this.replaceSpaces(this.title))
      .replace('{{dates}}', dates)
      .replace('{{category}}', this.replaceSpaces(categoryName));
    return encodeURI(`${options.eventPageUrl}?${queryParams}`);
  }

  protected replaceSpaces(value: string): string {
    const regex = /\ /gi;
    return value.replace(regex, '_');
  }

}
