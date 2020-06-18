import { DateTime, Info } from 'luxon';

// Now we can easily mock this function with fixed time
function getLocalTime(): DateTime {
  return DateTime.local();
}

export {
  Info,
  DateTime,
  getLocalTime,
};
