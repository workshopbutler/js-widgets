export default class PaymentConfig {

  /**
   * True if the event is free
   */
  readonly free: boolean;

  /**
   * True if card payments are active
   */
  readonly active: boolean;

  /**
   * Workshop Butler public Stripe key
   */
  readonly stripePublicKey?: string;

  /**
   * Stripe id of connected account
   *  (https://stripe.com/docs/connect/enable-payment-acceptance-guide/accounts#save-the-id)
   */
  readonly stripeClientId?: string;

  /**
   * PayPal client id
   */
  readonly payPalClientId?: string;

  /**
   * True if it's a test mode
   */
  readonly testMode: boolean;

  /**
   * URL to initiate payment process
   */
  readonly preRegisterUrl: string;

  /**
   * URL to finish payment process
   */
  readonly registerUrl: string;

  readonly taxValidationUrl: string;

  constructor(active: boolean, free: boolean, testMode: boolean,
              preRegisterUrl: string, registerUrl: string, taxValidationUrl: string,
              stripePublicKey?: string, stripeClientId?: string, payPalClientId?: string) {
    this.active = active;
    this.free = free;
    this.stripePublicKey = stripePublicKey;
    this.stripeClientId = stripeClientId;
    this.payPalClientId = payPalClientId;
    this.testMode = testMode;
    this.preRegisterUrl = preRegisterUrl;
    this.registerUrl = registerUrl;
    this.taxValidationUrl = taxValidationUrl;
  }
}
