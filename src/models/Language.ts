import getLangCode from '../utils/language';

/**
 * Language(-s) of the workshop
 */
export default class Language {
    /**
     * The array of spoken languages at the workshop
     */
    readonly spoken: string[];
    /**
     * The language of learning materials at the workshop
     */
    readonly materials: string | null;

    constructor(spoken: string[], materials: string | null) {
        this.spoken = spoken.map((language) => getLangCode(language));
        this.materials = materials ? getLangCode(materials) : null;
    }
}
