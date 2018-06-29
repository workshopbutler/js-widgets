import FreeTicketType from "./FreeTicketType";
import PaidTicketType from "./PaidTicketType";
import Tickets from "./Tickets";
import Registration from "../widgets/models/_registration";
import Type from "./Type";
import Trainer from "./Trainer";
import {formatPrice} from "../common/Price";
import Schedule from "./Schedule";
import Location from "./Location";
import {DateTime} from "luxon";

export default class Event {
    options: any;
    readonly id: number;
    readonly hashedId: string;
    readonly type: Type;
    readonly title: string;
    readonly spokenLanguages: string[];
    readonly materialsLanguage: string;
    readonly rating: number;
    readonly confirmed: boolean;
    readonly private: boolean;
    readonly free: boolean;
    readonly soldOut: boolean;
    readonly url: string;
    readonly registration: any;
    readonly tickets: Tickets | null;
    readonly trainers: Trainer[];
    readonly description: string;
    readonly schedule: Schedule;
    readonly location: Location;
    readonly instructions: string;
    readonly registrationForm: any;

    /**
     * @param attrs {object}
     * @param options {object}
     */
    constructor(attrs: any, options: any) {
        this.id = attrs.id;
        this.hashedId = attrs.hashed_id;
        this.title = attrs.title;
        this.type = attrs.type ? new Type(attrs.type) : Type.empty();
        this.spokenLanguages = attrs.spoken_languages;
        this.materialsLanguage = attrs.materials_language;
        this.rating = attrs.rating;
        this.confirmed = attrs.confirmed;
        this.free = attrs.free;
        this.private = attrs.private;
        this.description = attrs.description;
        this.soldOut = attrs.sold_out;
        this.schedule = new Schedule(attrs.schedule);
        this.location = new Location(attrs.location);

        this.options = options;

        this.url = `${options.eventPageUrl}?id=${this.hashedId}`;
        this.registration = new Registration(attrs, options.registrationPageUrl);
        this.tickets = this.getTickets(this.free, attrs.free_ticket_type, attrs.paid_ticket_types);

        this.instructions = attrs.instructions;
        this.registrationForm = this.getRegistrationForm(this.tickets, attrs.registration_form);

        this.trainers = this.getTrainers(attrs, options);
    }

    /**
     * Adds ticket field if the paid tickets exist
     * @param {Tickets | null} tickets
     * @param {any} form Registration form
     * @return {any}
     */
    private getRegistrationForm(tickets: Tickets | null, form: any): any {
        if (tickets && tickets.paid.length > 0 && form) {
            for (let section of form) {
                const fields: any[] = section.fields;
                for (let field of fields) {
                    if (field.type !== "ticket") {
                        continue;
                    }
                    let options: any[] = [];
                    for (let ticket of tickets.paid) {
                        if (ticket.isActive()) {
                            options.push({
                                value: ticket.id,
                                label: `${formatPrice(ticket.price, ticket.withTax)} – ${ticket.name}`
                            })
                        }
                    }
                    if (options.length > 0) {
                        field['options'] = options;
                        field.type = 'select';
                    }
                }
            }
        }
        return form;
    }

    private getTickets(free: boolean, freeTicketType: any, paidTicketTypes: any[]): Tickets | null {
        if (freeTicketType || paidTicketTypes) {
            return free ?
                new Tickets([], new FreeTicketType(freeTicketType)) :
                new Tickets(paidTicketTypes.map(type => new PaidTicketType(type)));
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

    getReasonForClosedRegistration() {
        if (this.isEnded() || !this.tickets) {
            return 'The event has ended';
        } else if (this.private) {
            return 'The event is private';
        } else if (this.free && this.tickets.free && this.tickets.free.isSoldOut()) {
            return 'Sold out';
        } else {
            if (!this.free) {
                let soldOut = true;
                this.tickets.paid.forEach((item) => {
                    if (!item.isSoldOut()) {
                        soldOut = false;
                    }
                });
                if (soldOut) {
                    return 'Booked out';
                } else {
                    return 'Registrations are closed';
                }
            } else {
                return '';
            }
        }
    }

    private isEnded() {
        return this.schedule.end < DateTime.local();
    }
}
