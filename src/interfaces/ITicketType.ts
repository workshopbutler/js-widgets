export default interface ITicketType {
  readonly numberOfTicketsLeft: number;

  /**
   * Returns true if no more seats left
   * @return {boolean}
   */
  soldOut(): boolean;

  /**
   * Returns true if there is no limitation for a number of tickets
   */
  withoutLimit(): boolean;
}
