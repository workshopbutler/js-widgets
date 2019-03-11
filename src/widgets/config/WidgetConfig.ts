import IPlainObject from '../../interfaces/IPlainObject';

export default abstract class WidgetConfig {
    readonly template?: string;
    readonly templateUrl?: string;
    readonly fields?: string[];
    readonly theme?: string;

    protected constructor(options: IPlainObject) {
        this.template = options.template ? options.template : undefined;
        this.templateUrl = options.templateUrl ? options.templateUrl : undefined;
        this.fields = options.fields ? options.fields : undefined;
        this.theme = options.theme ? options.theme : undefined;
    }
}
