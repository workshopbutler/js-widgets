import transport from '../../common/Transport';

export default class TaxWidget {

  constructor($el, taxExemptCallback, taxValidationUrl) {
    this.root = $el;
    this.taxExemptCallback = taxExemptCallback;
    this.taxValidationUrl = taxValidationUrl;

    this.message = $el.find('[data-tax-widget-message]');
    this.button = $el.find('[data-tax-widget-button]');
    this.input = $el.find('[data-tax-widget-value]');
    this.intentId = $el.find('[data-tax-intent-id]');

    this.clearOnChange = false;
    this.buttonEnabled = true;

    this.activateEvents();
  }

  activateEvents() {
    this.root
      .on('click', '[data-tax-widget-button]', this.onButtonClick.bind(this))
      .on('change', '[data-tax-widget-value]', this.onChangeValue.bind(this));
  }

  onButtonClick() {
    if (!this.buttonEnabled) {return;}

    if (this.clearOnChange) {
      this.clear();
    } else {
      this.apply(this.input.val());
    }
  }

  onChangeValue() {
    if(this.clearOnChange) {
      this.clear();
    }
  }

  renderClearButton() {
    this.buttonEnabled = true;
    this.button.text('Clear');
    this.button.toggleClass('disabled', !this.buttonEnabled);
  }

  renderApplyButton(enabled = true) {
    this.buttonEnabled = enabled;
    this.button.text('Apply');
    this.button.toggleClass('disabled', !this.buttonEnabled);
  }

  clear() {
    this.renderApplyButton(true);
    this.input.val('');
    this.clearMessage();
    this.intentId.val('');
    this.clearOnChange = false;
  }

  clearMessage() {
    this.message.text('');
    this.message.removeClass();
  }

  renderMessage(type, text) {
    this.clearMessage();
    this.message.text(text);
    this.message.addClass(type+'-message');
  }

  apply(taxNumber) {

    if(!taxNumber) {return;}

    this.renderApplyButton(false);
    this.clearOnChange = true;

    const url = this.taxValidationUrl.replace(':number', taxNumber);
    transport.get(url, {},
      data => {
        this.processOkResponse(data);
      },
      data => {
        this.processFailResponse(data);
      });
  }

  processOkResponse(response) {
    const data = response.data;

    // eslint-disable-next-line no-console
    console.log(data);
    this.intentId.val(data.tax_intent_id);
    this.renderMessage(data.message_type, data.message_text);
    this.renderClearButton();

    this.taxExemptCallback(data.tax_exempt);
  }

  processFailResponse(response) {
    // eslint-disable-next-line no-console
    console.log(response);
    this.clear();
  }


}
