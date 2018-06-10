/**
 * Retrieves the template if it exists
 * @param options {object}
 */
let getTemplate = function (options) {
    let defer = $.Deferred();

    if (options.template) {
        defer.resolve($(options.template).text());
    } else if (options.templateUrl) {
        $.get(options.templateUrl, (data) => {
            defer.resolve(data);
        })
    } else {
        defer.resolve(null);
    }
    return defer.promise();
};

export default getTemplate;
