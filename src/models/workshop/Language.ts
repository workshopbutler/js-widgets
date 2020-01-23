import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Language(-s) of the workshop
 */
export default class Language {

  static fromJSON(json: IPlainObject): Language {
    return new Language(json.spoken, json.materials);
  }

  /**
   * The array of spoken languages at the workshop
   */
  readonly spoken: string[];
  /**
   * The language of learning materials at the workshop
   */
  readonly materials?: string;

  constructor(spoken: string[], materials?: string) {
    this.spoken = spoken;
    this.materials = materials;
  }
}
