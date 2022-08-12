import transport from '../../common/Transport';

export default class TaxWidget {

  constructor($el, taxExemptCallback, taxValidationUrl) {
    if (!$el.length) {
      this.enabled = false;
      return this;
    }
    this.enabled = true;
    this.root = $el;
    this.taxExemptCallback = taxExemptCallback;
    this.taxValidationUrl = taxValidationUrl;

    this.message = $el.find('[data-tax-widget-message]');
    this.applyButton = $el.find('[data-tax-widget-apply]');
    this.clearButton = $el.find('[data-tax-widget-clear]');
    this.input = $el.find('[data-tax-widget-value]');
    this.intentId = $el.find('[data-tax-intent-id]');

    this.resetOnChange = false;

    this.reset();
    this.activateEvents();
  }

  reset(resetInput = true) {
    this.renderApplyButton(true);
    this.renderClearButton(false);
    if(resetInput) {
      this.input.val('');
    }
    this.message.hide('fast');
    this.intentId.val('');
    this.resetOnChange = false;

    this.taxExemptCallback(false);

  }

  activateEvents() {
    this.applyButton.on('click', this.onApplyClick.bind(this));
    this.clearButton.on('click', this.onClearClick.bind(this));
    this.input.on('input', this.onChangeValue.bind(this));
  }

  onApplyClick() {
    if( this.applyButton.hasClass('disabled') ) {
      return;
    }
    this.apply(this.input.val());
  }

  onClearClick() {
    if( this.clearButton.hasClass('disabled') ) {
      return;
    }
    this.reset(true);
  }

  onChangeValue() {
    if(!this.resetOnChange) {
      return;
    }
    this.reset(false);
  }

  renderClearButton(enabled = true) {
    this.clearButton.toggleClass('disabled', !enabled);
  }

  renderApplyButton(enabled = true) {
    this.applyButton.toggleClass('disabled', !enabled);
  }

  renderMessage(type, text) {
    this.message.text(text);
    this.message.attr('class', type+'-message');
    this.message.show('fast');
  }

  apply(taxNumber) {
    if(!taxNumber) {return;}

    this.renderApplyButton(false);
    this.renderClearButton(true);
    this.resetOnChange = true;

    const url = this.taxValidationUrl.replace(':number', taxNumber);
    transport.get(url, {},
      data => {
        this.processOkResponse(data);
      },
      data => {
        this.processFailResponse(data);
      }
    );
  }

  processOkResponse(response) {
    if(!this.resetOnChange) {
      // FIXME: potential race condition may happen here
      return;
    }
    const data = response.data;
    // eslint-disable-next-line no-console
    console.log(data);
    this.intentId.val(data.tax_intent_id);
    this.renderMessage(data.message_type, data.message_text);

    this.taxExemptCallback(data.tax_exempt);
  }

  processFailResponse(response) {
    // eslint-disable-next-line no-console
    console.log(response);
    this.reset(false);
  }


}
