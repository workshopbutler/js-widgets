import IError from './IError';
import IPlainObject from './IPlainObject';

export default interface IApiResponse {
    /**
     * Status
     */
    status: number;

    /**
     * Headers
     */
    headers: IPlainObject;

    /**
     * Response body
     */
    response: IPlainObject | IError;
}
