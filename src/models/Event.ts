import ScheduleFormatter from '../formatters/plain/ScheduleFormatter';
import IPlainObject from '../interfaces/IPlainObject';
import DefaultSettings from '../widgets/config/DefaultSettings';
import Category from './workshop/Category';
import EventState from './workshop/EventState';
import Form from './form/Form';
import FreeTicketType from './workshop/FreeTicketType';
import Language from './workshop/Language';
import Location from './workshop/Location';
import PaidTicketType from './workshop/PaidTicketType';
import RegistrationPage from './workshop/RegistrationPage';
import Schedule from './Schedule';
import Tickets from './workshop/Tickets';
import Trainer from './Trainer';
import Type from './workshop/Type';
import CoverImage from './workshop/CoverImage';

export default class Event {
  readonly id: number;
  readonly hashedId: string;
  readonly type: Type;
  readonly title: string;
  readonly language: Language;
  readonly confirmed: boolean;
  readonly private: boolean;
  readonly free: boolean;
  readonly soldOut: boolean;
  readonly url: string;
  readonly registrationPage: RegistrationPage;
  readonly tickets: Tickets | null;
  readonly trainers: Trainer[];
  readonly description: string;
  readonly schedule: Schedule;
  readonly location: Location;
  readonly registrationForm?: Form;
  readonly state: EventState;

  /**
   * Cover image of the workshop
   */
  readonly coverImage: CoverImage;

  /**
   * Category of the event
   */
  readonly category?: Category;

  /**
   * @param json {object}
   * @param options {object}
   */
  constructor(json: IPlainObject, options: any) {
    this.id = json.id;
    this.hashedId = json.hashed_id;
    this.title = json.title;
    this.type = json.type ? new Type(json.type) : Type.empty();
    this.language = Language.fromJSON(json.language);
    this.confirmed = json.confirmed;
    this.free = json.free;
    this.private = json.private;
    this.description = json.description;
    this.soldOut = json.sold_out;
    this.schedule = new Schedule(json.schedule);
    this.location = Location.fromJSON(json.location);
    this.category = json.category ? new Category(json.category) : undefined;
    this.tickets = this.getTickets(this.free, json.tickets);
    this.url = this.buildUrl(options);
    this.registrationPage = new RegistrationPage(json.registration_page,
      options.registrationPageUrl, this.hashedId);
    this.registrationForm = Form.fromJSON(json.form, this);
    this.coverImage = CoverImage.fromJSON(json.cover_image);

    this.trainers = this.getTrainers(json, options);
    this.state = new EventState(this);
  }

  /**
   * Returns the list of trainer's names
   */
  nameOfTrainers(): string[] {
    return this.trainers.map((trainer) => trainer.fullName());
  }

  protected buildUrl(options: IPlainObject): string {
    const pattern = options.eventPagePattern ? options.eventPagePattern : DefaultSettings.eventPagePattern;
    const categoryName = this.category ? this.category.name : '';
    const dates = this.replaceSpaces(ScheduleFormatter.format('en', this.schedule, 'full_short'));
    const queryParams = pattern.replace('{{id}}', this.hashedId).
      replace('{{title}}', this.replaceSpaces(this.title)).
      replace('{{dates}}', dates).
      replace('{{category}}', this.replaceSpaces(categoryName));
    return encodeURI(`${options.eventPageUrl}?${queryParams}`);
  }

  protected replaceSpaces(value: string): string {
    const regex = /\ /gi;
    return value.replace(regex, '_');
  }

  private getTickets(free: boolean, tickets: IPlainObject): Tickets | null {
    if (tickets.free || tickets.paid) {
      return free ?
        new Tickets([], FreeTicketType.fromJSON(tickets.free)) :
        new Tickets(tickets.paid.map((ticket: IPlainObject) =>
            PaidTicketType.fromJSON(ticket, this.schedule.defaultTimezone()),
          ),
        );
    } else {
      return null;
    }
  }

  private getTrainers(attrs: any, options: any): Trainer[] {
    const trainers: any[] = attrs.trainers;
    if (trainers) {
      return trainers.map((trainer) => new Trainer(trainer, options));
    } else {
      return [];
    }
  }
}
