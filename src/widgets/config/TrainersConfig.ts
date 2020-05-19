import IPlainObject from '../../interfaces/IPlainObject';

/**
 * Configuration for trainers' block on the event page
 */
export default class TrainersConfig {

  /**
   * When true, the trainers who run the event are shown
   */
  readonly show: boolean;

  /**
   * When true, the trainers' bios are shown
   */
  readonly bio: boolean;

  constructor(options?: IPlainObject) {
    this.show = options?.show !== undefined ? options?.show : true;
    this.bio = options?.bio !== undefined ? options?.bio : false;
  }
}
