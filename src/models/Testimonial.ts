import IPlainObject from '../interfaces/IPlainObject';

export default class Testimonial {

  static fromJSON(json: IPlainObject): Testimonial {
    return new Testimonial(
      json.attendee, json.content, json.verified, json.avatar, json.company, json.reason, json.rating);
  }

  constructor(readonly attendee: string,
              readonly content: string,
              readonly verified = false,
              readonly avatar?: string,
              readonly company?: string,
              readonly reason?: string,
              readonly rating?: number) {
  }
}
