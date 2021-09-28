import * as chai from 'chai';
import 'chai/register-should';
import EventFormatter from '../../../src/formatters/jsonld/EventFormatter';
import Event from '../../../src/models/Event';
import Schedule from '../../../src/models/Schedule';
import Language from '../../../src/models/workshop/Language';
import Location from '../../../src/models/workshop/Location';
import RegistrationPage from '../../../src/models/workshop/RegistrationPage';
import Trainer from '../../../src/models/Trainer';
import WorkshopStats from '../../../src/models/trainer/WorkshopStats';
import CombinedWorkshopStats from '../../../src/models/trainer/CombinedWorkshopStats';
import TrainerStats from '../../../src/models/trainer/TrainerStats';
import PaidTicketType from '../../../src/models/workshop/PaidTicketType';
import {DateTime} from 'luxon';
import TicketPrice from '../../../src/models/workshop/TicketPrice';
import PaidTickets from '../../../src/models/workshop/PaidTickets';
import CoverImage from '../../../src/models/workshop/CoverImage';
import Votes from '../../../src/models/Votes';

const expect = chai.expect;
describe('JSON-LD formatted Event', () => {

  const options = {
    eventPageUrl: 'https://workshopbutler.com',
  };
  const schedule = Schedule.fromJSON({
    start: '2018-01-01T12:00+01:00',
    end: '2018-01-02T18:00+01:00',
    timezone: 'Europe/Amsterdam',
  });
  const event = new Event(options, 1, 'xufd3', '2-day workshop', schedule, new Language([]),
    new Location(false, '00'), new RegistrationPage({}, null, ''), []);
  event.description = 'Test description';
  const formatted = EventFormatter.format(event);

  it('should have correct type, name, url and description', () => {
    expect(formatted['@type']).eq('Event');
    expect(formatted.name).eq('2-day workshop');
    expect(formatted.url).eq('https://workshopbutler.com?id=xufd3');
    expect(formatted.description).eq('Test description');
  });
  it('should have correct start and end date', () => {
    expect(formatted.startDate).to.eq('2018-01-01T12:00+01:00');
    expect(formatted.endDate).to.eq('2018-01-02T18:00+01:00');
  });
  it('should have a correct identification of free/paid event', () => {
    expect(formatted.isAccessibleForFree).eq(false);
  });
  it('should include a location attribute if the event is not online', () => {
    formatted.should.have.property('location');
  });
  it('should include a location attribute if the event is online', () => {
    event.location = new Location(true, '00');
    const onlineFormatted = EventFormatter.format(event);
    onlineFormatted.should.not.have.property('location');
  });
  it('should not include `offers` attribute if the event has no tickets', () => {
    formatted.should.not.have.property('offers');
  });
  it('should not include `offers` attribute if the event is free', () => {
    event.free = true;
    const freeFormatted = EventFormatter.format(event);
    freeFormatted.should.not.have.property('offers');
  });
  it('should have several `offers` the event has several tickets types and is paid', () => {
    const types = [
      new PaidTicketType('1', 'Regular', 10, 5,
        DateTime.fromFormat('2018-01-01', 'yyyy-MM-dd'),
        DateTime.fromFormat('2018-01-03', 'yyyy-MM-dd'),
        new TicketPrice(100, 10, 'EUR', '€')),
      new PaidTicketType('1', 'Early Bird', 10, 5,
        DateTime.fromFormat('2017-12-01', 'yyyy-MM-dd'), DateTime.fromFormat('2018-01-01', 'yyyy-MM-dd'),
        new TicketPrice(100, 10, 'EUR', '€')),
    ];
    event.tickets = new PaidTickets(types, true);
    const formattedWithTickets = EventFormatter.format(event);
    expect(formattedWithTickets.offers).to.have.length(2);
  });
  it('should not include `performer` attribute if there is no trainers', () => {
    formatted.should.not.have.property('performer');
  });
  it('should have `performer` for each trainer', () => {
    const workshopStats = new WorkshopStats(1, 1, 1, 1, new Votes({}));
    const combinedStats = new CombinedWorkshopStats(workshopStats, workshopStats, 0);
    const stats = new TrainerStats(combinedStats, combinedStats);

    const bob = new Trainer({}, 1, 'Bob', 'Lee', '', '', stats);
    const alice = new Trainer({}, 2, 'Alice', 'Sunny', '', '', stats);
    event.trainers = [bob, alice];
    const formattedWithTrainers = EventFormatter.format(event);
    expect(formattedWithTrainers.performer).to.have.length(2);
  });
  it('should not include `image` array if there is no cover image', () => {
    formatted.should.not.have.property('image');
  });
  it('should have `image` array', () => {
    const coverImage = new CoverImage('https://wsb.com', 'https://thumb.com');
    event.coverImage = coverImage;
    const withCover = EventFormatter.format(event);
    expect(withCover.image).to.have.length(2);
    expect(withCover.image[0]).to.equal('https://wsb.com');
    expect(withCover.image[1]).to.equal('https://thumb.com');
  });
});
