import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { PROCESSING_APIS, STAGING_APIS } from "src/common/constants";

import { ActionTakenDto } from "src/types/actions-taken/action-taken-dto";

@Injectable()
export class ComplaintApiService {
  private readonly logger = new Logger(ComplaintApiService.name);
  private readonly _apiConfig = {
    headers: {
      "x-api-key": process.env.COMPLAINTS_API_KEY,
    },
  };

  //-- send the action taken to the complaint-management backend and add
  //-- the action taken to the staging table for processing
  stageActionTaken = async (record: ActionTakenDto) => {
    try {
      const url = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${STAGING_APIS.ACTION_TAKEN}`;
      this.logger.debug(`Posting action-taken to staging. API URL: ${url}`);

      await axios.post(url, record, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling ActionTaken Staging Api:", error);
      throw error;
    }
  };

  //-- send the action taken to the complaint-management backend and add
  //-- the action taken to the staging table for processing
  stageActionTakenUpdate = async (record: ActionTakenDto) => {
    try {
      const url = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${STAGING_APIS.UPDATE_ACTION_TAKEN}`;
      this.logger.debug(`Posting action-taken-update to staging. API URL: ${url}`);

      await axios.post(url, record, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling ActionTaken Staging Api:", error);
      throw error;
    }
  };

  publishActionTaken = async (id: string) => {
    try {
      const url = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${PROCESSING_APIS.ACTION_TAKEN}/${id}`;
      this.logger.debug(`Processing action-taken from staging. API URL: ${url}`);

      await axios.post(url, {}, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling ActionTaken Processing Api:", error);
      throw error;
    }
  };

  publishActionTakenUpdate = async (id: string) => {
    try {
      const url = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${PROCESSING_APIS.UPDATE_ACTION_TAKEN}/${id}`;
      this.logger.debug(`Processing action-taken-update from staging. API URL: ${url}`);

      await axios.post(url, {}, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling ActionTaken Processing Api:", error);
      throw error;
    }
  };
}
