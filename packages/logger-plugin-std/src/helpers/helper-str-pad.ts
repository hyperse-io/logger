/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
 * @param str Duplicate string
 * @param count Duplicate count
 */
const repeat = (str = '', count = 0) => {
  if (count < 0) {
    throw new RangeError('repeat count must be non-negative');
  }
  if (count === Infinity) {
    throw new RangeError('repeat count must be less than infinity');
  }
  // floors and rounds-down it.
  count = count | 0;
  if (str.length === 0 || count === 0) {
    return '';
  }
  // Ensuring count is a 31-bit integer allows us to heavily optimize the
  // main part. But anyway, most current (August 2014) browsers can't handle
  // strings 1 << 28 chars or longer, so:
  if (str.length * count >= 1 << 28) {
    throw new RangeError('repeat count must not overflow maximum string size');
  }
  const rpts: string[] = [];
  for (let i = 0; i < count; i++) {
    rpts.push(str);
  }
  return rpts.join('');
};

/**
 * Fill the string left or right
 * @param str String to be processed
 * @param length Total length of string will be filled to e.g. `-5` | `5` symbol `-` indicates directory `left`
 * @param value The default string to populate
 */
export const strPad = (str: string, length = 0, value = ' '): string => {
  str = str || '';
  const len = Math.abs(length);
  if (len <= str.length) {
    return str;
  }
  const repeatStr = repeat(value, len - str.length);
  return length < 0 ? repeatStr + str : str + repeatStr;
};

export const strTimePad = (time: string | number) => {
  return strPad(String(time), -2, '0');
};
