/**
 * Workshop Butler API error
 */
export default interface IError {
    /**
     * Internal API code
     */
    code: number;

    /**
     * Human-readable message
     */
    message: string;

    /**
     * Additional error info
     */
    info?: string;
}
