import IPlainObject from '../interfaces/IPlainObject';

export default class Category {

  /**
   * ID of the category
   */
  readonly id: number;

  /**
   * Name of the category
   */
  readonly name: string;

  /**
   * Creates a new category
   */
  constructor(json: IPlainObject) {
    this.id = json.id;
    this.name = json.name;
  }
}
