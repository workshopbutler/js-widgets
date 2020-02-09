import {deleteQueryFromPath, updatePathWithQuery} from '../../common/helpers/UrlParser';
import {FILTER_CHANGED} from './event-types';
import URI from 'urijs';
import Localisation from '../../utils/Localisation';
import Filter from './Filter';

export default abstract class ReactiveFilter implements Filter {
  readonly visible: boolean;
  value?: string;
  protected readonly htmlId: string;

  protected constructor(readonly name: string,
                        protected readonly query: string,
                        protected readonly loc: Localisation) {
    this.htmlId = `[data-filter-${this.name}]`;
    this.value = this.getValue();
  }

  protected updateQuery(value?: string) {
    deleteQueryFromPath(this.query);
    if (value) {
      updatePathWithQuery(this.query, value);
    }
  }

  protected reactOnChange(root: JQuery<HTMLElement>) {
    root.on('change', this.htmlId, (e: Event) => {
      if (!e.currentTarget) {
        return;
      }
      const filterValue = $(e.currentTarget).val() as string | undefined;
      this.updateValue(filterValue);
    });
  }

  protected updateValue(value: string | undefined) {
    this.value = value;
    this.updateQuery(value?.toString());
    PubSub.publish(FILTER_CHANGED, {name: this.name, value});
  }

  protected getValue(): string | undefined {
    const dataMap = new URI().search(true);
    return dataMap[this.query];
  }
}
