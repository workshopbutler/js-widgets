import IPlainObject from '../../interfaces/IPlainObject';

export default class FormHelper {

  protected errors: IPlainObject[];
  protected $inputWithError?: JQuery;

  /**
   * Validate given controls
   * @param $controls {IPlainObject} Form inputs
   * @param messages {IPlainObject} Messages to show on errors
   */
  constructor(protected readonly $controls: JQuery<HTMLElement>, protected readonly messages: IPlainObject) {
    this.errors = [];

    this.assignEvents();
  }

  isValidFormData() {
    const self = this;
    let valid = true;

    this.removeErrors();
    this.$controls.each((index, control) => {
      const isValidControl = self.isValidControl($(control));
      valid = valid && isValidControl;
    });

    return valid;
  }

  /**
   * Set errors
   * @param {Array} errors - [{name: "email", error: "empty"}, {name: "password", error: "empty"}]
   */
  setErrors(errors: IPlainObject[]) {
    this.$inputWithError = undefined;

    errors.forEach((item: IPlainObject) => {
      const $currentControl = this.$controls.filter('[name="' + item.name + '"]').first();

      if (!$currentControl.length) {
        return;
      }
      this.setError($currentControl, item.error, false);
    });
  }

  removeErrors() {
    this.$controls.each((index, el) => {
      const $el = $(el);
      this.removeError($el);
    });
  }

  // Helper for form
  getFormData() {
    const formData: IPlainObject = {};

    this.$controls.each((index, el) => {
      const $el = $(el);
      const name = $el.attr('name');
      if (name && formData[name] === undefined) {
        formData[name] = this.getControlValue($el);
      }
    });

    return formData;
  }

  clearForm() {
    this.$controls.each((index, el) => {
      const $el = $(el);
      if (!$el.attr('disabled')) {
        $el.val('');
      }
    });
  }

  /**
   * Universal assign value
   * @param {jQuery} $control
   * @param {String|Number|Boolean} value
   */
  protected setControlValue($control: JQuery<HTMLElement>, value: string | number | string[]) {
    if ($control.is(':checkbox')) {
      $control.prop('checked', value);
    } else {
      $control.val(value);
    }
  }

  /**
   * Universal get value helper
   * @param {jQuery} $control
   * @returns {String|Boolean}
   */
  protected getControlValue($control: JQuery<HTMLElement>) {
    let value = null;

    if ($control.is(':checkbox')) {
      value = $control.prop('checked');
    } else if ($control.is(':radio') && $control.prop('checked')) {
      return $control.val();
    } else {
      value = $control.val();
    }

    return value;
  }

  protected removeError($control: JQuery<EventTarget>) {
    const $parent = $control.parent();

    $parent.removeClass('b-error_show');

    this.errors = this.errors.filter((item) => {
      return item.name !== $control.attr('name');
    });
  }

  /**
   * Validate given control
   * @param {jQuery} $control - element
   * @returns {Object} = isValid(Boolean), message(String)
   * @private
   */
  protected validateControl($control: JQuery) {

    return {
      isValid: true,
      message: '',
    };
  }

  protected assignEvents() {
    this.$controls.on('input change', this.onInputControl.bind(this));
  }

  protected onInputControl(e: Event) {
    if (e.currentTarget) {
      const $control = $(e.currentTarget);
      this.removeError($control);
    }
  }

  protected isValidControl($control: JQuery<HTMLElement>) {
    const validation = this.validateControl($control);

    return validation.isValid;
  }

  /**
   * Set error for control
   * @param {jQuery} $control
   * @param {String} errorText
   * @param {Boolean} showBubble
   */
  protected setError($control: JQuery<HTMLElement>, errorText: string, showBubble: boolean = true) {
    const $parent = $control.parent();
    const $error = $parent.find('.b-error');

    if ($error.length) {
      $error.text(errorText);
    } else {
      $('<div class="b-error" />')
        .text(errorText)
        .appendTo($parent);
    }

    $parent.addClass('b-error_show');

    this.errors.push({
      name: $control.attr('name'),
      error: errorText,
    });
  }

}
