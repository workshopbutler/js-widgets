import WidgetConfig from "./WidgetConfig";
import {logError} from "../../common/Error";

/**
 * Contains @SidebarEventListConfig widget configuration options
 */
export default class SidebarEventListConfig extends WidgetConfig {
    readonly eventPageUrl: string;
    readonly hideIfEmpty: boolean;
    readonly length: number;
    readonly country?: string;
    readonly eventType?: number;
    readonly future: boolean;
    readonly trainerId?: number;
    readonly excludeId?: number;

    protected constructor(options: any) {
        super(options);
        this.eventPageUrl = options.eventPageUrl;
        this.hideIfEmpty = options.hideIfEmpty !== undefined ? options.hideIfEmpty : false;
        this.length = options.length !== undefined ? options.length : 3;
        this.future = options.future !== undefined ? options.future : true;

        this.country = options.country !== undefined ? options.country : undefined;
        this.eventType = options.eventType !== undefined ? options.eventType : undefined;
        this.trainerId = options.trainerId !== undefined ? options.trainerId : undefined;
        this.excludeId = options.excludeId !== undefined ? options.excludeId : undefined;
    }

    /**
     * Returns the config if the options are correct
     * @param options {any} Widget's options
     */
    static create(options: any): SidebarEventListConfig | null {
        if (SidebarEventListConfig.validate(options)) {
            return new SidebarEventListConfig(options);
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
        return valid;
    }
}
