import {Person} from 'schema-dts';
import Trainer from '../../models/Trainer';

/**
 * Formats trainer to a JSON-LD format
 */
export default class TrainerFormatter {
  static format(trainer: Trainer): Person {
    return {
      '@type': 'Person',
      'name': trainer.fullName(),
    };
  }
}
