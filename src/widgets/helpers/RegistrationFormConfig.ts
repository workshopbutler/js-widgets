import {SearchToFormFieldConfig} from '../config/RegistrationPageConfig';

/**
 * Configuration object which modifies the behaviour for SharedRegistrationForm
 */
export default class RegistrationFormConfig {

  constructor(readonly eventId: number,
              readonly searchToFieldConfigs: Map<string, SearchToFormFieldConfig>,
              readonly successRedirectUrl?: string) {
  }
}
