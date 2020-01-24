import IPlainObject from '../interfaces/IPlainObject';
import getLangCode from '../utils/language';
import SocialLinks from './trainer/SocialLinks';
import Testimonial from './trainer/Testimonial';
import TrainerStats from './trainer/TrainerStats';

/**
 * A trainer
 */
export default class Trainer {

  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly photo: string;
  readonly bio: string;
  readonly url?: string;
  readonly country: string | null;
  readonly languages: string[];
  readonly badges: any[];
  readonly socialLinks: SocialLinks;
  readonly stats: TrainerStats;

  /**
   * List of testimonials that the trainer has
   */
  readonly testimonials: any[];

  /**
   * List of countries the trainer works in
   */
  readonly worksIn: string[];

  constructor(json: IPlainObject, options: any) {
    this.id = json.id;
    this.firstName = json.first_name;
    this.lastName = json.last_name;
    this.photo = json.avatar;
    this.bio = json.bio;
    this.email = json.email_address;
    this.badges = json.badges;
    this.socialLinks = SocialLinks.fromJSON(json.social_links);
    this.stats = TrainerStats.fromJSON(json.statistics);
    this.testimonials = json.testimonials.map((testimonial: IPlainObject) => Testimonial.fromJSON(testimonial));

    this.country = json.address.country;
    this.url = options.trainerPageUrl ? this.getTrainerUrl(options.trainerPageUrl) : undefined;
    this.languages = json.languages ?
      json.languages.map((language: string) => getLangCode(language)) : [];

    this.worksIn = json.countries ? json.countries : [];
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
