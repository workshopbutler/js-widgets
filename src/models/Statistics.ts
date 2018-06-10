/**
 * Trainer statistics
 */
export default class Statistics {
    readonly numberOfEvaluations: number;
    readonly median: number;
    readonly nps: number;
    readonly rating: number;

    constructor(numberOfEvaluations: number, median: number, nps: number, rating: number) {
        this.numberOfEvaluations = numberOfEvaluations;
        this.median = median;
        this.nps = nps;
        this.rating = rating;
    }
}
