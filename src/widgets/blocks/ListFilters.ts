import {Filter, FilterValue} from "./Filter";

export abstract class ListFilters<T> {
    protected filters: string[];
    protected abstract getFilterValues(name: string, objects: T[]): FilterValue[];

    /**
     * Returns non-empty filters
     * @param objects {array} List of objects
     */
    getFilters(objects: T[]): Filter[] {
        let filters: Filter[] = [];
        const self = this;
        this.filters.forEach(function(name) {
            const values = self.getFilterValues(name, objects);
            if (values.length) {
                const filterValue = new Filter(name, values, true);
                filters.push(filterValue);
            }
        });
        return filters.filter(filter => filter.visible);
    }

    /**
     * Returns unique, defined filter values
     * @param {string} defaultName Name of default value
     * @param {FilterValue[]} values All available filter values
     * @return {FilterValue[]}
     */
    protected getFilterData(defaultName: string, values: FilterValue[]): FilterValue[] {
        function onlyUnique(object: FilterValue, index: number, self: FilterValue[]) {
            return self.findIndex((value) => object.value === value.value) === index;
        }
        function onlyDefined(object: FilterValue) {
            return object.value !== undefined;
        }
        const filtered = values.filter(onlyDefined).
            filter(onlyUnique).
            sort((left, right) => left.name.localeCompare(right.name));
        //there is no value in rendering a filter when you cannot select more than 1 option
        if (!filtered.length) {
            return [];
        }
        const all = { value: 'all', name: defaultName };
        filtered.unshift(all);
        return filtered;
    }
}
