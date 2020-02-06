import FilterValue from './FilterValue';
import Filter from './Filter';

export class SelectFilter implements Filter {
  readonly name: string;
  readonly values: FilterValue[];

  constructor(name: string, values: FilterValue[], readonly visible = true) {
    this.name = name;
    this.values = values;
  }
}
