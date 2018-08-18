import Field from "./Field";

/**
 * Select option
 */
class Option {
    constructor(readonly label: string, readonly value: string) {
    }
}

/**
 * Select field
 */
export default class Select extends Field {
    readonly options: Option[];

    constructor(data: any) {
        super(data);
        this.options = data.options;
    }
}
