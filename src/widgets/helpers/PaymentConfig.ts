export default class PaymentConfig {

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

  constructor(active: boolean, testMode: boolean,
              preRegisterUrl: string, registerUrl: string,
              stripePublicKey?: string, stripeClientId?: string) {
    this.active = active;
    this.stripePublicKey = stripePublicKey;
    this.stripeClientId = stripeClientId;
    this.testMode = testMode;
    this.preRegisterUrl = preRegisterUrl;
    this.registerUrl = registerUrl;
  }
}
