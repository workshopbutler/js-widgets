/**
 * Represents a value in the filter
 */
export default class FilterValue {
  readonly name: string;
  readonly value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}
