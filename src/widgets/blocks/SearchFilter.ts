import ReactiveFilter from './ReactiveFilter';
import Localisation from '../../utils/Localisation';

export default class SearchFilter extends ReactiveFilter {

  static NAME = 'search';
  static QUERY = 'q';

  readonly visible: boolean = true;

  constructor(root: JQuery<HTMLElement>, loc: Localisation) {
    super(SearchFilter.NAME, SearchFilter.QUERY, loc);
    this.reactOnChange(root);
    this.reactOnInput(root);
  }

  /**
   * Handles a case when a user select all text and clicks Backspace
   */
  protected reactOnInput(root: JQuery<HTMLElement>) {
    root.on('input', this.htmlId, (e: Event) => {
      if (!e.currentTarget) {
        return;
      }
      const searchValue = $(e.currentTarget).val() as string | undefined;
      if (!searchValue && this.value !== searchValue) {
        this.updateValue(searchValue);
      }
    });
  }


}
