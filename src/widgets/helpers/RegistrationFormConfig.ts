/**
 * Configuration object which modifies the behaviour for SharedRegistrationForm
 */
export default class RegistrationFormConfig {

  constructor(readonly eventId: number, readonly successRedirectUrl?: string) {
  }
}
