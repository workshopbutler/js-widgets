/**
 * Mock api AJAX requests
 */
class MockTransport {

  events = require('./data/events.json')
  trainers = require('./data/trainers.json')
  tickets = require('./data/tickets.json')
  forms = require('./data/forms.json')
  defaultVersion = "2020-03-19"

  constructor () {
    // populate with trainers
    this.events[0]['trainers'] = this.trainers;
    this.events[1]['trainers'] = this.trainers.slice(0,1);
    this.events[2]['trainers'] = this.trainers.slice(1,3);

    [0, 1, 2].forEach(el => {
      //populate with tickets
      this.events[el]['tickets'] = this.tickets[el]
      //populate with form
      this.events[el]['form'] = this.forms[el];
    });
  }

  get(url: string,
      data: object,
      callbackSuccess: (response: any) => void,
      callbackError?: (error: any) => void) {
      console.log(`GET ${url}`);
      switch (url) {
        case (url.match(/^events\?/) || {}).input:
          callbackSuccess(this.eventsListResponse());
          break;
        case (url.match(/^events\/[^\/]+\?/) || {}).input:
          callbackSuccess(this.eventResponse());
          break;
        case (url.match(/^(facilitators|trainers)\?/) || {}).input:
          callbackSuccess(this.trainersListResponse());
          break;
        case (url.match(/^(facilitators|trainers)\/[^\/]+\?/) || {}).input:
          callbackSuccess(this.trainerResponse());
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

  private eventsListResponse(){
    const data = this.events
    return {
      version: this.defaultVersion,
      total: data.length,
      perPage: data.length,
      page: 1,
      data: data,
    };
  }

  private eventResponse(){
    const data = this.events[0]
    return {
      version: this.defaultVersion,
      total: null,
      perPage: null,
      page: null,
      data: data,
    };
  }

  private trainersListResponse(){
    const data = this.trainers
    return {
      version: this.defaultVersion,
      total: data.length,
      perPage: data.length,
      page: 1,
      data: data,
    };
  }

  private trainerResponse(){
    const data = this.trainers[0]
    return {
      version: this.defaultVersion,
      total: null,
      perPage: null,
      page: null,
      data: data,
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
