import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Contains different social links a trainer can have
 */
export default class SocialLinks {

  static fromJSON(json: IPlainObject): SocialLinks {
    if (json) {
      return new SocialLinks(json.website, json.blog, json.twitter, json.linkedin, json.facebook);
    } else {
      return new SocialLinks();
    }
  }

  isEmpty(): boolean {
    return !Object.values(this).some(v => !!v);
  }

  constructor(readonly website?: string,
              readonly blog?: string,
              readonly twitter?: string,
              readonly linkedIn?: string,
              readonly facebook?: string) {
  }
}
