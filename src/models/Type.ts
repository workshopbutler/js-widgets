/**
 * Type of workshop
 */
import IPlainObject from '../interfaces/IPlainObject';

export default class Type {

    /**
     * Creates an empty type, used as a stub
     * @return {Type}
     */
    static empty(): Type {
        const data = { id: 0, name: '', badge: '' };
        return new Type(data);
    }
    readonly id: number;
    readonly name: string;
    readonly badge: string;

    constructor(jsonData: IPlainObject) {
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.badge = jsonData.url;
    }
}
