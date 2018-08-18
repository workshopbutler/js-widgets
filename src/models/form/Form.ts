import Section from "./Section";
import Event from "../Event";

/**
 * Registration or evaluation form
 */
export default class Form {
    readonly sections: Section[];

    /**
     * Creates a form from JSON data
     * @param instructions {string|undefined} Fill-in instructions for the form
     * @param sections {any} JSON form data from API
     * @param event {Event} Form's event
     */
    constructor(readonly instructions: string | undefined, sections: any[], event: Event) {
        this.sections = sections.map((sectionData: any) => {
            return new Section(sectionData.name, sectionData.fields, event);
        });
    }
}
