/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 */
export function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function isClassInstance(item: any): boolean {
  // Even if item is an object, it might not have a constructor as in the
  // case when it is a null-prototype object, i.e. created using `Object.create(null)`.
  return (
    isObject(item) && item.constructor && item.constructor.name !== 'Object'
  );
}

/**
 * An extremely fast function for deep-cloning an object which only contains simple
 * values, i.e. primitives, arrays and nested simple objects.
 */
export function simpleDeepClone<T extends string | number | any[] | object>(
  input: T
): T {
  // if not array or object or is null return self
  if (typeof input !== 'object' || input === null) {
    return input;
  }
  let output: any;
  let i: number | string;
  // handle case: array
  if (input instanceof Array) {
    let l;
    output = [] as any[];
    for (i = 0, l = input.length; i < l; i++) {
      output[i] = simpleDeepClone(input[i]);
    }
    return output;
  }
  if (isClassInstance(input)) {
    return input;
  }
  // handle case: object
  output = {};
  for (i in input) {
    // eslint-disable-next-line no-prototype-builtins
    if (input.hasOwnProperty(i)) {
      output[i] = simpleDeepClone((input as any)[i]);
    }
  }
  return output;
}
