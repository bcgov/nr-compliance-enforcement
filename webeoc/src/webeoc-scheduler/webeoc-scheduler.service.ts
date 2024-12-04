import { Injectable, Logger } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";
import { ComplaintsPublisherService } from "../publishers/complaints-publisher.service";
import { Complaint } from "src/types/complaint-type";
import axios, { AxiosRequestConfig } from "axios";
import { CronJob } from "cron";
import { ComplaintUpdate } from "src/types/complaint-update-type";
import { toZonedTime, format } from "date-fns-tz";
import { WEBEOC_FLAGS } from "src/common/webeoc-flags";
import { OPERATIONS } from "src/common/constants";
import { WEBEOC_API_PATHS } from "src/common/webeoc-api-paths";
import { ActionTaken } from "src/types/actions-taken/action-taken";
import { ActionsTakenPublisherService } from "src/publishers/actions-taken-publisher.service";
import { randomUUID } from "crypto";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class WebEocScheduler {
  private cookie: string;
  private cronJob: CronJob;
  private readonly logger = new Logger(WebEocScheduler.name);

  constructor(
    private complaintsPublisherService: ComplaintsPublisherService,
    private readonly _actionsTakenPublisherService: ActionsTakenPublisherService,
  ) {}

  onModuleInit() {
    this.cronJob = new CronJob(this.getCronExpression(), async () => {
      //-- don't remove these items, these control complaints and complaint updates
      await this.fetchAndPublishComplaints(
        OPERATIONS.COMPLAINT,
        WEBEOC_API_PATHS.COMPLAINTS,
        WEBEOC_FLAGS.COMPLAINTS,
        this.publishComplaint.bind(this),
      );

      await this.fetchAndPublishComplaints(
        OPERATIONS.COMPLAINT_UPDATE,
        WEBEOC_API_PATHS.COMPLAINT_UPDATES,
        WEBEOC_FLAGS.COMPLAINT_UPDATES,
        this.publishComplaintUpdate.bind(this),
      );

      // handle actions taken
      await this._handleAction(
        () => this._fetchDataFromWebEOC(WEBEOC_API_PATHS.ACTIONS_TAKEN),
        this._publishAction.bind(this),
      );

      // handle actions taken updates
      await this._handleAction(
        () => this._fetchDataFromWebEOC(WEBEOC_API_PATHS.ACTIONS_TAKEN_UPDATES),
        this._publishActionUpdate.bind(this),
      );
    });

    this.cronJob.start();
  }

  private getCronExpression(): string {
    const defaultCron = CronExpression.EVERY_5_MINUTES;
    const envCronExpression = process.env.WEBEOC_CRON_EXPRESSION || defaultCron;
    this.logger.debug(`Grabbing complaints from WebEOC as per cron schedule ${envCronExpression}`);
    return envCronExpression;
  }

  // Method to write data to a file
  private async logPollingActivity(operationType: string, timeStamp: string, counter: number): Promise<void> {
    // Set the fileName to be the current date (for easy pruning afterwards)
    const fileName = `${operationType}_${timeStamp.substring(0, 10)}.log`;

    // Get the file path
    const filePathEnv = process.env.LOG_PATH || "/mnt/data"; // Default to '/mnt/data' if the env variable is not set
    const filePath = path.join(filePathEnv, fileName);

    // Set the message
    const message = `${timeStamp}: Logged ${counter} ${operationType}`;

    try {
      await fs.promises.appendFile(filePath, message + "\n", "utf8");
    } catch (err) {
      this.logger.error(`Error writing to file ${filePath}: ${err.message}`);
      throw new Error("Failed to write data to file");
    }
  }

  private async fetchAndPublishComplaints(
    operationType: string,
    urlPath: string,
    flagName: string,
    publishMethod: (data: any) => Promise<void>,
  ) {
    try {
      const timeStamp = this.formatDate(new Date());

      await this.authenticateWithWebEOC();

      const data = await this.fetchDataFromWebEOC(urlPath, flagName);

      this.logger.debug(`Found ${data?.length} ${operationType} from WebEOC`);

      let counter = 0;
      for (const item of data) {
        counter++;
        await publishMethod(item);
      }

      this.logger.debug(`Published ${counter} ${operationType} from WebEOC`);

      if (data?.length != counter) {
        this.logger.error("Error publishing some objects to NATS. Check logs for more detail.");
      }

      await this.logPollingActivity(operationType, timeStamp, counter);
    } catch (error) {
      this.logger.error(`Unable to fetch data from WebEOC`, error);
    }
  }

  private async authenticateWithWebEOC(): Promise<string> {
    this.logger.debug(`Grabbing complaints from ${process.env.WEBEOC_URL}`);
    const authUrl = `${process.env.WEBEOC_URL}/sessions`;

    const credentials = {
      username: process.env.WEBEOC_USERNAME,
      password: process.env.WEBEOC_PASSWORD,
      position: process.env.WEBEOC_POSITION,
      incident: process.env.WEBEOC_INCIDENT,
    };

    const config: AxiosRequestConfig = {
      withCredentials: true,
    };

    try {
      const response = await axios.post(authUrl, credentials, config);
      this.cookie = response.headers["set-cookie"][0];
      return this.cookie;
    } catch (error) {
      this.logger.error("Error authenticating with WebEOC:", error);
      throw error;
    }
  }

  // Filter the complaints to only include complaints with a given flag (indicating the type of data: complaint, update, action taken, etc), or complaints where the violation type is Waste or Pesticide (which
  // are complaints needed for CEEB (where the violation type is waste or pesticide, accross all regions)
  private _filterComplaints(complaints: any[], flagName: string) {
    return complaints.filter((complaint: any) => {
      if (flagName === WEBEOC_FLAGS.COMPLAINTS) {
        return (
          complaint.flag_COS === "Yes" ||
          complaint.violation_type === "Waste" ||
          complaint.violation_type === "Pesticide"
        );
      } else if (flagName === WEBEOC_FLAGS.COMPLAINT_UPDATES) {
        return (
          complaint.flag_UPD === "Yes" ||
          complaint.update_violation_type === "Waste" ||
          complaint.update_violation_type === "Pesticide"
        );
      }
    });
  }

  private async fetchDataFromWebEOC(urlPath: string, flagName: string): Promise<any[]> {
    const dateFilter = this.getDateFilter();
    const url = `${process.env.WEBEOC_URL}/${urlPath}`;
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: this.cookie,
      },
    };

    // default filter grabs complaints that are newer than a specific date
    const filterItems = [dateFilter];

    // construct the body of the request
    const body = {
      customFilter: {
        boolean: "and",
        items: filterItems,
      },
    };

    try {
      const response = await axios.post(url, body, config);
      const complaints = response.data;

      const filteredComplaints = this._filterComplaints(complaints, flagName);

      return filteredComplaints;
    } catch (error) {
      this.logger.error(`Error fetching data from WebEOC at ${urlPath}:`, error);
      throw error;
    }
  }

  private getDateFilter() {
    const timeZone = "America/Los_Angeles"; // This timezone automatically handles PDT/PST

    // Get the current date in UTC
    const currentUtcDate = new Date();
    // Convert the current date in UTC to the appropriate Pacific Time (PDT/PST)
    const complaintsAsOfDate = toZonedTime(currentUtcDate, timeZone);
    const complaintHistorySeconds = parseInt(process.env.WEBEOC_COMPLAINT_HISTORY_SECONDS || "600"); // default to 10 minutes (600 seconds)

    if (isNaN(complaintHistorySeconds)) {
      throw new Error("WEBEOC_COMPLAINT_HISTORY_SECONDS is not a valid number");
    }
    this.logger.debug(`Finding complaints less than ${complaintHistorySeconds} seconds old`);

    complaintsAsOfDate.setSeconds(complaintsAsOfDate.getSeconds() - complaintHistorySeconds);
    this.logger.debug(`Finding complaints greater than ${complaintsAsOfDate.toISOString()}`);

    const formattedDate = this.formatDate(complaintsAsOfDate);
    return {
      fieldname: "entrydate",
      operator: "GreaterThan",
      fieldvalue: formattedDate,
    };
  }

  private async publishComplaint(complaint: Complaint) {
    await this.complaintsPublisherService.publishComplaintsFromWebEOC(complaint);
  }

  private async publishComplaintUpdate(complaintUpdate: ComplaintUpdate) {
    await this.complaintsPublisherService.publishComplaintUpdatesFromWebEOC(complaintUpdate);
  }

  private formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd HH:mm:ss");
  }

  private _fetchDataFromWebEOC = async (path: string): Promise<Complaint[]> => {
    const dateFilter = this.getDateFilter();
    const url = `${process.env.WEBEOC_URL}/${path}`;
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: this.cookie,
      },
    };

    const body = {
      customFilter: {
        boolean: "and",
        items: [dateFilter],
      },
    };

    try {
      const response = await axios.post(url, body, config);
      return response.data as Complaint[];
    } catch (error) {
      this.logger.error(`Error fetching data from WebEOC at ${path}:`, error);
      throw error;
    }
  };

  private _handleAction = async (
    fetchMethod: () => Promise<any>,
    publishMethod: (item: ActionTaken) => Promise<void>,
  ) => {
    try {
      await this.authenticateWithWebEOC();
      const data = await fetchMethod();

      if (data) {
        this.logger.debug(`Found ${data.length} action taken from WebEOC`);

        for (const item of data) {
          await publishMethod(item);
        }
      }
    } catch (error) {
      this.logger.error(`Unable to fetch data from WebEOC`, error);
    }
  };

  private _publishAction = async (action: ActionTaken) => {
    //-- apply an action_taken_guid
    action.action_taken_guid = randomUUID();

    await this._actionsTakenPublisherService.publishStagedActionTaken(action);
  };

  private _publishActionUpdate = async (action: ActionTaken) => {
    //-- apply an action_taken_guid
    action.action_taken_guid = randomUUID();

    await this._actionsTakenPublisherService.publishStagedActionTakenUpdate(action);
  };
}
