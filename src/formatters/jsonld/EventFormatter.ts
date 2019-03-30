import IPlainObject from '../../interfaces/IPlainObject';
import Event from '../../models/Event';
import Trainer from '../../models/Trainer';
import LocationFormatter from './LocationFormatter';
import PaidTicketTypeFormatter from './PaidTicketTypeFormatter';
import TrainerFormatter from './TrainerFormatter';

/**
 * Formats event to a JSON-LD format
 */
export default class EventFormatter {
  static format(event: Event): IPlainObject {
    const timeOptions = {suppressMilliseconds: true, suppressSeconds: true};
    let json: IPlainObject = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'description': event.description,
      'endDate': event.schedule.end.toISO(timeOptions),
      'isAccessibleForFree': false,
      'name': event.title,
      'startDate': event.schedule.start.toISO(timeOptions),
      'url': event.url,
    };
    if (!event.location.online) {
      json.location = LocationFormatter.format(event.location);
    }
    json = this.addTickets(json, event);
    json = this.addTrainers(json, event.trainers);
    return json;
  }

  protected static addTickets(jsonLd: IPlainObject, event: Event): IPlainObject {
    if (!event.free && event.tickets && event.tickets.nonEmpty()) {
      const offers = [];
      for (const ticketType of event.tickets.paid) {
        offers.push(PaidTicketTypeFormatter.format(ticketType, event.registrationPage.url));
      }
      jsonLd.offers = offers;
    }
    return jsonLd;
  }

  protected static addTrainers(jsonLd: IPlainObject, trainers: Trainer[]): IPlainObject {
    if (trainers.length > 0) {
      const jsonLdTrainers = [];
      for (const trainer of trainers) {
        jsonLdTrainers.push(TrainerFormatter.format(trainer));
      }
      jsonLd.performer = jsonLdTrainers;
    }
    return jsonLd;
  }
}
