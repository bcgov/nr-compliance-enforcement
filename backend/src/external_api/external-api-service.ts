import { ConfigurationService } from "src/v1/configuration/configuration.service";

export interface ExternalApiService {
  readonly authApi: string;
  readonly baseUri: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly grantType: string;

  readonly configService: ConfigurationService;

  authenticate(): Promise<string>;
}
