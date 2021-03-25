import createStripeCard from './stripeCard';
import createPayPalButton from './payPalButton';
import {logInfo} from '../../common/Error';
import transport from '../../common/Transport';

export default class SharedRegistrationForm {

  /**
   * @param selector {HTMLElement}
   * @param formHelper {FormHelper}
   * @param formConfig {RegistrationFormConfig}
   * @param paymentConfig {PaymentConfig}
   */
  constructor(selector, formHelper, formConfig, paymentConfig) {
    this.root = $(selector);
    this.transport = transport;
    this.cardSection = this.root.find('[data-card-section]');
    this.submitBtn = this.root.find('[type="submit"]');
    this.successMessage = this.root.find('#wsb-success');
    this.form = this.root.find('#wsb-form');
    this.formConfig = formConfig;

    this.formHelper = formHelper;

    this.paymentConfig = paymentConfig;
    this.stripeCard = null;
    this.cardPaymentEnabled = this.initStripeCard();
    this.payPalPaymentEnabled = this.initPayPal();
    this.invoicePaymentEnabled = !this.isCardPaymentActive() || this.invoicePaymentAllowed();
    this.formIsLocked = false;
    this.activateEvents();
    this.init();
  }

  /**
   * @private
   */
  activateEvents() {
    this.root
      .on('click', '[data-widget-submit]', this.onSubmitForm.bind(this))
      .on('change', '[data-control][name="payment_type"]', this.onChangePaymentType.bind(this));

    this.root.on('submit', this.onSubmitForm.bind(this));
  }

  /**
   * Initialises card payments by Stripe
   * @return {boolean}
   * @private
   */
  initStripeCard() {

    if (!(
      this.cardPaymentAllowed()
      && this.isCardPaymentActive()
      && this.isPageSecure())
    ) {
      return false;
    }

    this.stripeCard = createStripeCard(
      this.root.find('#stripe-placeholder')[0],
      this.paymentConfig.stripePublicKey,
      this.paymentConfig.stripeClientId);

    this.displayCardSection(this.cardPaymentSelected());
    return true;
  }

  /**
   * Init payment by PayPal
   * @return {boolean}
   * @private
   */
  initPayPal() {

    if (!(this.isPayPalActive() && this.payPalPaymentAllowed())) {
      return false;
    }

    // here we are guessing currency by the selected ticket
    const currency = this.getTotalAmount().currency;

    const el = document.createElement('script');
    el.setAttribute('src',
      `https://www.paypal.com/sdk/js?currency=${currency}&client-id=${this.paymentConfig.payPalClientId}`);
    el.addEventListener('load', () => createPayPalButton('#paypal-button-container', this));
    document.head.appendChild(el);

    this.displayPayPalButton(this.payPalPaymentSelected());
    return true;
  }

  /**
   * Make some on-creation initialisations
   * @private
   */
  init() {
    this.successMessage.hide();
    this.initPromoActivation();
    this.initActiveRadioSelection();
    this.deactivateCardPayment();
    this.lockIfNoPaymentMethod();
  }

  /**
   * Deactivates card option if the page is not secure
   * @private
   */
  deactivateCardPayment() {
    if (this.isCardPaymentActive() && !this.isPageSecure()) {
      this.root.addClass('wsb-form-not-secure');
      this.root.find(
        '[data-control]select[name="payment_type"] option[value="Card"]'
      ).prop('disabled', 'disabled').removeProp('selected');
      this.root.find(
        '[data-control]input[name="payment_type"][value="Card"]'
      ).prop('disabled', 'disabled').removeProp('checked');
    }
  }

  /**
   * Lock forms if no payment method is available
   * @private
   */
  lockIfNoPaymentMethod() {
    if (this.cardPaymentEnabled || this.invoicePaymentEnabled || this.payPalPaymentEnabled || this.paymentConfig.free) {
      return;
    }
    this.root.addClass('wsb-form-without-payment');
    this.root.find('[data-payment-section]').hide();
    this.formIsLocked = true;
    this.submitBtn.prop('disabled', true);
  }

  /**
   * @return {boolean}
   * @private
   */
  cardPaymentAllowed() {
    const paymentTypeSelector = '[data-control][name="payment_type"]';
    // check both radio and select variants
    return !!(
      this.root.find(paymentTypeSelector+' option[value="Card"]').length ||
      this.root.find(paymentTypeSelector+'[value="Card"]').length
    );
  }

  /**
   * Returns true if it's allowed to use card payments on this page
   * @returns boolean
   * @private
   */
  isPageSecure() {
    return window.location.href.lastIndexOf('https', 0) === 0  || this.paymentConfig.testMode;
  }

  /**
   * Returns true if the card payment is active
   * @returns boolean
   * @private
   */
  isCardPaymentActive() {
    return this.paymentConfig.active
      && this.paymentConfig.stripeClientId !== undefined
      && this.paymentConfig.stripePublicKey !== undefined
      && this.paymentConfig.stripeClientId !== null;
  }

  /**
   * Returns true if the PayPal is active
   * @returns boolean
   * @private
   */
  isPayPalActive() {
    return this.paymentConfig.payPalClientId !== undefined;
  }

  /**
   * @private
   * @return {boolean}
   */
  invoicePaymentAllowed() {
    const paymentTypeSelector = '[data-control][name="payment_type"]';
    // check both radio and select variants
    return !!(
      this.root.find(paymentTypeSelector+' option[value="Invoice"]').length ||
      this.root.find(paymentTypeSelector+'[value="Invoice"]').length
    );
  }

  /**
   * @private
   * @return {boolean}
   */
  payPalPaymentAllowed() {
    const paymentTypeSelector = '[data-control][name="payment_type"]';
    // check both radio and select variants
    return !!(
      this.root.find(paymentTypeSelector+' option[value="PayPal"]').length ||
      this.root.find(paymentTypeSelector+'[value="PayPal"]').length
    );
  }

  /**
   * @private
   * @return {boolean}
   */
  cardPaymentSelected() {
    return this.root.find('[data-control][name="payment_type"]:checked').val() === 'Card';
  }

  /**
   * @private
   * @return {boolean}
   */
  payPalPaymentSelected() {
    return this.root.find('[data-control][name="payment_type"]:checked').val() === 'PayPal';
  }

  /**
   * @param state {boolean}
   * @private
   */
  displayCardSection(state) {
    if (state) {
      this.cardSection.removeAttr('style');
    } else {
      this.cardSection.css('display', 'none');
    }
  }

  /**
   * @param state {boolean}
   * @private
   */
  displayPayPalButton(state) {
    if (state) {
      this.root.find('#paypal-button-container').removeAttr('style');
      this.root.find('#default-submit-button').css('display', 'none');
    } else {
      this.root.find('#default-submit-button').removeAttr('style');
      this.root.find('#paypal-button-container').css('display', 'none');
    }
  }

  /**
   * Modifies form when a payment type switches
   * @private
   */
  onChangePaymentType() {
    if (this.cardPaymentEnabled) {
      this.stripeCard.clearCardInput();
      this.displayCardSection(this.cardPaymentSelected());
    }

    if (this.payPalPaymentEnabled){
      this.displayPayPalButton(this.payPalPaymentSelected());
    }
  }

  /**
   * Handles form submission
   * @param e {Event}
   * @private
   */
  onSubmitForm(e) {
    e.preventDefault();

    if (this.formIsLocked) {
      return;
    }

    // clear message
    this.showSubmitError('');

    if (!this.formHelper.isValidFormData()) {
      return;
    }

    if (this.payPalPaymentSelected() || (this.cardPaymentSelected() && !this.cardPaymentEnabled)) {
      this.showSubmitError('Payment method not allowed');
      return;
    }


    if (this.cardPaymentSelected()) {
      this.payAndSubmitRegistration();
    } else {
      this.submitRegistration();
    }
  }

  /**
   * Show form error
   * @param message {string}
   * @private
   */
  showSubmitError(message) {
    this.root.find('[data-form-major-error]').text(message || '');
  }

  /**
   * Accepts card payment and process registration
   * @private
   */
  payAndSubmitRegistration() {
    logInfo('Enter card payment flow');

    if (!this.stripeCard.validateInputs()) {
      logInfo('Failed card inputs validation');
      return;
    }

    const formData = this.formHelper.getFormData();
    const url = this.paymentConfig.preRegisterUrl;

    this.lockFormSubmit();
    this.transport.post(url, this.prepareFormData(formData),
      response => {
        this.processCardPayment(url, formData, response.data.stripe_client_secret);
      }, response => {
        this.processFailResponse(response);
      });
  }

  /**
   * Locks submit button
   * @private
   */
  lockFormSubmit() {
    this.formIsLocked = true;
    // show preloader above button
    this.submitBtn.find('i').css('display', 'inline-block');
  }

  /**
   * Unlocks submit button
   * @private
   */
  unlockFromSubmit() {
    this.formIsLocked = false;
    this.submitBtn.find('i').css('display', 'none');
  }

  /**
   * Returns a correctly formed data to be processed by Workshop Butler API
   * @param data {object}
   * @return {*}
   */
  prepareFormData(data) {
    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
    data.event_id = Number(this.formConfig.eventId);
    for (const item in data) {
      if (!data[item]) {
        delete data[item];
      }
    }
    return data;
  }

  /**
   * Return current amount and currency
   * @private
   */
  getTotalAmount() {
    const ticket = this.form.find('[name="ticket"]:checked');
    return {
      amount: ticket.data('amount'),
      currency: ticket.data('currency'),
    };
  }

  /**
   * Handles card payments and sends a confirmation signal on success
   * @param url
   * @param formData
   * @param clientSecret
   * @private
   */
  processCardPayment(url, formData, clientSecret) {
    this.lockFormSubmit();
    this.stripeCard.confirmCardPayment(
      clientSecret,
      {
        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
        billing_details: this.prepareBillingDetails(formData),
      }
    ).then(result => {

      if (result.error) {
        // Show error to customer (e.g., insufficient funds)
        this.submitFail(result.error.message);
        return;
      }
      // The payment has been processed!
      if (result.paymentIntent && result.paymentIntent.status !== 'succeeded') {
        this.submitFail(result.paymentIntent.status);
        return;
      }

      // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
      formData.intent_id = result.paymentIntent.id;

      this.transport.post(this.paymentConfig.registerUrl, this.prepareFormData(formData),
        () => {
          this.submitSucceeded();
        }, () => {
          // it shouldn't happen in any case
          this.submitFail(
            "Due to unexpected reason we can't complete the registration. " +
            'Please contact our support to resolve it manually');
        });

    });
  }

  /**
   * Adds billing details to card payment in Stripe
   * @param formData
   * @return {{address: {country: (*|null), city: (*|null), state: (*|null), postal_code:
   * (*|null), line2: (*|null), line1: (*|null)}, name: string}}
   * @private
   */
  prepareBillingDetails(formData) {
    return {
      address: {
        city: formData['billing.city'] || null,
        country: formData['billing.country'] || null,
        line1: formData['billing.street_1'] || null,
        line2: formData['billing.street_2'] || null,
        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
        postal_code: formData['billing.postcode'] || null,
        state: formData['billing.province'] || null,
      },
      name: (formData.first_name || '') + '' + (formData.last_name || ''),
    };
  }

  /**
   * Show error on failed submit request
   * @param message {string}
   * @private
   */
  submitFail(message) {
    this.showSubmitError(message);
    this.unlockFromSubmit();
  }

  /**
   * Handles a successful form submission
   * @private
   */
  submitSucceeded() {
    if (this.formConfig.successRedirectUrl && this.formConfig.successRedirectUrl !== '') {
      window.location.href = this.formConfig.successRedirectUrl;
      return;
    }

    this.form.hide();
    this.successMessage.show('slow');

    this.successMessage[0].scrollIntoView({block: 'center'});

    // clear form and errors here
    this.formHelper.clearForm();
    this.unlockFromSubmit();
    if (this.cardPaymentEnabled) {
      this.stripeCard.clearCardInput();
    }
  }

  /**
   * Submit simple registration with invoice payment
   * @private
   */
  submitRegistration() {
    logInfo('Enter simple registration flow');

    const formData = this.formHelper.getFormData();
    const registrationUrl = this.paymentConfig.registerUrl;

    this.lockFormSubmit();
    this.transport.post(registrationUrl, this.prepareFormData(formData),
      () => {
        this.submitSucceeded();
      }, response => {
        this.processFailResponse(response);
      });
  }

  /**
   * @private
   */
  processFailResponse(data) {
    this.submitFail(data.message);
    if (!(data.info)) {
      return;
    }
    if (typeof this.formHelper.setErrors === 'function') {
      this.formHelper.setErrors(data.info);
    } else {
      const error = [];
      for (const key in data.info) {
        if (data.info.hasOwnProperty(key) && this.formHelper.messages[data.info[key]] !== undefined) {
          error.push(`${this.formHelper.messages[data.info[key]]}`);
        }
      }
      this.showSubmitError(error.join(','));
    }
  }

  /**
   * Adds promo code activation logic
   */
  initPromoActivation() {
    this.root.find('[data-promo-link]').on('click', e => {
      e.preventDefault();
      this.root.find('[data-promo-code]').toggle();
    });
  }

  /**
   * Initialises ticket selection
   * @private
   */
  initActiveRadioSelection() {
    const radioGroups = this.root.find('.wsb-form__radio');
    radioGroups.each( () => {
      const radios = this.root.find('input[type="radio"]');
      radios.on('change', () => {
        this.toggleRadio(radios, false);
        this.toggleRadio(radios.filter(':checked'), true);
      });
      // init all checked items at the start
      this.toggleRadio(radios.filter(':checked'), true);
    });
  }

  /**
   * @param tickets {JQuery<HTMLElement>}
   * @param on {boolean}
   * @private
   */
  toggleRadio(tickets, on) {
    const name = 'wsb-active';
    if (on) {
      tickets.prop('checked', 'true');
      tickets.parent().addClass(name);
    } else {
      tickets.removeProp('checked');
      tickets.parent().removeClass(name);
    }
  }
}
