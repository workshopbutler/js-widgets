import WidgetConfig from "./WidgetConfig";
import {logError} from "../../common/Error";

/**
 * Contains @RegistrationPageConfig widget configuration options
 */
export default class RegistrationPageConfig extends WidgetConfig {
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

    protected constructor(options: any) {
        super(options);
        this.eventPageUrl = options.eventPageUrl ? options.eventPageUrl : undefined;
        this.trainers = options.trainers ? options.trainers : false;
        this.expiredTickets = options.expiredTickets !== undefined ? options.expiredTickets : false;
        this.numberOfTickets = options.numberOfTickets !== undefined ? options.numberOfTickets : true;
    }

    /**
     * Returns the config if the options are correct
     * @param options {any} Widget's options
     */
    static create(options: any): RegistrationPageConfig | null {
        if (RegistrationPageConfig.validate(options)) {
            return new RegistrationPageConfig(options);
        } else {
            return null;
        }
    }

    /**
     * Returns true if the options can be used to create the widget's config
     * @param options {any} Widget's config
     */
    protected static validate(options: any): boolean {
        let valid = true;
        if (options.eventPageUrl && typeof options.eventPageUrl !== 'string') {
            logError('Attribute [eventPageUrl] must be string');
            valid = false;
        }
        return valid;
    }
}
