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
    31536000000,
    'y'
  );
  // MONTHS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    2592000000,
    'm'
  );
  // DAYS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    86400000,
    'd'
  );
  // HOURS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    3600000,
    'h'
  );
  // MINUTES
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    60000,
    'min'
  );
  // SECONDS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    1000,
    's'
  );
  // MILLISECONDS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    1,
    'ms'
  );
  return color(formattedChangeInTime);
};
