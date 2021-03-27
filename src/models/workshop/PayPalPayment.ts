import IPlainObject from '../../interfaces/IPlainObject';

export default class PayPalPayment {

  static fromJSON(json?: IPlainObject) {
    return json ? new PayPalPayment(json.active, json.client_id) : undefined;
  }

  constructor(readonly active: boolean, readonly clientId: string) {
  }
}
