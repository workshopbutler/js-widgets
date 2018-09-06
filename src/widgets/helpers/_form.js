'use strict';

export default class FormHelper {

    /**
     * Validate given controls
     * @param {Object} options
     * @param {JQuery} options.$controls       - optional list of validating controls
     * @param {Object} [options.rules]           - list of rule
     * @param {Object} messages
     */
    constructor(options, messages) {
        this.$controls = options.$controls;

        this.messages = messages;
        this.rules = $.extend({}, options.rules);
        this.errors = [];

        this._assignEvents();
    }

    _assignEvents() {
        this.$controls
            .on('blur', this._onBlurControl.bind(this))
            .on('input change', this._onInputControl.bind(this))
    }

    _onBlurControl(e){
        const $el = $(e.currentTarget);
        this._isValidControl($el);
    }

    _onInputControl(e){
        const $control = $(e.currentTarget);
        this._removeError($control);
    }

    _isValidControl($control){
        const validation = this._validateControl($control);

        if (validation.isValid) {
            this._removeError($control);
            return true;
        }

        this._setError($control, validation.message);
        return false;
    }

    /**
     * Validate given control
     * @param {jQuery} $control - element
     * @returns {Object} = isValid(Boolean), message(String)
     * @private
     */
    _validateControl($control){
        const name = $control.attr('name');
        const rules = this.rules[name];
        const valueControl = this.getControlValue($control);
        let valid;

        for (let rule in rules){
            valid = this[`${rule}Validator`](valueControl, $control);

            if (!valid) return {
                isValid: false,
                message: this.messages[rule]
            };
        }

        return {
            isValid: true
        };
    }

    isValidFormData(){
        const self = this;
        let valid = true;

        this.removeErrors();
        this.$controls.each((index, control) => {
            let isValidControl  = self._isValidControl($(control));
            valid = valid && isValidControl;
        });

        return valid;
    }

    /**
     * Show or hide last error
     * @param {Boolean} condition
     * @param {jQuery} $control
     * @private
     */
    _showPreviousError(condition, $control = null){
        if (this.$inputWithError) {
            this.$inputWithError
                .parent()
                .toggleClass('b-error_state_high', !condition)
                .toggleClass('b-error_state_error', condition)
        }
        this.$inputWithError = $control;
    }

    /**
     * Set error for control
     * @param {jQuery} $control
     * @param {String} errorText
     * @param {Boolean} showBubble
     */
    _setError($control, errorText, showBubble = true) {
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
            error: errorText
        })
    }

    _removeError($control){
        const $parent = $control.parent();

        $parent.removeClass('b-error_show');

        this.errors = this.errors.filter(function (item) {
            return item.name !== $control.attr('name')
        })
    }

    /**
     * Set errors
     * @param {Array} errors - [{name: "email", error: "empty"}, {name: "password", error: "empty"}]
     */
    setErrors(errors) {
        this.$inputWithError = null;
        let index = 0;

        errors.forEach((item) => {
            const $currentControl = this.$controls.filter('[name="' + item.name + '"]').first();

            if (!$currentControl.length) return;
            this._setError($currentControl, item.error, false);
        })
    }

    removeErrors() {
        this.$controls.each((index, el) => {
            const $el = $(el);
            this._removeError($el)
        })
    }


    // Helper for form
    getFormData(){
        let formData = {};

        this.$controls.each((index, el) => {
            const $el = $(el);
            const name = $el.attr('name');
            if (name && formData[name] === undefined) {
                formData[name] = this.getControlValue($el)
            }
        });

        return formData;
    }

    setFormData(formData){
        const $controls = this.$controls;

        for( let field in formData){
            if (formData.hasOwnProperty(field)){
                let $control = $controls.filter(`[name="${field}"]`).first();

                if (!$control.length) return;

                this.setControlValue($control, formData[field]);
            }
        }
    }

    /**
     * Get list of errors with full title (from control title attribute)
     * @param {ListErrors} errors - list of errors
     * @returns {string}
     */
    getErrorsFull(errors) {
        const self = this;
        const arrErrors = errors || this.errors;
        let errorTxt = '';

        arrErrors.forEach((item) => {
            const $control = self.$controls.filter(`[name="${item.name}"]`).first();
            const name = $control.length? $control.attr('title'): item.name;

            errorTxt += `<b>${name}</b>: ${item.error}  <br>`;
        });

        return errorTxt;
    }

    clearForm() {
        this.$controls.each((index, el) => {
            const $el = $(el);
            if (!$el.attr("disabled"))  $el.val('');
        })
    }

    /**
     * Universal assign value
     * @param {jQuery} $control
     * @param {String|Number|Boolean} value
     */
    setControlValue($control, value){
        if ($control.is(':checkbox')){
            $control.prop('checked', value)
        } else{
            $control.val(value);
        }
    }

    /**
     * Universal get value helper
     * @param {jQuery} $control
     * @returns {String|Boolean}
     */
    getControlValue($control){
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
}
