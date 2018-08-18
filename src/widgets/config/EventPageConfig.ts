import WidgetConfig from "./WidgetConfig";
import {logError} from "../../common/Error";

/**
 * Contains @EventPageConfig widget configuration options
 */
export default class EventPageConfig extends WidgetConfig {
    readonly withTrainers: boolean;
    readonly trainerPageUrl?: string;
    readonly registrationPageUrl?: string;
    readonly widgets: any[];

    protected constructor(options: any) {
        super(options);
        this.withTrainers = options.withTrainers !== undefined ? options.withTrainers : false;
        this.trainerPageUrl = options.trainerPageUrl ? options.trainerPageUrl : undefined;
        this.registrationPageUrl = options.registrationPageUrl ? options.registrationPageUrl : undefined;
        this.widgets = options.widgets !== undefined ? options.widgets : [];
    }

    /**
     * Returns the config if the options are correct
     * @param options {any} Widget's options
     */
    static create(options: any): EventPageConfig | null {
        if (EventPageConfig.validate(options)) {
            return new EventPageConfig(options);
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
        if (options.withTrainers && (!options.trainerPageUrl || typeof options.trainerPageUrl !== 'string')) {
            logError('Attribute [trainerPageUrl] is not set correctly while [withTrainers=true]');
            valid = false;
        }
        return valid;
    }
}
