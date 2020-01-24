import FilterValue from './FilterValue';

export class Filter {
  readonly name: string;
  readonly values: FilterValue[];
  readonly visible: boolean;

  constructor(name: string, values: FilterValue[], visible = true) {
    this.name = name;
    this.values = values;
    this.visible = visible;
  }
}
