import IPlainObject from '../interfaces/IPlainObject';
import getLangCode from '../utils/language';
import SocialLinks from './trainer/SocialLinks';
import Testimonial from './Testimonial';
import TrainerStats from './trainer/TrainerStats';

/**
 * A trainer
 */
export default class Trainer {

  static fromJSON(json: IPlainObject, options: IPlainObject): Trainer {
    const stats = TrainerStats.fromJSON(json.statistics);
    const socialLinks = SocialLinks.fromJSON(json.social_links);
    const testimonials = json.testimonials.map((testimonial: IPlainObject) => Testimonial.fromJSON(testimonial));
    const languages = json.languages ?
      json.languages.map((language: string) => getLangCode(language)) : [];
    const worksIn = json.countries ? json.countries : [];

    return new Trainer(options, json.id, json.first_name, json.last_name, json.email,
      json.bio, stats, languages, json.badges, socialLinks, testimonials, worksIn, json.avatar, json.address.country);
  }

  /**
   * Path to the trainer's page
   */
  readonly url?: string;

  constructor(options: IPlainObject,
              readonly id: number,
              readonly firstName: string,
              readonly lastName: string,
              readonly email: string,
              readonly bio: string,
              readonly stats: TrainerStats,
              readonly languages: string[] = [],
              readonly badges: any[] = [],
              readonly socialLinks: SocialLinks = new SocialLinks(),
              readonly testimonials: Testimonial[] = [], // list of testimonials the trainer has
              readonly worksIn: string[] = [], // List of countries the trainer works in
              readonly photo?: string,
              readonly country?: string) {
    this.url = options.trainerPageUrl ? this.getTrainerUrl(options.trainerPageUrl) : undefined;
  }


  /**
   * Returns the full name of the trainer
   * @return {string}
   */
  fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  /**
   * Returns the list of badge's name
   */
  nameOfBadges(): string[] {
    return this.badges.map(badge => badge.name);
  }

  private getTrainerUrl(baseUrl: string): string {
    return `${baseUrl}?id=${this.id}&name=${this.fullName()}`;
  }

}
