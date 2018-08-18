import getLangCode from "../utils/language";

/**
 * Language(-s) of the workshop
 */
export default class Language {
    readonly spoken: string[];
    readonly materials: string | null;

    constructor(spoken: string[], materials: string | null) {
        this.spoken = spoken.map((language) => getLangCode(language));
        this.materials = materials ? getLangCode(materials) : null;
    }
}
