import CombinedWorkshopStats from './CombinedWorkshopStats';
import IPlainObject from '../../interfaces/IPlainObject';

export default class TrainerStats {

  static fromJSON(json: IPlainObject): TrainerStats {
    return new TrainerStats(CombinedWorkshopStats.fromJSON(json.recent), CombinedWorkshopStats.fromJSON(json.total),
      json.years_of_experience);
  }

  constructor(readonly recent: CombinedWorkshopStats,
              readonly total: CombinedWorkshopStats,
              readonly yearsOfExperience?: number) {
  }
}
