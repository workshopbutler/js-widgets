import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Configuration for 'Upcoming event' button
 */
export default class UpcomingEventButtonConfig {

  /**
   * True if the button should lead to the registration page, not the event page
   */
  readonly registration: boolean;

  /**
   * URL target (_self, _blank, etc). Default is '_self'
   */
  readonly target: string;

  /**
   * Button's title
   */
  readonly title: string | null;

  /**
   * Title to show if no next event found
   */
  readonly noEventTitle: string | null;

  constructor(options: IPlainObject) {
    this.registration = options.registration !== undefined ? options.registration : false;
    this.target = options.target !== undefined ? options.target : '_self';
    this.title = options.title !== undefined ? options.title : null;
    this.noEventTitle = options.noEventTitle !== undefined ? options.noEventTitle : null;
  }
}
