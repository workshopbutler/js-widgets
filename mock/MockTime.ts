import { DateTime, Info } from 'luxon';

// Now we can easily mock this function with fixed time
function getLocalTime(): DateTime {
  return DateTime.fromFormat('2020-05-15', 'yyyy-MM-dd', {zone: 'UTC'});
}

export {
  Info,
  DateTime,
  getLocalTime,
};
