import IPlainObject from '../../interfaces/IPlainObject';
import Votes from '../Votes';

/**
 * Workshop statistics
 */
export default class WorkshopStats {

  static fromJSON(json: IPlainObject): WorkshopStats {
    return new WorkshopStats(json.evaluations, json.median, json.nps, json.rating, new Votes(json.votes));
  }

  readonly evaluations: number;
  readonly median: number;
  readonly nps: number;
  readonly rating: number;
  readonly votes: Votes;

  constructor(numberOfEvaluations: number, median: number, nps: number, rating: number, votes: Votes) {
    this.evaluations = numberOfEvaluations;
    this.median = median;
    this.nps = nps;
    this.rating = rating;
    this.votes = votes;
  }
}
