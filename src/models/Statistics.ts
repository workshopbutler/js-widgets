/**
 * Trainer statistics
 */
import Votes from "./Votes";

export default class Statistics {
    readonly numberOfEvaluations: number;
    readonly median: number;
    readonly nps: number;
    readonly rating: number;
    readonly votes: Votes;

    constructor(numberOfEvaluations: number, median: number, nps: number, rating: number, votes: any) {
        this.numberOfEvaluations = numberOfEvaluations;
        this.median = median;
        this.nps = nps;
        this.rating = rating;
        this.votes = new Votes(votes);
    }
}
