export type RequireOnly<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;
