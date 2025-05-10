import { Inject, Injectable, Logger } from "@nestjs/common";
import { ExternalApiService } from "../external-api-service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ConfigurationService } from "../../v1/configuration/configuration.service";

@Injectable()
export class ChesService implements ExternalApiService {
  private readonly logger = new Logger(ChesService.name);

  readonly authApi: string;
  readonly baseUri: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly grantType: string;

  @Inject(ConfigurationService)
  readonly configService: ConfigurationService;

  constructor() {
    this.authApi = process.env.CHES_TOKEN_ENDPOINT;
    this.baseUri = process.env.CHES_URI;
    this.clientId = process.env.CHES_CLIENT_ID;
    this.clientSecret = process.env.CHES_CLIENT_SECRET;
    this.grantType = "client_credentials";
  }

  authenticate = async (): Promise<string> => {
    try {
      const response: AxiosResponse = await axios.post(
        this.authApi,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: this.grantType,
        },
        {
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      return response?.data?.access_token;
    } catch (error) {
      this.logger.error(`Error authenticating with CHES.`, error);
    }
  };

  sendEmail = async (
    senderEmailAddress,
    emailSubject,
    emailBody,
    recipientList: String[],
    ccList?: String[],
    attachments?: any[],
  ) => {
    try {
      const apiToken = await this.authenticate();

      const url = `${this.baseUri}/api/v1/email`;
      const config: AxiosRequestConfig = {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      };

      const payload = {
        attachments: attachments ?? [],
        bcc: [],
        bodyType: "html",
        body: emailBody,
        cc: ccList,
        delayTS: 0,
        encoding: "utf-8",
        from: `NatComplaints <${senderEmailAddress}>`,
        priority: "normal",
        subject: emailSubject,
        to: recipientList,
        tag: "complaint_referral",
      };

      const response = await axios.post(url, payload, config);
      return response;
    } catch (error) {
      this.logger.error(`Error sending email.`, error);
      throw new Error(`Error sending email.`, error);
    }
  };
}
