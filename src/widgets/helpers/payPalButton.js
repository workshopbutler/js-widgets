/**
 * Creates a PayPal button
 */
export default function createPayPalButton(selector, registrationForm) {
  window.paypal.Buttons({

    // Button style
    style: {
      color: 'blue',
      shape: 'pill',
      label: 'pay',
      height: 50,
    },

    // Set up the transaction
    /* eslint @typescript-eslint/naming-convention: "off" */
    /* eslint camelcase: ["error", {properties: "never"}] */
    createOrder(data, actions) {
      const ticket = registrationForm.getTotalAmount();
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: ticket.amount,
            // it doesn't change the selected currency, but works like assert
            currency_code: ticket.currency,
          },
        }],
      });
    },

    // Finalize the transaction
    onApprove(data, actions) {
      return actions.order.capture().then(function(details) {
        registrationForm.showSubmitError('Payment has been accepted. Completing the registration...');
        // Complete registration
        registrationForm.submitRegistration();
      });
    },

    onInit(data, actions) {
      actions.disable();
      registrationForm.form[0].addEventListener('change', function(event) {
        if (registrationForm.form[0].checkValidity()) {
          actions.enable();
        } else {
          actions.disable();
        }
      });
    },

    onClick(data, actions) {
      if (!registrationForm.form[0].checkValidity()) {
        registrationForm.form[0].reportValidity();
        return false;
      }
      // validate pre-registration here
      return new Promise( resolve => {
        registrationForm.transport.post(
          registrationForm.paymentConfig.preRegisterUrl,
          registrationForm.prepareFormData(registrationForm.formHelper.getFormData()),
          () => resolve(actions.resolve()),
          err => {
            registrationForm.processFailResponse(err);
            resolve(actions.reject());
          }
        );
      });
    },

    onCancel(data) {
      registrationForm.showSubmitError('Payment has been canceled');
    },

    onError(err) {
      registrationForm.showSubmitError('Checkout error');
    },

  }).render(selector);
}
