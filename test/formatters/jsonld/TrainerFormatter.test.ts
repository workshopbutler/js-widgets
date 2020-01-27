import * as chai from 'chai';
import 'chai/register-should';
import TrainerFormatter from '../../../src/formatters/jsonld/TrainerFormatter';
import Trainer from '../../../src/models/Trainer';
import TrainerStats from '../../../src/models/trainer/TrainerStats';
import CombinedWorkshopStats from '../../../src/models/trainer/CombinedWorkshopStats';
import WorkshopStats from '../../../src/models/trainer/WorkshopStats';

const expect = chai.expect;

describe('JSON-LD formatted Trainer', () => {
  const workshopStats = new WorkshopStats(1, 1, 1, 1, {});
  const combinedStats = new CombinedWorkshopStats(workshopStats, workshopStats, 0);
  const stats = new TrainerStats(combinedStats, combinedStats);
  const bill = new Trainer({}, 1, 'Bill', 'Lucky', '', '', stats);

  it('should have a correct type', () => {
    const jsonLd = TrainerFormatter.format(bill);
    expect(jsonLd['@type']).to.eq('Person');
  });
  it('should have a full name', () => {
    const jsonLd = TrainerFormatter.format(bill);
    expect(jsonLd.name).to.eq('Bill Lucky');
  });
});
