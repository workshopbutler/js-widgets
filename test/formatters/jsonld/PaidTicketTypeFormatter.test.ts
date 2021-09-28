import * as chai from 'chai';
import 'chai/register-should';
import PaidTicketTypeFormatter from '../../../src/formatters/jsonld/PaidTicketTypeFormatter';
import PaidTicketType from '../../../src/models/workshop/PaidTicketType';
import {DateTime} from 'luxon';
import TicketPrice from '../../../src/models/workshop/TicketPrice';

const expect = chai.expect;

describe('JSON-LD formatted PaidTicketType', () => {
  const start = DateTime.fromFormat('2018-01-01', 'yyyy-MM-dd', {zone: 'UTC'});
  const end = DateTime.local().plus({days: 6});
  const price = new TicketPrice(100, 10, 'EUR', '€');
  const defaultType = new PaidTicketType('long1', 'Regular', 10, 5, start, end, price);

  it('should have a correct type', () => {
    const json = PaidTicketTypeFormatter.format(defaultType);
    expect(json['@type']).to.eq('Offer');
  });
  it('should be InStock if it is active and the tickets are available', () => {
    const json = PaidTicketTypeFormatter.format(defaultType);
    expect(json.availability).to.eq('https://schema.org/InStock');
  });
  it('should be SoldOut if the tickets are sold out', () => {
    const type = new PaidTicketType('', '', 10, 0, start, end, price);
    const json = PaidTicketTypeFormatter.format(type);
    expect(json.availability).to.eq('https://schema.org/SoldOut');
  });
  it('should be SoldOut if the tickets sale ended', () => {
    const type = new PaidTicketType('', '', 10, 0, start, start, price);
    const json = PaidTicketTypeFormatter.format(type);
    expect(json.availability).to.eq('https://schema.org/SoldOut');
  });
  it('should be empty if the tickets sale has not started yet', () => {
    const type = new PaidTicketType('', '', 10, 0, end, end, price);
    const json = PaidTicketTypeFormatter.format(type);
    json.should.not.have.property('availability');
  });
  it('should have a price and currency', () => {
    const json = PaidTicketTypeFormatter.format(defaultType);
    expect(json.price).to.eq(100);
    expect(json.priceCurrency).to.eq('EUR');
  });
  it('should have a valid `from` date', () => {
    const json = PaidTicketTypeFormatter.format(defaultType);
    expect(json.validFrom).to.eq('2018-01-01T00:00Z');
  });
  it('should not have `url` attribute if the url does not exist', () => {
    const json = PaidTicketTypeFormatter.format(defaultType);
    json.should.not.have.property('url');
  });
  it('should have a url if it exists', () => {
    const json = PaidTicketTypeFormatter.format(defaultType, 'https://workshopbutler.com/buy');
    expect(json.url).to.eq('https://workshopbutler.com/buy?ticket=long1');
  });
  it('should have a correctly formed url if it exists', () => {
    const json = PaidTicketTypeFormatter.format(defaultType, 'https://workshopbutler.com/buy?id=4');
    expect(json.url).to.eq('https://workshopbutler.com/buy?id=4&ticket=long1');
  });
});
