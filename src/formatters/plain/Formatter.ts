import ITicketType from '../../interfaces/ITicketType';
import EventState from '../../models/EventState';
import Language from '../../models/Language';
import Location from '../../models/Location';
import Schedule from '../../models/Schedule';
import TicketPrice from '../../models/TicketPrice';
import Localisation from '../../utils/Localisation';
import EventStateFormatter from './EventStateFormatter';
import LanguageFormatter from './LanguageFormatter';
import LocationFormatter from './LocationFormatter';
import ScheduleFormatter from './ScheduleFormatter';
import TicketFormatter from './TicketFormatter';
import TicketPriceFormatter from './TicketPriceFormatter';

/**
 * Produces string representations of various objects
 */
export default class Formatter {
    constructor(protected readonly loc: Localisation) {}

    format(object: any, type: string | null = null): string {
        if (object instanceof Schedule) {
            return ScheduleFormatter.format(this.loc.locale, object as Schedule, type);
        }
        if (object instanceof TicketPrice) {
            return TicketPriceFormatter.format(this.loc, object as TicketPrice);
        }
        if (object instanceof Language) {
            return LanguageFormatter.format(this.loc, object as Language);
        }
        if ((object as ITicketType).withoutLimit !== undefined) {
            return TicketFormatter.format(this.loc, object as ITicketType, type);
        }
        if (object instanceof Location) {
            return LocationFormatter.format(this.loc, object as Location);
        }
        if (object instanceof EventState) {
            return EventStateFormatter.format(this.loc, object as EventState);
        }
        if (typeof object === 'number') {
            const opts = { maximumFractionDigits: 2, minimumFractionDigits: 0 };
            return Intl.NumberFormat(this.loc.locale, opts).format(object);
        }
        return '';
    }
}
