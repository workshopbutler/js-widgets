/* eslint-disable no-console, @typescript-eslint/prefer-regexp-exec,
  @typescript-eslint/no-unused-vars, eqeqeq, camelcase */

/**
 * Mock api AJAX requests
 */
class MockTransport {

  events = require('./data/events.json');
  trainers = require('./data/trainers.json');
  tickets = require('./data/tickets.json');
  forms = require('./data/forms.json');
  defaultVersion = '2021-09-26';

  constructor() {
    // populate with trainers
    this.events[0].trainers = this.trainers.slice(0, 4);
    this.events[1].trainers = this.trainers.slice(0, 1);
    this.events[2].trainers = this.trainers.slice(1, 3);

    [0, 1, 2].forEach(el => {
      // populate with tickets
      this.events[el].tickets = this.tickets[el];
      // populate with form
      this.events[el].form = this.forms[el];
    });
  }

  get(url: string,
      data: object,
      callbackSuccess: (response: any) => void,
      callbackError?: (error: any) => void) {
    console.log(`GET ${url}`);
    switch (url) {
      case (url.match(/^events\?/) || {}).input:
        callbackSuccess(this.eventsListResponse(url));
        break;
      case (url.match(/^events\/[^\/]+\?/) || {}).input:
        callbackSuccess(this.eventResponse(url));
        break;
      case (url.match(/^(facilitators|trainers)\?/) || {}).input:
        callbackSuccess(this.trainersListResponse(url));
        break;
      case (url.match(/^(facilitators|trainers)\/[^\/]+\?/) || {}).input:
        callbackSuccess(this.trainerResponse(url));
        break;
    }
  }

  post(url: string, data: any, callbackSuccess: (response: any) => void, callbackFailure?: (response: any) => void) {
    console.log(`POST ${url}`);
  }

  put(url: string, data: any, callbackSuccess: (response: any) => void) {
    console.log(`PUT ${url}`);
  }

  delete(url: string, data: any, callbackSuccess: (response: any) => void) {
    console.log(`DELETE ${url}`);
  }

  private eventsListResponse(url: string) {
    const parsedURL = new URL(url, window.location.origin);
    const trainerId = parsedURL.searchParams.get('trainerId');
    const dates = parsedURL.searchParams.get('dates');
    let filter: any[] | null = null;

    if (trainerId && dates) {
      const trainer = this.trainers.find((e: any) => trainerId == e.id);
      if (dates == 'future') {
        filter = trainer?.mock?.upcoming_events || null;
      } else if (dates == 'past') {
        filter = trainer?.mock?.past_events || null;
      }
    }

    const data = filter?this.events.filter( (e: any) => filter?.includes(e.id)):this.events;

    return {
      version: this.defaultVersion,
      total: data.length,
      perPage: data.length,
      page: 1,
      data,
    };
  }

  private eventResponse(url: string) {
    const id = url.match(/^events\/(\d+)\?/)?.pop();
    const data = this.events.find((e: any) => id == e.id);
    return {
      version: this.defaultVersion,
      total: null,
      perPage: null,
      page: null,
      data,
    };
  }

  private trainersListResponse(url: string) {
    const data = this.trainers;
    return {
      version: this.defaultVersion,
      total: data.length,
      perPage: data.length,
      page: 1,
      data,
    };
  }

  private trainerResponse(url: string) {
    const id = url.match(/^(facilitators|trainers)\/(\d+)\?/)?.pop();
    const data = this.trainers.find((e: any) => id == e.id);
    return {
      version: this.defaultVersion,
      total: null,
      perPage: null,
      page: null,
      data,
    };
  }

  private convertResponse(json: any) {
    return {
      version: json.version,
      total: json.total,
      perPage: json.per_page,
      page: json.page,
      data: json.data,
    };
  }

}

const transport = new MockTransport();

export default transport;
