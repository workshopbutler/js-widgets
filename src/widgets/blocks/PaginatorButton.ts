export default class PaginatorButton {

  constructor(readonly title: string,
              readonly link: boolean,
              readonly value: number,
              readonly active: boolean = false) {
  }
}
