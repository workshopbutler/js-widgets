/**
 * Creates a Stripe payment form
 */
export default function createStripeCard(stripeHolderEl, publicKey, stripeAccount) {
  const x = (tagName, attrs = null) => {
    const el = document.createElement(tagName);
    if (attrs !== null) {
      Object.keys(attrs).forEach(function(k) {
        el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  };

  const options = {};
  if (stripeAccount) {
    options.stripeAccount = stripeAccount;
  }

  const cl = Stripe(publicKey, options);

  const stripeCardHolderEl = x('div', {class: 'wsb-stripe-card-element'});
  stripeHolderEl.appendChild(stripeCardHolderEl);
  const stripeCardErrorsHolderEl = x('div', {class: 'wsb-stripe-card-error'});
  stripeHolderEl.appendChild(stripeCardErrorsHolderEl);
  const incompleteMessage = 'Your card number is incomplete.';

  const elements = cl.elements();
  const stripeCardEl = elements.create('card', {
    hidePostalCode: true,
    style: {
      base: {
        'color': '#32325d',
        'fontFamily': '"Helvetica Neue", Helvetica, sans-serif',
        'fontSmoothing': 'antialiased',
        'fontSize': '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  });

  let inputComplete = false;
  stripeCardEl.on('change', e => {
    inputComplete = e.complete;
    if (e.error) {
      stripeCardErrorsHolderEl.innerHTML = e.error.message;
    } else {
      stripeCardErrorsHolderEl.innerHTML = '';
    }
  });
  stripeCardEl.mount(stripeCardHolderEl);
  return {
    stripeClient: cl,
    disableCardInput: disable => stripeCardEl.update({disabled: disable}),
    clearCardInput: () => {
      stripeCardEl.clear();
      stripeCardErrorsHolderEl.innerHTML = '';
    },
    validateInputs: () => {
      // It is also possible to use createToken method for card validation,
      // bit it's not a proper usage and we don't know about possible side effects of it
      // cl.createToken(stripeCardEl).then((token)=>console.log(token))
      //
      if (!inputComplete) {
        stripeCardErrorsHolderEl.innerHTML = incompleteMessage;
        stripeCardEl.focus(); // not work on iOS 13+
        return false;
      }
      return true;
    },
    confirmCardPayment: (clientSecret, {payment_method: paymentMethod}) => {
      if (!inputComplete) {
        return Promise.reject(incompleteMessage);
      }
      return cl.confirmCardPayment(clientSecret, {
        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
        payment_method: {
          card: stripeCardEl,
          // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
          billing_details: paymentMethod ? paymentMethod.billing_details : {},
        },
      });
    },
    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
    createPaymentMethod: ({billing_details}) => {
      if (!inputComplete) {
        return Promise.reject(incompleteMessage);
      }
      return cl.createPaymentMethod({
        type: 'card',
        card: stripeCardEl,
        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
        billing_details: billing_details || {},
      });
    },
  };
}
