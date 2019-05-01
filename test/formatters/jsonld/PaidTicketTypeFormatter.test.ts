import * as chai from 'chai';
import 'chai/register-should';
import PaidTicketTypeFormatter from '../../../src/formatters/jsonld/PaidTicketTypeFormatter';
import IPlainObject from '../../../src/interfaces/IPlainObject';
import PaidTicketType from '../../../src/models/workshop/PaidTicketType';

const expect = chai.expect;

describe('JSON-LD formatted PaidTicketType', () => {
  const defaultTypeJson: IPlainObject = getTypeJson();
  const defaultType = new PaidTicketType(defaultTypeJson, 'UTC');

  it('should have a correct type', () => {
    const json = PaidTicketTypeFormatter.format(defaultType);
    expect(json['@type']).to.eq('Offer');
  });
  it('should be InStock if it is active and the tickets are available', () => {
    const json = PaidTicketTypeFormatter.format(defaultType);
    expect(json.availability).to.eq('https://schema.org/InStock');
  });
  it('should be SoldOut if the tickets are sold out', () => {
    const soldOutJson = getTypeJson();
    soldOutJson.state.sold_out = true;
    soldOutJson.left = 0;
    const json = PaidTicketTypeFormatter.format(new PaidTicketType(soldOutJson, 'UTC'));
    expect(json.availability).to.eq('https://schema.org/SoldOut');
  });
  it('should be SoldOut if the tickets sale ended', () => {
    const endedJson = getTypeJson();
    endedJson.state.ended = true;
    const json = PaidTicketTypeFormatter.format(new PaidTicketType(endedJson, 'UTC'));
    expect(json.availability).to.eq('https://schema.org/SoldOut');
  });
  it('should be empty if the tickets sale has not started yet', () => {
    const inFutureJson = getTypeJson();
    inFutureJson.state.in_future = true;
    inFutureJson.state.active = false;
    const json = PaidTicketTypeFormatter.format(new PaidTicketType(inFutureJson, 'UTC'));
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
  it('should have a correcly formed url if it exists', () => {
    const json = PaidTicketTypeFormatter.format(defaultType, 'https://workshopbutler.com/buy?id=4');
    expect(json.url).to.eq('https://workshopbutler.com/buy?id=4&ticket=long1');
  });
});

function getTypeJson(): IPlainObject {
  return {
    amount: 10, end: '2018-03-01', id: 'long1', left: 5, name: 'Regular',
    price: {amount: 100, currency: 'EUR', sign: '€'}, start: '2018-01-01',
    state: {sold_out: false, ended: false, started: true, in_future: false, valid: true},
    with_vat: false,
  };
}
