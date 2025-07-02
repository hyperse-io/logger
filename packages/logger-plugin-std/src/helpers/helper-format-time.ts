// Note: Time calculations use approximations:
// - Year = 365 days (ignoring leap years)
// - Month = 30 days (actual months vary 28-31 days)
const TIME_UNITS = {
  YEAR: 365 * 24 * 60 * 60 * 1000, // 31536000000
  MONTH: 30 * 24 * 60 * 60 * 1000, // 2592000000
  DAY: 24 * 60 * 60 * 1000, // 86400000
  HOUR: 60 * 60 * 1000, // 3600000
  MINUTE: 60 * 1000, // 60000
  SECOND: 1000, // 1000
  MILLISECOND: 1, // 1
} as const;

const addUnitOfTime = (
  prefix: string,
  time: Date,
  lastTime: Date,
  colorFn: (s: string) => string,
  unitValueInMilliseconds: number,
  unitName: string
) => {
  let remainder = time.getTime() - lastTime.getTime();
  const unitCount = Math.floor(remainder / unitValueInMilliseconds);

  remainder = remainder % unitValueInMilliseconds;
  return unitCount !== 0
    ? colorFn(prefix + unitCount + unitName) + ' '
    : unitValueInMilliseconds === 1
      ? colorFn(prefix + '0') + ' '
      : '';
};

export const formatTime = (
  time: Date,
  lastTime: Date,
  decorateColorFn: (s: string) => string,
  color: (s: string) => string,
  prefix: string
) => {
  let formattedChangeInTime = ' ';
  // YEARS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    TIME_UNITS.YEAR,
    'y'
  );
  // MONTHS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    TIME_UNITS.MONTH,
    'm'
  );
  // DAYS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    TIME_UNITS.DAY,
    'd'
  );
  // HOURS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    TIME_UNITS.HOUR,
    'h'
  );
  // MINUTES
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    TIME_UNITS.MINUTE,
    'min'
  );
  // SECONDS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    TIME_UNITS.SECOND,
    's'
  );
  // MILLISECONDS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    TIME_UNITS.MILLISECOND,
    'ms'
  );
  return color(formattedChangeInTime);
};
