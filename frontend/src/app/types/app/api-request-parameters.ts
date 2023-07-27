export interface ApiRequestParameters<T> {
  url: string;
  requiresAuthentication?: boolean;
  enableNotification?: boolean;
  params?: T;
}
