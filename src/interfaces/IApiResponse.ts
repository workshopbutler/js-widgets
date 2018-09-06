import PlainObject = JQuery.PlainObject;
import IError from "./IError";

export default interface IApiResponse {
    /**
     * Status
     */
    status: number;

    /**
     * Headers
     */
    headers: PlainObject;

    /**
     * Response body
     */
    response: PlainObject | IError;
}
