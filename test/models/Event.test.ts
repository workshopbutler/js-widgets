import Event from '../../src/models/Event';
import * as chai from 'chai';

const expect = chai.expect;

describe('Event object', () => {
  it('should produce a correct cover image', () => {
    const json = {
      language: {
        spoken: [],
      },
      schedule: {
        start: '2019-01-01',
        end: '2019-01-02',
        timezone: 'UTC',
      },
      location: {
        online: true,
      },
      title: 'Test',
      cover_image: {
        url: 'http://wsb.com',
      },
    };
    const workshop = new Event(json, {});
    expect(workshop.coverImage.url).to.eq('http://wsb.com');
    expect(workshop.coverImage.thumbnail).to.eq(undefined);
  });
  it('should produce a correct empty cover image', () => {
    const json = {
      language: {
        spoken: [],
      },
      schedule: {
        start: '2019-01-01',
        end: '2019-01-02',
        timezone: 'UTC',
      },
      location: {
        online: true,
      },
      title: 'Test',
    };
    const workshop = new Event(json, {});
    expect(workshop.coverImage.url).to.eq(undefined);
    expect(workshop.coverImage.thumbnail).to.eq(undefined);
  });
});
