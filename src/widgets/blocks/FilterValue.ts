/**
 * Represents a value in the filter
 */
export default class FilterValue {
  readonly name: string;
  readonly value: string;
  readonly selected?: boolean;

  constructor(name: string, value: string, selected: boolean = false) {
    this.name = name;
    this.value = value;
    this.selected = selected;
  }
}
