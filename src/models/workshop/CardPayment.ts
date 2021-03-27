import IPlainObject from '../../interfaces/IPlainObject';

export default class CardPayment {

  /**
   * Converts JSON to CardPayment object
   * @param json {IPlainObject} JSON data
   * @return Optional CardPayment object
   */
  static fromJSON(json?: IPlainObject) {
    return json ? new CardPayment(json.active, json.stripe.key, json.stripe.client_id) : undefined;
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
    return this.stripePublicKey.lastIndexOf('pk_test_', 0) === 0;
  }
}
