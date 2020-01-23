import IPlainObject from './IPlainObject';

export default interface ISuccess {

  /**
   * API version
   */
  version: string;

  /**
   * Response data
   */
  data: IPlainObject | IPlainObject[];
}
