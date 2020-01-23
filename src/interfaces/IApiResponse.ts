import IError from './IError';
import IPlainObject from './IPlainObject';
import ISuccess from './ISuccess';

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
    response: ISuccess | IError;
}
