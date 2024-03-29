import * as chai from 'chai';
import TrainerFormatter from '../../../src/formatters/jsonld/TrainerFormatter';
import Trainer from '../../../src/models/Trainer';
import TrainerStats from '../../../src/models/trainer/TrainerStats';
import CombinedWorkshopStats from '../../../src/models/trainer/CombinedWorkshopStats';
import WorkshopStats from '../../../src/models/trainer/WorkshopStats';
import Votes from '../../../src/models/Votes';

const expect = chai.expect;

describe('JSON-LD formatted Trainer', () => {
  const workshopStats = new WorkshopStats(1, 1, 1, 1, new Votes({}));
  const combinedStats = new CombinedWorkshopStats(workshopStats, workshopStats, 0);
  const stats = new TrainerStats(combinedStats, combinedStats);
  const bill = new Trainer({}, 1, 'Bill', 'Lucky', '', '', stats);

  it('should have a correct type', () => {
    const jsonLd = TrainerFormatter.format(bill);
    // @ts-ignore: as Person is a complex type, we can't use the type assertion
    expect(jsonLd['@type']).to.eq('Person');
  });
  it('should have family and given names', () => {
    const jsonLd = TrainerFormatter.format(bill);
    // @ts-ignore: as Person is a complex type, we can't use the type assertion
    expect(jsonLd.familyName).to.eq('Lucky');
    // @ts-ignore: as Person is a complex type, we can't use the type assertion
    expect(jsonLd.givenName).to.eq('Bill');
  });
});
