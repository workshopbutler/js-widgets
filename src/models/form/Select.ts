import Field from './Field';
import Option from './Option';

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
