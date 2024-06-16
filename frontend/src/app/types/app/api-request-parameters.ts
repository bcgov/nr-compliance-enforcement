export interface ApiRequestParameters<T = {}> {
  url: string;
  requiresAuthentication?: boolean;
  enableNotification?: boolean;
  useArrayBuffer?: boolean;
  params?: T;
}
