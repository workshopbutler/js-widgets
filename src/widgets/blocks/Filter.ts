export class Filter {
    readonly name: string;
    readonly values: FilterValue[];
    readonly visible: boolean;

    constructor(name: string, values: FilterValue[], visible: boolean = true) {
        this.name = name;
        this.values = values;
        this.visible = visible;
    }
}

export class FilterValue {
    readonly name: string;
    readonly value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }
}
