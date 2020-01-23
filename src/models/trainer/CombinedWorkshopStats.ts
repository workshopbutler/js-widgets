import WorkshopStats from './WorkshopStats';
import IPlainObject from '../../interfaces/IPlainObject';

export default class CombinedWorkshopStats {

  static fromJSON(json: IPlainObject): CombinedWorkshopStats {
    return new CombinedWorkshopStats(WorkshopStats.fromJSON(json.public),
      WorkshopStats.fromJSON(json.private), json.workshops);
  }

  constructor(readonly publicStats: WorkshopStats,
              readonly privateStats: WorkshopStats, readonly total: number) {
  }
}
