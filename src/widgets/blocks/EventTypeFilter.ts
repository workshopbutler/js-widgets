import FilterValue from './FilterValue';
import {TYPES_LOADED} from './event-types';
import Type from '../../models/workshop/Type';
import Localisation from '../../utils/Localisation';
import ListReactiveFilter from './ListReactiveFilter';

export default class EventTypeFilter extends ListReactiveFilter {

  static NAME = 'type';
  static QUERY = 'type';
  protected static LOC_NAME = 'filter.types';

  readonly visible: boolean = true;

  constructor(root: JQuery<HTMLElement>, loc: Localisation) {
    super(root, EventTypeFilter.LOC_NAME, EventTypeFilter.NAME, EventTypeFilter.QUERY, loc);
    this.reactOnChange(root);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    PubSub.subscribe(TYPES_LOADED, function(msg: string, types: Type[]) {
      self.reactOnLoadedTypes(types);
    });
  }

  protected reactOnLoadedTypes(types: Type[]) {
    this.values = [];
    types.forEach((type: Type) => {
      const selected = type.id.toString() === this.value;
      this.values.push(new FilterValue(type.name, type.id.toString(), selected));
    });
    this.render();
  }


}
