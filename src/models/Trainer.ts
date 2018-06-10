import {getCountryName} from "../common/helpers/_countries";
import SocialLinks from "./SocialLinks";
import Statistics from "./Statistics";

/**
 * A trainer
 */
export default class Trainer {
    options: any;
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly photo: string;
    readonly bio: string;
    readonly url: string;
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
    readonly endorsements: any[];

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
        this.socialLinks = { website: jsonData.website,
            blog: jsonData.blog,
            facebook: jsonData.facebook_url,
            twitter: `https://twitter.com/${jsonData.twitter_handle}`,
            linkedIn: jsonData.linkedin_url,
            googlePlus: jsonData.google_plus_url };

        this.publicStats = this.getStatistics(jsonData, true, false);
        this.privateStats = this.getStatistics(jsonData, false, false);
        this.recentPublicStats = this.getStatistics(jsonData, true, true);
        this.recentPrivateStats = this.getStatistics(jsonData, false, true);
        this.endorsements = jsonData.endorsements;

        this.country = this.getCountryName(jsonData);
        this.url = `${options.trainerPageUrl}?id=${this.id}`;
        this.languages = jsonData.languages;
    }

    private getCountryName(jsonData: any): string {
        if (jsonData.country) {
            return getCountryName(jsonData.country)
        } else if (jsonData.address && jsonData.address.country) {
            return getCountryName(jsonData.address.country)
        } else {
            return '';
        }
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
                        stats.recent_public_nps, stats.recent_public_rating)
                } else {
                    return new Statistics(stats.number_of_public_evaluations, stats.public_median,
                        stats.public_nps, stats.public_rating)
                }
            } else {
                if (recentWorkshops) {
                    return new Statistics(stats.recent_number_of_private_evaluations, stats.recent_private_median,
                        stats.recent_private_nps, stats.recent_private_rating)
                } else {
                    return new Statistics(stats.number_of_private_evaluations, stats.private_median,
                        stats.private_nps, stats.private_rating)
                }
            }
        } else {
            return new Statistics(0, 0, 0, 0);
        }
    }
}
