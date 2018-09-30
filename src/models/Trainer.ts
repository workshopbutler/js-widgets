import getLangCode from '../utils/language';
import SocialLinks from './SocialLinks';
import Statistics from './Statistics';

/**
 * A trainer
 */
export default class Trainer {

  protected static getCountry(jsonData: any): string {
    if (jsonData.country) {
      return jsonData.country;
    } else if (jsonData.address && jsonData.address.country) {
      return jsonData.address.country;
    } else {
      return '';
    }
  }

  options: any;
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly photo: string;
  readonly bio: string;
  readonly url?: string;
  readonly country: string;
  readonly languages: string[];
  readonly yearsOfExperience: number;
  readonly numberOfEvents: number;
  readonly badges: any[];
  readonly socialLinks: SocialLinks;
  readonly publicStats: Statistics;
  readonly privateStats: Statistics;
  readonly recentPublicStats: Statistics;
  readonly recentPrivateStats: Statistics;
  readonly testimonials: any[];

  constructor(jsonData: any, options: any) {
    this.id = jsonData.id;
    this.firstName = jsonData.first_name;
    this.lastName = jsonData.last_name;
    this.photo = jsonData.photo;
    this.bio = jsonData.bio;
    this.email = jsonData.email_address;
    this.yearsOfExperience = jsonData.years_of_experience;
    this.numberOfEvents = jsonData.number_of_events;
    this.badges = jsonData.badges;
    this.socialLinks = {
      blog: jsonData.blog,
      facebook: jsonData.facebook_url,
      googlePlus: jsonData.google_plus_url,
      linkedIn: jsonData.linkedin_url,
      twitter: `https://twitter.com/${jsonData.twitter_handle}`,
      website: jsonData.website,
    };

    this.publicStats = this.getStatistics(jsonData, true, false);
    this.privateStats = this.getStatistics(jsonData, false, false);
    this.recentPublicStats = this.getStatistics(jsonData, true, true);
    this.recentPrivateStats = this.getStatistics(jsonData, false, true);
    this.testimonials = jsonData.endorsements;

    this.country = Trainer.getCountry(jsonData);
    this.url = options.trainerPageUrl ? `${options.trainerPageUrl}?id=${this.id}` : undefined;
    this.languages = jsonData.languages ?
      jsonData.languages.map((language: string) => getLangCode(language)) : [];
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
    return this.badges.map((badge) => badge.name);
  }

  /**
   * Returns a specific type of statistics
   * @param jsonData JSON data from Workshop Butler API
   * @param {boolean} publicWorkshops True if the statistics is from public workshops
   * @param {boolean} recentWorkshops True if the statistic is from recent workshops
   * @return {Statistics}
   */
  private getStatistics(jsonData: any, publicWorkshops: boolean, recentWorkshops: boolean): Statistics {
    if (jsonData.statistics) {
      const stats = jsonData.statistics;
      if (publicWorkshops) {
        if (recentWorkshops) {
          return new Statistics(stats.recent_number_of_public_evaluations, stats.recent_public_median,
            stats.recent_public_nps, stats.recent_public_rating, stats.recent_public_impressions);
        } else {
          return new Statistics(stats.number_of_public_evaluations, stats.public_median,
            stats.public_nps, stats.public_rating, stats.public_impressions);
        }
      } else {
        if (recentWorkshops) {
          return new Statistics(stats.recent_number_of_private_evaluations, stats.recent_private_median,
            stats.recent_private_nps, stats.recent_private_rating, stats.recent_private_impressions);
        } else {
          return new Statistics(stats.number_of_private_evaluations, stats.private_median,
            stats.private_nps, stats.private_rating, stats.private_impressions);
        }
      }
    } else {
      return new Statistics(0, 0, 0, 0, {});
    }
  }
}
