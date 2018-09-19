import {ITemplate} from 'ITemplates';

/**
 * A default implementation of @Template interface
 */
export default class DefaultTemplate implements ITemplate {
  constructor(readonly tmpl: any) { }

  render(data: any) {
    return this.tmpl.render(data);
  }
}
