import Filter from './Filter';
import {SEARCH_CHANGED} from './event-types';
import {deleteQueryFromPath, updatePathWithQuery} from '../../common/helpers/UrlParser';
import URI from 'urijs';

export default class SearchFilter implements Filter {

  protected static updateQuery(value?: string) {
    deleteQueryFromPath(SearchFilter.QUERY);
    if (value) {
      updatePathWithQuery(SearchFilter.QUERY, value);
    }
  }

  static NAME = 'search';
  static QUERY = 'q';

  readonly name: string = SearchFilter.NAME;
  value?: string;
  readonly visible: boolean = true;

  constructor(root: JQuery<HTMLElement>) {
    this.value = this.getValue();
    this.reactOnChange(root);
    this.reactOnInput(root);
  }

  protected reactOnChange(root: JQuery<HTMLElement>) {
    root.on('change', '[data-search]', (e: Event) => {
      if (!e.currentTarget) {
        return;
      }
      const searchValue = $(e.currentTarget).val() as string | undefined;
      this.updateValue(searchValue);
    });
  }

  /**
   * Handles a case when a user select all text and clicks Backspace
   */
  protected reactOnInput(root: JQuery<HTMLElement>) {
    root.on('input', '[data-search]', (e: Event) => {
      if (!e.currentTarget) {
        return;
      }
      const searchValue = $(e.currentTarget).val() as string | undefined;
      if (!searchValue && this.value !== searchValue) {
        this.updateValue(searchValue);
      }
    });
  }

  protected updateValue(searchValue: string | undefined) {
    this.value = searchValue;
    SearchFilter.updateQuery(searchValue);
    PubSub.publish(SEARCH_CHANGED, { value: searchValue });
  }

  protected getValue(): string | undefined {
    const dataMap = new URI().search(true);
    return dataMap[SearchFilter.QUERY];
  }

}
