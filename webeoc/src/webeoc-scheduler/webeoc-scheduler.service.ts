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
  private readonly retentionDays = parseInt(process.env.WEBEOC_LOG_RETENTION_DAYS || "1");

  constructor(
    private readonly complaintsPublisherService: ComplaintsPublisherService,
    private readonly _actionsTakenPublisherService: ActionsTakenPublisherService,
  ) {}

  onModuleInit() {
    this.cronJob = new CronJob(this.getCronExpression(), async () => {
      //-- clean up old logs
      const logDir = process.env.WEBEOC_LOG_PATH || "/mnt/data";
      await this.cleanupOldLogs(logDir);

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
    const filePathEnv = process.env.WEBEOC_LOG_PATH || "/mnt/data"; // Default to '/mnt/data' if the env variable is not set
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

  private async cleanupOldLogs(logDir: string): Promise<void> {
    try {
      const files = await fs.promises.readdir(logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
      this.logger.debug(`Retention days: ${this.retentionDays}`);
      this.logger.debug(`Files: ${files}`);

      for (const file of files) {
        this.logger.debug(`File: ${file}`);
        if (file.endsWith(".log")) {
          const filePath = path.join(logDir, file);
          const datePart = file.match(/(\d{4}-\d{2}-\d{2})\.log$/);
          if (datePart) {
            const fileDate = new Date(datePart[1]);
            if (fileDate < cutoffDate) {
              // Compare with cutoffDate
              await fs.promises.unlink(filePath);
              this.logger.debug(`Deleted old log file: ${filePath}`);
            }
          }
        }
      }
    } catch (err) {
      this.logger.error(`Error during log cleanup in ${logDir}: ${err.message}`);
    }
  }

  private getMostRecentFile(operationType: string, filePathEnv: string): string | null {
    try {
      const files = fs
        .readdirSync(filePathEnv)
        .filter((file) => file.startsWith(`${operationType}_`) && file.endsWith(".log"));

      if (files.length === 0) {
        return null;
      }

      const sortedFiles = files
        .map((file) => {
          // Extract the date from the file name
          const datePart = file.substring(operationType.length + 1, file.length - 4); // Extract "YYYY-MM-DD" part
          const fileDate = new Date(datePart);
          return { file, fileDate };
        })
        .sort((a, b) => b.fileDate.getTime() - a.fileDate.getTime()); // Sort by date descending

      return sortedFiles[0].file; // Return the most recent file
    } catch (err) {
      this.logger.error(`Error reading files: ${err.message}`);
      return null;
    }
  }

  private getLastTimestampFromFile(filePath: string, defaultDate: Date): Date {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      const lines = data.trim().split("\n"); // Split by newlines and get the last line

      if (lines.length === 0) {
        return defaultDate; // If the file is empty, return the default date
      }

      const lastLine = lines[lines.length - 1]; // Get the last line
      const timestampString = lastLine.substring(0, 19); // Extract the first 19 characters (ISO 8601 format)

      // Parse the timestamp string to a Date object
      const timestamp = new Date(timestampString);

      if (isNaN(timestamp.getTime())) {
        this.logger.error(`Invalid timestamp format: ${timestampString}`);
        return defaultDate; // If the timestamp is invalid, return the default date
      }

      return timestamp; // Return the Date object
    } catch (err) {
      this.logger.error(`Error reading file ${filePath}: ${err.message}`);
      return defaultDate; // Return defaultDate if any error occurs
    }
  }

  private getLastPolledDate(operationType: string): Date {
    const filePathEnv = process.env.WEBEOC_LOG_PATH || "/mnt/data"; // Default to '/mnt/data'

    // Failsafe in case anything goes wrong (5 minutes ago)
    const defaultDate = new Date();
    defaultDate.setUTCMinutes(defaultDate.getUTCMinutes() - 5);

    try {
      // Generate today's file name
      const todayFileName = `${operationType}_${new Date().toISOString().substring(0, 10)}.log`;
      const todayFilePath = path.join(filePathEnv, todayFileName);

      // Check if today's file exists, and if so, return the last polled date from it
      if (fs.existsSync(todayFilePath)) {
        return this.getLastTimestampFromFile(todayFilePath, defaultDate);
      }

      // If today's file does not exist, look for the most recent file
      const mostRecentFile = this.getMostRecentFile(operationType, filePathEnv);

      // If no files exist, return the default date
      if (!mostRecentFile) {
        return defaultDate;
      }

      // Read the most recent file's content and return the last timestamp from it
      const filePath = path.join(filePathEnv, mostRecentFile);
      return this.getLastTimestampFromFile(filePath, defaultDate);
    } catch (err) {
      this.logger.error(`Error reading file: ${err.message}`);
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
      //This is the timestamp that will be written to the log.   Going to start without any padding but we might need to subtract some time from this value if we find that we are losing complaints.
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
          complaint.violation_type === "Pesticide" ||
          (complaint.flag_COS !== "Yes" &&
            Date.parse(`${complaint.created_by_datetime} PST`) > Date.parse(process.env.WEBEOC_DATE_FILTER))
        ); // 2025-01-01T08:00:00Z is midnight PST
      } else {
        return true;
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
