/**
 * Type of workshop
 */
export default class Type {
    readonly id: number;
    readonly name: string;
    readonly badge: string;

    constructor(jsonData: any) {
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.badge = jsonData.url;
    }

    /**
     * Creates an empty type, used as a stub
     * @return {Type}
     */
    static empty(): Type {
        const data = { id: 0, name: '', badge: '' };
        return new Type(data)
    }
}
