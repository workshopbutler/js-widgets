import IPlainObject from '../../interfaces/IPlainObject';
import Event from '../../models/Event';
import Trainer from '../../models/Trainer';
import LocationFormatter from './LocationFormatter';
import PaidTicketTypeFormatter from './PaidTicketTypeFormatter';
import TrainerFormatter from './TrainerFormatter';
import CoverImage from '../../models/workshop/CoverImage';
import PaidTickets from '../../models/workshop/PaidTickets';

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
    json = this.addImage(json, event.coverImage);
    return json;
  }

  protected static addImage(jsonLd: IPlainObject, image: CoverImage): IPlainObject {
    if (image.url) {
      const images = [image.url];
      if (image.thumbnail) {
        images.push(image.thumbnail);
      }
      jsonLd.image = images;
    }
    return jsonLd;
  }

  protected static addTickets(jsonLd: IPlainObject, event: Event): IPlainObject {
    if (event.tickets instanceof PaidTickets) {
      const offers = [];
      for (const ticketType of event.tickets.types) {
        offers.push(PaidTicketTypeFormatter.format(ticketType, event.registrationPage.url));
      }
      if (offers.length > 0) {
        jsonLd.offers = offers;
      }
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
