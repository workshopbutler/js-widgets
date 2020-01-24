import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Retrieves the template if it exists
 * @param options {object}
 */
export default function getTemplate(options: IPlainObject) {
  const defer = $.Deferred();

  if (options.template) {
    defer.resolve($(options.template).html());
  } else if (options.templateUrl) {
    $.get(options.templateUrl, data => {
      defer.resolve(data);
    });
  } else {
    defer.resolve(null);
  }
  return defer.promise();
}
