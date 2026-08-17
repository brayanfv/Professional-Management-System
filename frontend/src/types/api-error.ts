export type ApiError = {
  timestamp?: string;
  status: number;
  error?: string;
  code: string;
  message: string;
  path?: string;
  fields?: Record<string, string>;
};
