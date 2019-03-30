import * as chai from 'chai';
import 'chai/register-should';
import TrainerFormatter from '../../../src/formatters/jsonld/TrainerFormatter';
import Trainer from '../../../src/models/Trainer';

const expect = chai.expect;

describe('JSON-LD formatted Trainer', () => {
  const trainerJson = {
    first_name: 'Bill',
    last_name: 'Lucky',
  };
  const bill = new Trainer(trainerJson, {});

  it('should have a correct type', () => {
    const jsonLd = TrainerFormatter.format(bill);
    expect(jsonLd['@type']).to.eq('Person');
  });
  it('should have a full name', () => {
    const jsonLd = TrainerFormatter.format(bill);
    expect(jsonLd.name).to.eq('Bill Lucky');
  });
});
