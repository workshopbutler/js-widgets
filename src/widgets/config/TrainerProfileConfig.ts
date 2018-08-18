import WidgetConfig from "./WidgetConfig";

/**
 * Contains @TrainerProfileConfig widget configuration options
 */
export default class TrainerProfileConfig extends WidgetConfig {
    readonly widgets: any[];

    protected constructor(options: any) {
        super(options);
        this.widgets = options.widgets !== undefined ? options.widgets : [];
    }

    /**
     * Returns the config if the options are correct
     * @param options {any} Widget's options
     */
    static create(options: any): TrainerProfileConfig | null {
        if (TrainerProfileConfig.validate(options)) {
            return new TrainerProfileConfig(options);
        } else {
            return null;
        }
    }

    /**
     * Returns true if the options can be used to create the widget's config
     * @param options {any} Widget's config
     */
    protected static validate(options: any): boolean {
        return true;
    }
}
