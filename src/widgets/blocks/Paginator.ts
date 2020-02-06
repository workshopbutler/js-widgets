import PaginatorButton from './PaginatorButton';
import {deleteQueryFromPath, updatePathWithQuery} from '../../common/helpers/UrlParser';
import URI from 'urijs';
import {PAGINATOR_CLICK} from './event-types';

/**
 * State of pagination
 */
export default class Paginator {

  static QUERY = 'page';

  static updateQuery(pageNumber: number) {
    deleteQueryFromPath(this.QUERY);
    updatePathWithQuery(this.QUERY, `${pageNumber}`);
  }

  static getPageFromQuery(): number {
    const dataMap = new URI().search(true);
    return dataMap[this.QUERY] ? dataMap[this.QUERY] : 1;
  }

  constructor(root: JQuery<HTMLElement>,
              readonly total: number,
              readonly page: number,
              readonly perPage: number) {
    root.on('click', '[data-page]', (e: Event) => {
      e.preventDefault();
      if (e.currentTarget) {
        const pageNumber = $(e.currentTarget).data('page') as number;
        Paginator.updateQuery(pageNumber);
        PubSub.publish(PAGINATOR_CLICK, { page: pageNumber });
      }
    });
  }

  buttons() {
    const buttons: PaginatorButton[] = [];
    if (this.isPrev()) {
      buttons.push(new PaginatorButton('Previous', true, this.page - 1));
    }
    const additionalBtn = this.total % this.perPage > 0 ? 1 : 0;
    const lastBtnNumber = Math.round(this.total / this.perPage) + additionalBtn;
    const magicNumber = 4;
    if (magicNumber - this.page > 0) {
      this.showStartOfPagination(buttons, magicNumber, lastBtnNumber);
    } else if (this.page + magicNumber > lastBtnNumber) {
      this.showEndOfPagination(buttons, magicNumber, lastBtnNumber);
    } else {
      this.showMiddleOfPagination(buttons, lastBtnNumber);
    }
    if (this.isNext()) {
      buttons.push(new PaginatorButton('Next', true, this.page + 1));
    }
    return buttons;
  }

  show() {
    return this.total > this.perPage;
  }

  protected showMiddleOfPagination(buttons: PaginatorButton[], lastBtnNumber: number) {
    buttons.push(new PaginatorButton('1', true, 1));
    buttons.push(new PaginatorButton('...', false, 0));
    buttons.push(new PaginatorButton(`${this.page - 1}`, true, this.page - 1));
    buttons.push(new PaginatorButton(`${this.page}`, false, this.page, true));
    buttons.push(new PaginatorButton(`${this.page + 1}`, true, this.page + 1));
    buttons.push(new PaginatorButton('...', false, 0));
    buttons.push(new PaginatorButton(`${lastBtnNumber}`, true, lastBtnNumber));
  }

  protected showStartOfPagination(buttons: PaginatorButton[], limit: number, lastBtnNumber: number) {
    for (let i = 1; i < limit + 1; i++) {
      buttons.push(new PaginatorButton(`${i}`, i !== this.page, i));
    }
    buttons.push(new PaginatorButton('...', false, 0));
    buttons.push(new PaginatorButton(`${lastBtnNumber}`, true, lastBtnNumber));
  }

  protected showEndOfPagination(buttons: PaginatorButton[], limit: number, lastBtnNumber: number) {
    buttons.push(new PaginatorButton('1', true, 1));
    buttons.push(new PaginatorButton('...', false, 0));
    for (let i = lastBtnNumber - limit; i <= lastBtnNumber; i++) {
      buttons.push(new PaginatorButton(`${i}`, i !== this.page, i));
    }
  }

  protected isNext() {
    return (this.perPage * this.page) < this.total;
  }

  protected isPrev() {
    return this.page !== 1;
  }
}
