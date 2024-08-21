import { Inject, Injectable, Logger } from "@nestjs/common";
import { ExternalApiService } from "../external-api-service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { get, post } from "../../helpers/axios-api";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { CONFIGURATION_CODES } from "../../types/configuration-codes";
import { constants } from "http2";
import FormData = require("form-data");
import fs = require("fs");
import { join } from "path";

@Injectable()
export class CssService implements ExternalApiService {
  private readonly logger = new Logger(CssService.name);

  readonly authApi: string;
  readonly baseUri: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly grantType: string;
  readonly env: string;

  @Inject(ConfigurationService)
  readonly configService: ConfigurationService;

  constructor() {
    this.authApi = process.env.CSS_TOKEN_URL;
    this.baseUri = process.env.CSS_URL;
    this.clientId = process.env.CSS_CLIENT_ID;
    this.clientSecret = process.env.CSS_CLIENT_SECRET;
    this.grantType = "client_credentials";
    this.env = process.env.ENVIRONMENT;
  }

  private _isCachedTemplateValid = async (apiToken: string, uid: string): Promise<boolean> => {
    let url = `${this.baseUri}/api/v2/template/${uid}`;
    const headers: any = {
      "Content-Type": "application/json",
    };

    try {
      const response: AxiosResponse = await get(apiToken, url, headers);
      const { status } = response;
      if (status === constants.HTTP_STATUS_OK) {
        return true;
      }
    } catch (error) {
      this.logger.log(`Template not cached: ${error}`);
      return false;
    }
  };

  private _getTemplateId = async (code: string) => {
    try {
      const config = await this.configService.findByCode(code);

      if (config) {
        return config.configurationValue;
      }
    } catch (error) {
      this.logger.error(`Unable to retrieve template ${code} hash`);
      throw Error(`Unable to retrieve template ${code} hash`);
    }
  };

  private _applyData = async (data: any, name: string) => {
    return {
      data: {
        ...data,
      },
      options: {
        cacheReport: false,
        convertTo: "pdf",
        overwrite: true,
        reportName: name,
      },
    };
  };

  authenticate = async (): Promise<string> => {
    const response: AxiosResponse = await axios.post(
      this.authApi,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: this.grantType,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return response?.data?.access_token;
  };

  getUserIdirByName = async (firstName, lastName): Promise<AxiosResponse> => {
    try {
      const apiToken = await this.authenticate();
      const url = `${this.baseUri}/api/v1/${this.env}/idir/users?firstName=${firstName}&lastName=${lastName}`;
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };
      const response = await get(apiToken, url, config);
      // if (response?.data.data.length === 1) {
      //   const roleUrl = `${this.baseUri}/api/v1/integrations/4794/${this.env}/users/${response.data.data[0].username}/roles`;
      //   const roleRes = await get(apiToken, roleUrl, config);
      //   console.log(roleRes.data);
      //   return roleRes.data;
      // }
      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to get user: ${firstName} ${lastName} - error: ${error}`);
      throw new Error(`exception: unable to get user: ${firstName} ${lastName} - error: ${error}`);
    }
  };

  updateUserRole = async (userIdir, roleName): Promise<AxiosResponse> => {
    try {
      const apiToken = await this.authenticate();
      const url = `${this.baseUri}/api/v1/integrations/4794/${this.env}/users/${userIdir}/roles`;
      const updateData = [{ name: roleName }];
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };
      const response = await axios.post(url, updateData, config);
      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to update user ${userIdir}  with role ${roleName} - error: ${error}`);
      throw new Error(`exception: unable to update user ${userIdir} with role ${roleName} - error: ${error}`);
    }
  };
}
