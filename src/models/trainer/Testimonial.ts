import IPlainObject from '../../interfaces/IPlainObject';

export default class Testimonial {

  static fromJSON(json: IPlainObject): Testimonial {
    return new Testimonial(json.attendee, json.content, json.company, json.rating);
  }

  constructor(readonly attendee: string,
              readonly content: string,
              readonly company?: string,
              readonly rating?: number) {
  }
}
