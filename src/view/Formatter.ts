import Location from "../models/Location";
import Localisation from "../utils/Localisation";
import LocationFormatter from "./LocationFormatter";
import Language from "../models/Language";
import LanguageFormatter from "./LanguageFormatter";
import EventState from "../models/EventState";
import EventStateFormatter from "./EventStateFormatter";
import Schedule from "../models/Schedule";
import ScheduleFormatter from "./ScheduleFormatter";
import TicketPrice from "../models/TicketPrice";
import TicketPriceFormatter from "./TicketPriceFormatter";
import ITicketType from "../interfaces/ITicketType";
import TicketFormatter from "./TicketFormatter";

export default class Formatter {
    constructor(protected readonly loc: Localisation) {}

    format(object: any, type: string | null = null): string {
        if (object instanceof Schedule) {
            return ScheduleFormatter.format(this.loc, <Schedule>object, type)
        }
        if (object instanceof TicketPrice) {
            return TicketPriceFormatter.format(this.loc, <TicketPrice>object)
        }
        if (object instanceof Language) {
            return LanguageFormatter.format(this.loc, <Language>object);
        }
        if ((<ITicketType>object).withoutLimit !== undefined) {
            return TicketFormatter.format(this.loc, <ITicketType>object, type);
        }
        if (object instanceof Location) {
            return LocationFormatter.format(this.loc, <Location>object);
        }
        if (object instanceof EventState) {
            return EventStateFormatter.format(this.loc, <EventState>object);
        }
        if (typeof object === 'number') {
            const opts = { maximumFractionDigits: 2, minimumFractionDigits: 0 };
            return Intl.NumberFormat(this.loc.locale, opts).format(object);
        }
        return "";
    }
}
