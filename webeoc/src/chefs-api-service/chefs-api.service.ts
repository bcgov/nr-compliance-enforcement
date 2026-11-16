import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { CHEFS_APIS } from "../common/constants";
import { Complaint } from "../types/complaint-type";
import { ChefsSubmissionResponse } from "../types/chefs/chefs-submission-type";

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
    try {
      const apiUrl = `${process.env.CHEFS_API_URL}/${CHEFS_APIS.SUBMISSIONS}/${submissionId}`;
      this.logger.debug(`Fetching CHEFS submission ${submissionId}. API URL: ${apiUrl}`);

      const response = await axios.get<ChefsSubmissionResponse>(apiUrl, this._apiConfig);
      return response.data.submission.submission.data;
    } catch (error) {
      this.logger.error("Error calling CHEFS Submission API:", error);
      throw error;
    }
  }
}
