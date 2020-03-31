import IPlainObject from '../../interfaces/IPlainObject';

export default class Payment {

  /**
   * Converts JSON to Payment object
   * @param json {IPlainObject} JSON data
   * @return Optional Payment object
   */
  static fromJSON(json?: IPlainObject) {
    return json ? new Payment(json.active, json.stripe.key, json.stripe.client_id) : undefined;
  }

  /**
   * True if card payments are active
   */
  readonly active: boolean;

  /**
   * Workshop Butler public Stripe key
   */
  readonly stripePublicKey: string;

  /**
   * Stripe id of connected account
   *  (https://stripe.com/docs/connect/enable-payment-acceptance-guide/accounts#save-the-id)
   */
  readonly stripeClientId: string;

  constructor(active: boolean, stripePublicKey: string, stripeClientId: string) {
    this.active = active;
    this.stripeClientId = stripeClientId;
    this.stripePublicKey = stripePublicKey;
  }

  /**
   * Returns true if the script is in test mode
   */
  testMode(): boolean {
    return this.stripePublicKey.startsWith('pk_test_');
  }
}
