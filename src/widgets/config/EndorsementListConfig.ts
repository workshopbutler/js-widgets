import {logError} from "../../common/Error";
import WidgetConfig from "./WidgetConfig";
import PlainObject = JQuery.PlainObject;

/**
 * Contains @EndorsementList widget configuration options
 */
export default class EndorsementListConfig extends WidgetConfig {

    /**
     * Trainer ID to show the endorsements for
     */
    readonly trainerId: number;

    protected constructor(options: PlainObject) {
        super(options);
        this.trainerId = options.trainerId;
    }

    /**
     * Returns the config if the options are correct
     * @param options {PlainObject} Widget's options
     */
    static create(options: PlainObject): EndorsementListConfig | null {
        if (EndorsementListConfig.validate(options)) {
            return new EndorsementListConfig(options);
        } else {
            return null;
        }
    }

    /**
     * Returns true if the options can be used to create the widget's config
     * @param options {PlainObject} Widget's config
     */
    protected static validate(options: PlainObject): boolean {
        let valid = true;
        if (!options.trainerId || typeof options.trainerId !== 'number') {
            logError('Attribute [trainerId] is not set correctly');
            valid = false;
        }
        return valid;
    }
}
