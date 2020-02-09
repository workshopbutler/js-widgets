import ReactiveFilter from './ReactiveFilter';
import Localisation from '../../utils/Localisation';
import FilterValue from './FilterValue';

export default abstract class ListReactiveFilter extends ReactiveFilter {

  values: FilterValue[] = [];

  protected constructor(protected readonly root: JQuery<HTMLElement>,
                        protected readonly localisationId: string,
                        name: string,
                        query: string,
                        loc: Localisation) {
    super(name, query, loc);
  }


  protected render() {
    let html = `<option class="wsb-filter" value="all">${this.loc.translate(this.localisationId)}</option>`;
    this.values.forEach((value: FilterValue) => {
      const selected = value.selected ? 'selected' : '';
      html += `<option class="wsb-filter" value="${value.value}" ${selected}>${value.name}</option>`;
    });
    this.root.find(this.htmlId).html(html);
  }
}
