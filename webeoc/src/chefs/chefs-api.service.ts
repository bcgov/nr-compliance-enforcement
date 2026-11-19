import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import { CHEFS_APIS } from "../common/constants";
import { ChefsSubmissionData, ChefsSubmissionResponse } from "../types/chefs/chefs-submission-type";

@Injectable()
export class ChefsApiService {
  private readonly logger = new Logger(ChefsApiService.name);
  // CHEFS API keys use basic auth: the username is the form id and the password is the form's API key.
  private readonly _apiConfig: AxiosRequestConfig = {
    auth: {
      username: process.env.CHEFS_FORM_ID,
      password: process.env.CHEFS_API_KEY,
    },
    proxy: false, // do not use the proxy
  };

  // fetch a submission's form data from CHEFS
  async getSubmissionData(submissionId: string): Promise<ChefsSubmissionData> {
    try {
      const apiUrl = `${process.env.CHEFS_API_URL}/${CHEFS_APIS.SUBMISSIONS}/${submissionId}`;
      this.logger.debug(`Fetching CHEFS submission ${submissionId}. API URL: ${apiUrl}`);

      const response = await axios.get<ChefsSubmissionResponse>(apiUrl, this._apiConfig);
      const { confirmationId, submission } = response.data.submission;

      return { ...submission.data, chefs_confirmation_id: confirmationId };
    } catch (error) {
      this.logger.error("Error calling CHEFS Submission API:", error);
      throw error;
    }
  }
}
