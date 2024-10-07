export type ApiType<T = undefined> = {
  success: boolean;
  message: string;
  data: T;
};
