import * as chai from 'chai';
import 'chai/register-should';
import EventFormatter from '../../../src/formatters/jsonld/EventFormatter';
import IPlainObject from '../../../src/interfaces/IPlainObject';
import Event from '../../../src/models/Event';

const expect = chai.expect;
describe('JSON-LD formatted Event', () => {

  const options = {
    eventPageUrl: 'https://workshopbutler.com',
  };
  const event = new Event(getEventJSON(), options);
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
    const location = {
      city: null,
      country_code: '00',
      online: true,
    };
    const onlineEvent = getEventJSON();
    onlineEvent.location = location;
    const onlineFormatted = EventFormatter.format(new Event(onlineEvent, options));
    onlineFormatted.should.not.have.property('location');
  });
  it('should not include `offers` attribute if the event has no tickets', () => {
    formatted.should.not.have.property('offers');
  });
  it('should not include `offers` attribute if the event is free', () => {
    const freeEvent = getEventJSON();
    freeEvent.free = true;
    const freeFormatted = EventFormatter.format(new Event(freeEvent, options));
    freeFormatted.should.not.have.property('offers');
  });
  it('should have several `offers` the event has several tickets types and is paid', () => {
    const paidTickets = [
      {
        amount: 10, end: '2018-03-01', id: '1', left: 5, name: 'Regular',
        price: {amount: 100, currency: 'EUR', sign: '€'}, start: '2018-01-01',
        state: {sold_out: false, ended: false, started: true, in_future: false, valid: true},
        with_vat: false,
      },
      {
        amount: 10, end: '2018-01-01', id: '1', left: 5, name: 'Early Bird',
        price: {amount: 50, currency: 'EUR', sign: '€'}, start: '2017-12-01',
        state: {sold_out: false, ended: false, started: true, in_future: false, valid: true},
        with_vat: false,
      },
    ];
    const withTickets = getEventJSON();
    withTickets.paid_ticket_types = paidTickets;
    const formattedWithTickets = EventFormatter.format(new Event(withTickets, options));
    expect(formattedWithTickets.offers).to.have.length(2);
  });
  it('should not include `performer` attribute if there is no trainers', () => {
   formatted.should.not.have.property('performer');
  });
  it('should have `performer` for each trainer', () => {
    const trainers = [
      {
        first_name: 'Bob', last_name: 'Lee',
      },
      {
        first_name: 'Alice', last_name: 'Sunny',
      },
    ];
    const withTrainers = getEventJSON();
    withTrainers.facilitators = trainers;
    const formattedWithTrainers = EventFormatter.format(new Event(withTrainers, options));
    expect(formattedWithTrainers.performer).to.have.length(2);
  });
  it('should not include `image` array if there is no cover image', () => {
    const withoutCoverImage = getEventJSON();
    withoutCoverImage.cover_image = {
      url: null,
    };
    const formattedWithoutImage = EventFormatter.format(new Event(withoutCoverImage, options));
    formattedWithoutImage.should.not.have.property('image');
  });
  it('should have `image` array', () => {
    expect(formatted.image).to.have.length(2);
    expect(formatted.image[0]).to.equal('https://wsb.com');
    expect(formatted.image[1]).to.equal('https://thumb.com');
  });
});

function getEventJSON(): IPlainObject {
  return {
    confirmed: true,
    description: 'Test description',
    free: false,
    hashed_id: 'xufd3',
    id: 1,
    location: {
      city: 'Lisbon',
      country_code: 'PT',
      online: false,
    },
    private: false,
    rating: 9.4,
    registration_page: {
      custom: true,
      url: 'https://workshopbutler.com/buy',
    },
    schedule: {
      end: '2018-01-02 18:00',
      hours_per_day: 8,
      start: '2018-01-01 12:00',
      timezone: 'Europe/Berlin',
      total_hours: 16,
    },
    sold_out: false,
    spoken_languages: ['English, German'],
    title: '2-day workshop',
    cover_image: {
      url: 'https://wsb.com',
      thumbnail: 'https://thumb.com',
    },
  };
}
