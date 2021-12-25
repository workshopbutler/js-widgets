import IPlainObject from '../../interfaces/IPlainObject';
import ForwardSearchParamsSetting, {
  ForwardSearchParamsSettingType,
} from '../../widgets/config/ForwardSearchParamsSetting';

/**
 * Contains the logic for the event registration
 */
export default class RegistrationPage {

  readonly external: boolean;
  readonly url?: string;
  readonly passQueryParams: ForwardSearchParamsSetting;

  constructor(attrs: IPlainObject, registrationUrl: string | null = null,
              forwardSearchParams: ForwardSearchParamsSettingType,
              eventId: string) {
    if (attrs) {
      this.external = attrs.external;
      this.url = attrs.url;
    }
    this.passQueryParams = new ForwardSearchParamsSetting(forwardSearchParams);
    if (!this.external && registrationUrl) {
      this.url = this.passQueryParams.createUrl(registrationUrl, {id: eventId});
    }
  }

}
