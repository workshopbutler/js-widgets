import {logError} from "../../common/Error";
import WidgetConfig from "./WidgetConfig";

/**
 * Contains @Schedule widget configuration options
 */
export default class ScheduleConfig extends WidgetConfig {

    /**
     * A url of the page with an installed 'EventPage' widget on it
     */
    readonly eventPageUrl: string;

    /**
     * Category ID to filter the events
     */
    readonly categoryId?: number;

    /**
     * A url of the page with an installed 'RegistrationPage' widget on it
     */
    readonly registrationPageUrl?: string;

    /**
     * All active filters
     */
    readonly filters: string[];

    /**
     * When true, 'Register' button leads directly to the registration page
     */
    readonly registration: boolean;

    protected constructor(options: any) {
        super(options);
        this.eventPageUrl = options.eventPageUrl;
        this.registrationPageUrl = options.registrationPageUrl;
        this.filters = options.filters;
        this.registration = options.registration !== undefined ? options.registration : false;
        this.categoryId = options.categoryId;
    }

    /**
     * Returns the config if the options are correct
     * @param options {any} Widget's options
     */
    static create(options: any): ScheduleConfig | null {
        if (ScheduleConfig.validate(options)) {
            return new ScheduleConfig(options);
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
        if (!options.eventPageUrl || typeof options.eventPageUrl !== 'string') {
            logError('Attribute [eventPageUrl] is not set correctly');
            valid = false;
        }
        if (!options.filters || typeof options.filters !== 'object') {
            logError('Attribute [filters] is not set correctly');
            valid = false;
        }
        return valid;
    }
}
