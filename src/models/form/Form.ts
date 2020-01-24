import Event from '../Event';
import Section from './Section';
import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Registration or evaluation form
 */
export default class Form {

  static fromJSON(json: IPlainObject, event: Event): Form | undefined {
    return json ? new Form(json.instructions, json.sections, event) : undefined;
  }

  readonly sections: Section[];

  /**
   * Creates a form from JSON data
   * @param instructions {string|undefined} Fill-in instructions for the form
   * @param sections {any} JSON form data from API
   * @param event {Event} Form's event
   */
  constructor(readonly instructions: string | undefined, sections: any[], event: Event) {
    this.sections = sections.map((json: any) => new Section(json.id, json.label, json.fields, event));
  }
}
