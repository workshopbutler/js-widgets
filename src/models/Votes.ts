import IPlainObject from '../interfaces/IPlainObject';

/**
 * Represents the raw votes
 */
export default class Votes {
  /**
     * Number of voters, who gave '0'
     */
  readonly vote0: number;

  /**
     * Number of voters, who gave '1'
     */
  readonly vote1: number;

  /**
     * Number of voters, who gave '2'
     */
  readonly vote2: number;

  /**
     * Number of voters, who gave '3'
     */
  readonly vote3: number;

  /**
     * Number of voters, who gave '4'
     */
  readonly vote4: number;

  /**
     * Number of voters, who gave '5'
     */
  readonly vote5: number;

  /**
     * Number of voters, who gave '6'
     */
  readonly vote6: number;

  /**
     * Number of voters, who gave '7'
     */
  readonly vote7: number;

  /**
     * Number of voters, who gave '8'
     */
  readonly vote8: number;

  /**
     * Number of voters, who gave '9'
     */
  readonly vote9: number;

  /**
     * Number of voters, who gave '10'
     */
  readonly vote10: number;

  constructor(votes: any) {
    this.vote0 = this.getValue('0', votes);
    this.vote1 = this.getValue('1', votes);
    this.vote2 = this.getValue('2', votes);
    this.vote3 = this.getValue('3', votes);
    this.vote4 = this.getValue('4', votes);
    this.vote5 = this.getValue('5', votes);
    this.vote6 = this.getValue('6', votes);
    this.vote7 = this.getValue('7', votes);
    this.vote8 = this.getValue('8', votes);
    this.vote9 = this.getValue('9', votes);
    this.vote10 = this.getValue('10', votes);
  }

  /**
     * Returns the vote's value or 0 if the value is not defined
     * @param {string} id Id of the vote
     * @param {any} votes All votes
     * @return {number}
     */
  private getValue(id: string, votes: IPlainObject): number {
    if (votes && votes[id]) {
      return parseInt(votes[id], 10);
    } else {
      return 0;
    }
  }
}
