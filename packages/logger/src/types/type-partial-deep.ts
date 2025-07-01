export type _DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer U>
    ? Array<_DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<_DeepPartial<U>>
      : T extends object
        ? DeepPartial<T>
        : T | undefined;

export type DeepPartial<T> = { [P in keyof T]?: _DeepPartial<T[P]> };
