import IPlainObject from '../interfaces/IPlainObject';
import Votes from './Votes';

/**
 * Trainer statistics
 */
export default class Statistics {
    readonly numberOfEvaluations: number;
    readonly median: number;
    readonly nps: number;
    readonly rating: number;
    readonly votes: Votes;

    constructor(numberOfEvaluations: number, median: number, nps: number, rating: number, votes: IPlainObject) {
        this.numberOfEvaluations = numberOfEvaluations;
        this.median = median;
        this.nps = nps;
        this.rating = rating;
        this.votes = new Votes(votes);
    }
}
