import Localisation from "../utils/Localisation";
import EventState from "../models/EventState";

/**
 * Formats the event state
 */
export default class EventStateFormatter {
    static format(loc: Localisation, state: EventState): string {
        const reason = state.reason();
        if (reason) {
            return loc.translate(reason);
        } else {
            return loc.translate('event.register');
        }
    }
}
