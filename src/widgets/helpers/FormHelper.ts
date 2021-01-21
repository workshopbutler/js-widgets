import IPlainObject from '../../interfaces/IPlainObject';

export default class FormHelper {

  protected errors: IPlainObject[];

  /**
   * Validate given controls
   * @param $controls {IPlainObject} Form inputs
   * @param messages {IPlainObject} Messages to show on errors
   */
  constructor(protected readonly $controls: JQuery<HTMLElement>, readonly messages: IPlainObject) {
    this.errors = [];

    this.assignEvents();
  }

  /**
   * This is a legacy method which always return true
   */
  isValidFormData() {
    this.removeErrors();
    return true;
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

    this.errors = this.errors.filter(item => item.name !== $control.attr('name'));
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
}
