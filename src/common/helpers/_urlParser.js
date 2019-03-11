/**
 * Returns the value of query parameter or null if the parameter is not found
 * @param name {string}
 */
let getQueryParam = function(name) {
    let value = null;
    window.location.search.substr(1).split("&").forEach(function(el) {
        let param = el.split("=", 2);
        if (param.length === 2 && param[0] === name) {
            value = param[1];
        }
    });
    return value;
};

export {getQueryParam};
