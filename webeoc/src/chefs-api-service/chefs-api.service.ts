import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import { CHEFS_APIS } from "../common/constants";
import { Complaint } from "../types/complaint-type";
import { ChefsSubmissionResponse } from "../types/chefs/chefs-submission-type";
import { HttpsProxyAgent } from "https-proxy-agent";

const httpsProxyAgent = process.env.HTTPS_PROXY ? new HttpsProxyAgent(process.env.HTTPS_PROXY) : undefined;

@Injectable()
export class ChefsApiService {
  private readonly logger = new Logger(ChefsApiService.name);
  // CHEFS API keys use basic auth: the username is the form id and the password is the form's API key.
  private readonly _apiConfig = {
    auth: {
      username: process.env.CHEFS_FORM_ID,
      password: process.env.CHEFS_API_KEY,
    },
  };

  // fetch a submission's form data from CHEFS
  async getSubmissionData(submissionId: string): Promise<Complaint> {
    // CHEFS API keys use basic auth: the username is the form id and the password is the form's API key.
    let config: AxiosRequestConfig = {
      auth: {
        username: process.env.CHEFS_FORM_ID,
        password: process.env.CHEFS_API_KEY,
      },
    };
    if (process.env.HTTPS_PROXY) {
      config = {
        ...config,
        proxy: false,
        httpsAgent: httpsProxyAgent,
      };
    }

    try {
      const apiUrl = `${process.env.CHEFS_API_URL}/${CHEFS_APIS.SUBMISSIONS}/${submissionId}`;
      this.logger.debug(`Fetching CHEFS submission ${submissionId}. API URL: ${apiUrl}`);

      const response = await axios.get<ChefsSubmissionResponse>(apiUrl, config);
      return response.data.submission.submission.data;
    } catch (error) {
      this.logger.error("Error calling CHEFS Submission API:", error);
      throw error;
    }
  }
}
