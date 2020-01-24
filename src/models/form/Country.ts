import Field from './Field';

/**
 * Form field with the list of countries
 */
export default class Country extends Field {
  readonly countries: string[] = [];

  constructor(data: any) {
    super(data);
  }
}
