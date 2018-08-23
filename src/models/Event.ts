import FreeTicketType from "./FreeTicketType";
import PaidTicketType from "./PaidTicketType";
import Tickets from "./Tickets";
import RegistrationPage from "./RegistrationPage";
import Type from "./Type";
import Trainer from "./Trainer";
import Schedule from "./Schedule";
import Location from "./Location";
import Language from "./Language";
import EventState from "./EventState";
import Form from "./form/Form";

export default class Event {
    readonly id: number;
    readonly hashedId: string;
    readonly type: Type;
    readonly title: string;
    readonly language: Language;
    readonly rating: number;
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
     * @param attrs {object}
     * @param options {object}
     */
    constructor(attrs: any, options: any) {
        this.id = attrs.id;
        this.hashedId = attrs.hashed_id;
        this.title = attrs.title;
        this.type = attrs.type ? new Type(attrs.type) : Type.empty();
        this.language = new Language(attrs.spoken_languages, attrs.materials_language);
        this.rating = attrs.rating;
        this.confirmed = attrs.confirmed;
        this.free = attrs.free;
        this.private = attrs.private;
        this.description = attrs.description;
        this.soldOut = attrs.sold_out;
        this.schedule = new Schedule(attrs.schedule);
        this.location = new Location(attrs.location);

        this.url = `${options.eventPageUrl}?id=${this.hashedId}`;
        this.tickets = this.getTickets(this.free, attrs.free_ticket_type, attrs.paid_ticket_types);
        this.registrationPage = new RegistrationPage(attrs.registration_page, options.registrationPageUrl, this.hashedId);

        this.registrationForm = attrs.registration_form ?
            new Form(attrs.instructions, attrs.registration_form, this) :
            undefined;

        this.trainers = this.getTrainers(attrs, options);
        this.state = new EventState(this);
    }

    private getTickets(free: boolean, freeTicketType: any, paidTicketTypes: any[]): Tickets | null {
        if (freeTicketType || paidTicketTypes) {
            return free ?
                new Tickets([], new FreeTicketType(freeTicketType)) :
                new Tickets(paidTicketTypes.map(type =>
                        new PaidTicketType(type, this.schedule.defaultTimezone())
                    )
                );
        } else {
            return null;
        }
    }

    private getTrainers(attrs: any, options: any): Trainer[] {
        const trainers: any[] = attrs.facilitators;
        if (trainers) {
            return trainers.map(trainer => new Trainer(trainer, options));
        } else {
            return [];
        }
    }
}
