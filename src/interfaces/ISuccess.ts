import IPlainObject from './IPlainObject';

export default interface ISuccess {

  /**
   * API version
   */
  version: string;

  /**
   * Total number of records
   */
  total: number;

  /**
   * Number of records per page
   */
  perPage: number;

  /**
   * Current page
   */
  page: number;

  /**
   * Response data
   */
  data: IPlainObject | IPlainObject[];
}
