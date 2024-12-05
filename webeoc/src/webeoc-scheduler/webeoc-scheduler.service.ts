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
    private readonly complaintsPublisherService: ComplaintsPublisherService,
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

      await this.fetchAndPublishComplaints(
        OPERATIONS.ACTION_TAKEN,
        WEBEOC_API_PATHS.ACTIONS_TAKEN,
        WEBEOC_FLAGS.ACTIONS_TAKEN,
        this._publishAction.bind(this),
      );

      await this.fetchAndPublishComplaints(
        OPERATIONS.ACTION_TAKEN_UPDATE,
        WEBEOC_API_PATHS.ACTIONS_TAKEN_UPDATES,
        WEBEOC_FLAGS.ACTIONS_TAKEN_UPDATES,
        this._publishActionUpdate.bind(this),
      );
    });

    this.cronJob.start();
  }

  private getCronExpression(): string {
    const defaultCron = CronExpression.EVERY_5_MINUTES;
    const envCronExpression = process.env.WEBEOC_CRON_EXPRESSION || defaultCron;
    this.logger.debug(`Polling WebEOC as per cron schedule ${envCronExpression}`);
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

  private getLastPolledDate(operationType: string): Date {
    const fileName = `${operationType}_${new Date().toISOString().substring(0, 10)}.log`; // Use today's date for the file
    const filePathEnv = process.env.LOG_PATH || "/mnt/data"; // Default to '/mnt/data'
    const filePath = path.join(filePathEnv, fileName);
    //Failsafe in case anything goes wrong (5 minutes ago)
    const defaultDate = new Date();
    defaultDate.setUTCMinutes(defaultDate.getUTCMinutes() - 5);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return defaultDate; // Return the default date if the file doesn't exist
    }

    try {
      const data = fs.readFileSync(filePath, "utf8"); // Synchronously read the file
      const lines = data.trim().split("\n"); // Split the file by newlines and get the last line

      if (lines.length === 0) {
        return defaultDate; // If the file existed but was empty return the default date
      }

      const lastLine = lines[lines.length - 1]; // Get the last line
      const timestampString = lastLine.substring(0, 19); // Extract the first 19 characters (ISO 8601 format)

      // Parse the timestamp string to a Date object
      const timestamp = new Date(timestampString); // Convert the string to a Date object

      if (isNaN(timestamp.getTime())) {
        this.logger.error(`Invalid timestamp format: ${timestampString}`);
        return defaultDate; // If the file existed, had stuff in it but the time couldn't be parsed out return the default date
      }

      return timestamp; // Return the Date object
    } catch (err) {
      this.logger.error(`Error reading file ${filePath}: ${err.message}`);
      return defaultDate; // Return defaultDate if any error occurs
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

      const data = await this.fetchDataFromWebEOC(urlPath, flagName, operationType);

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
    this.logger.debug(`Authenticating with webEOC from ${process.env.WEBEOC_URL}`);
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
      } else if (flagName === WEBEOC_FLAGS.ACTIONS_TAKEN) {
        return complaint.flag_AT === "Yes";
      } else if (flagName === WEBEOC_FLAGS.ACTIONS_TAKEN_UPDATES) {
        return complaint.flag_UAT === "Yes";
      }
    });
  }

  private async fetchDataFromWebEOC(urlPath: string, flagName: string, operationType: string): Promise<any[]> {
    const dateFilter = this.getDateFilter(operationType);
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

  private formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd HH:mm:ss");
  }

  private getDateFilter(operationType: string) {
    const timeZone = "America/Los_Angeles"; // This timezone automatically handles PDT/PST
    const lastPolledDate = this.getLastPolledDate(operationType);
    const complaintsAsOfDate = toZonedTime(lastPolledDate, timeZone);

    this.logger.debug(`Finding ${operationType} greater than ${complaintsAsOfDate.toISOString()}`);

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
