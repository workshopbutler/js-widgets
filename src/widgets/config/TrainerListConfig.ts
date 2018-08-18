import {logError} from "../../common/Error";
import WidgetConfig from "./WidgetConfig";

/**
 * Contains @TrainerList widget configuration options
 */
export default class TrainerListConfig extends WidgetConfig {
    readonly trainerPageUrl: string;
    readonly filters: string[];

    protected constructor(options: any) {
        super(options);
        this.trainerPageUrl = options.trainerPageUrl;
        this.filters = options.filters;
    }

    /**
     * Returns the config if the options are correct
     * @param options {any} Widget's options
     */
    static create(options: any): TrainerListConfig | null {
        if (TrainerListConfig.validate(options)) {
            return new TrainerListConfig(options);
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
        if (!options.trainerPageUrl || typeof options.trainerPageUrl !== 'string') {
            logError('Attribute [trainerPageUrl] is not set correctly');
            valid = false;
        }
        if (!options.filters || typeof options.filters !== 'object') {
            logError('Attribute [filters] is not set correctly');
            valid = false;
        }
        return valid;
    }
}
