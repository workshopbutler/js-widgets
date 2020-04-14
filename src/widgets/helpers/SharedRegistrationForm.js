import createStripeCard from './stripeCard';
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
    this.cardSection = this.root.find('[data-card-section]');
    this.submitBtn = this.root.find('[type="submit"]');
    this.successMessage = this.root.find('#wsb-success');
    this.form = this.root.find('#wsb-form');
    this.formConfig = formConfig;

    this.formHelper = formHelper;

    this.paymentConfig = paymentConfig;
    this.stripeCard = null;
    this.cardPaymentEnabled = this.initStripeCard();
    this.invoicePaymentEnabled = !this.isPaymentActive() || this.invoicePaymentAllowed();
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
      && this.isPaymentActive()
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
   * Make some on-creation initialisations
   * @private
   */
  init() {
    this.successMessage.hide();
    this.initPromoActivation();
    this.initActiveTicketSelection();
    this.deactivateCardPayment();
    this.lockIfNoPaymentMethod();
  }

  /**
   * Deactivates card option if the page is not secure
   * @private
   */
  deactivateCardPayment() {
    if (this.isPaymentActive() && !this.isPageSecure()) {
      this.root.addClass('wsb-form-not-secure');
      this.getCardPaymentOption().prop('disabled', 'disabled').removeProp('selected');
    }
  }

  /**
   * Lock forms if no payment method is available
   * @private
   */
  lockIfNoPaymentMethod() {
    if (this.cardPaymentEnabled || this.invoicePaymentEnabled || this.paymentConfig.free) {
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
    return !!this.getCardPaymentOption().length;
  }

  /**
   * Returns true if it's allowed to use card payments on this page
   * @returns boolean
   * @private
   */
  isPageSecure() {
    return window.location.href.startsWith('https') || this.paymentConfig.testMode;
  }

  /**
   * Returns true if the payment configuration is available
   * @returns boolean
   * @private
   */
  isPaymentActive() {
    return this.paymentConfig.active
      && this.paymentConfig.stripeClientId !== undefined
      && this.paymentConfig.stripePublicKey !== undefined;
  }

  /**
   * @private
   * @return {boolean}
   */
  invoicePaymentAllowed() {
    return !!this.root.find('[data-control][name="payment_type"] option[value="Invoice"]').length;
  }

  /**
   * @private
   * @return {boolean}
   */
  cardPaymentSelected() {
    return this.root.find('[data-control][name="payment_type"]').first().val() === 'Card';
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
   * @return {JQuery<HTMLElement> | jQuery | HTMLElement}
   * @private
   */
  getCardPaymentOption() {
    return this.root.find('[data-control][name="payment_type"] option[value="Card"]');
  }

  /**
   * Modifies form when a payment type switches between invoice and card
   * @private
   */
  onChangePaymentType() {
    if (!this.cardPaymentEnabled) {
      return;
    }
    this.stripeCard.clearCardInput();
    this.displayCardSection(this.cardPaymentSelected());
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

    if (this.cardPaymentSelected() && !this.cardPaymentEnabled) {
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
    transport.post(url, this.prepareFormData(formData),
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

      transport.post(this.paymentConfig.registerUrl, this.prepareFormData(formData),
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
    } else {
      window.scrollTo(
        {
          top: this.successMessage.scrollTop(),
          behavior: 'smooth',
        }
      );
      this.successMessage.show();
      this.form.hide();
      // clear form and errors here
      this.formHelper.clearForm();
      this.unlockFromSubmit();
      if (this.cardPaymentEnabled) {
        this.stripeCard.clearCardInput();
      }
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
    transport.post(registrationUrl, this.prepareFormData(formData),
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
  initActiveTicketSelection() {
    const tickets = this.root.find('#wsb-tickets input');
    tickets.on('change', () => {
      this.toggleTicket(tickets, false);
      this.toggleTicket(tickets.filter(':checked'), true);
    });
    if (tickets.length > 0) {
      const activeTicket = tickets.first();
      this.toggleTicket(activeTicket, true);
    }
  }

  /**
   * @param tickets {JQuery<HTMLElement>}
   * @param on {boolean}
   * @private
   */
  toggleTicket(tickets, on) {
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
