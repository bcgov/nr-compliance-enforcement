import { Inject, Injectable } from "@nestjs/common";
import { ConfigurationService } from "../configuration/configuration.service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import FormData from "form-data";
// import fs from "fs";
import { join } from "path";
import FormData = require("form-data");
import fs = require("fs");

@Injectable()
export class DocumentService {
  @Inject(ConfigurationService)
  private readonly configurationService: ConfigurationService;

  private _getCDOGsApiToken = async (): Promise<string> => {
    console.log("GET TOKEN");
    try {
      const response: AxiosResponse = await axios.post(
        process.env.COMS_JWT_AUTH_URI,
        {
          client_id: process.env.CDOGS_CLIENT_ID,
          client_secret: process.env.CDOGS_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
        {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return response?.data?.access_token;
    } catch (error) {
      console.log(error);
    }
  };

  /*  private getCDOGsApiToken() {
    return async () => {
      try {
        const response: AxiosResponse = await axios.post(
          process.env.COMS_JWT_AUTH_URI,
          qs.stringify({
            client_id: process.env.CDOGS_CLIENT_ID,
            client_secret: process.env.CDOGS_CLIENT_SECRET,
            grant_type: "client_credentials",
          }),
          {
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        console.log(response);

        return "token";
      } catch (error) {}
    };
  }*/

  uploadTemplate = async (path: string, token: string): Promise<string> => {
    const bodyFormData = new FormData();
    bodyFormData.append("template", fs.createReadStream(path));
    const headers: any = {
      ...bodyFormData.getHeaders(),
    };
    let url = `${process.env.CDOGS_URI}/template`;

    const uploadResponse: AxiosResponse = await this._post(token, url, bodyFormData, headers);
    return uploadResponse?.headers["x-template-hash"];
  };

  private _post = async (apiToken: string, url: string, data: any, headers?: any): Promise<AxiosResponse> => {
    const config: AxiosRequestConfig = {
      timeout: 30000,
    };
    if (!!headers) {
      config.headers = headers;
      config.headers.Authorization = `Bearer ${apiToken}`;
    } else {
      config.headers = {
        Authorization: `Bearer ${apiToken}`,
      };
    }
    return axios.post(url, data, config);
  };

  exportComplaint = async (id: string, type: string): Promise<any> => {
    try {
      let token = await this._getCDOGsApiToken();
      const path = join(process.cwd(), "templates/complaint/CDOGS-ERS-COMPLAINT-TEMPLATE-v1.docx");

      let result = await this.uploadTemplate(path, token);
      console.log(result);

      return token;
    } catch (error) {
      console.log("exception: export document", error);
      throw new Error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
    }
  };
}
