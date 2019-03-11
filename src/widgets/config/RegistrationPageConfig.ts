import {logError} from '../../common/Error';
import IPlainObject from '../../interfaces/IPlainObject';
import WidgetConfig from './WidgetConfig';

/**
 * Contains @RegistrationPageConfig widget configuration options
 */
export default class RegistrationPageConfig extends WidgetConfig {

    /**
     * Returns the config if the options are correct
     * @param options {IPlainObject} Widget's options
     */
    static create(options: IPlainObject): RegistrationPageConfig | null {
        if (RegistrationPageConfig.validate(options)) {
            return new RegistrationPageConfig(options);
        } else {
            return null;
        }
    }

    /**
     * Returns true if the options can be used to create the widget's config
     * @param options {IPlainObject} Widget's config
     */
    protected static validate(options: IPlainObject): boolean {
        let valid = true;
        if (options.eventPageUrl && typeof options.eventPageUrl !== 'string') {
            logError('Attribute [eventPageUrl] must be string');
            valid = false;
        }
        return valid;
    }
    readonly eventPageUrl?: string;
    readonly trainers: boolean;

    /**
     * When true, expired tickets are shown
     */
    readonly expiredTickets: boolean;

    /**
     * When true, the number of left tickets for each ticket type is shown
     */
    readonly numberOfTickets: boolean;

    protected constructor(options: IPlainObject) {
        super(options);
        this.eventPageUrl = options.eventPageUrl ? options.eventPageUrl : undefined;
        this.trainers = options.trainers ? options.trainers : false;
        this.expiredTickets = options.expiredTickets !== undefined ? options.expiredTickets : false;
        this.numberOfTickets = options.numberOfTickets !== undefined ? options.numberOfTickets : true;
    }
}
