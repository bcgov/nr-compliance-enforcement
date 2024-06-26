import { Injectable, Logger } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";
import { ComplaintsPublisherService } from "../complaints-publisher/complaints-publisher.service";
import { Complaint } from "src/types/complaint-type";
import axios, { AxiosRequestConfig } from "axios";
import { CronJob } from "cron";
import { WEBEOC_API_COMPLAINTS_LIST_PATH, WEBEOC_API_COMPLAINTS_UPDATE_PATH } from "src/common/constants";
import { ComplaintUpdate } from "src/types/complaint-update-type";
import { toZonedTime, format } from "date-fns-tz";

@Injectable()
export class WebEOCComplaintsScheduler {
  private cookie: string;
  private cronJob: CronJob;
  private readonly logger = new Logger(WebEOCComplaintsScheduler.name);

  constructor(private complaintsPublisherService: ComplaintsPublisherService) {}

  onModuleInit() {
    const FLAG_COS = "flag_COS"; // flag required for new complaints
    const FLAG_UPD = "flag_UPD"; // flag required for complaint updates
    this.cronJob = new CronJob(this.getCronExpression(), async () => {
      await this.fetchAndPublishComplaints(WEBEOC_API_COMPLAINTS_LIST_PATH, FLAG_COS, this.publishComplaint.bind(this));
      await this.fetchAndPublishComplaints(
        WEBEOC_API_COMPLAINTS_UPDATE_PATH,
        FLAG_UPD,
        this.publishComplaintUpdate.bind(this),
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

  private async fetchAndPublishComplaints(
    urlPath: string,
    flagName: string,
    publishMethod: (data: any) => Promise<void>,
  ) {
    try {
      await this.authenticateWithWebEOC();
      const data = await this.fetchDataFromWebEOC(urlPath, flagName);

      this.logger.debug(`Found ${data?.length} items from WebEOC`);

      for (const item of data) {
        await publishMethod(item);
      }
    } catch (error) {
      this.logger.error(`Unable to fetch data from WebEOC`, error);
    }
  }

  private async authenticateWithWebEOC(): Promise<string> {
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

  private async fetchDataFromWebEOC(urlPath: string, flagName: string): Promise<any[]> {
    const dateFilter = this.getDateFilter();
    const url = `${process.env.WEBEOC_URL}/${urlPath}`;
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: this.cookie,
      },
    };

    const body = {
      customFilter: {
        boolean: "and",
        items: [
          dateFilter,
          {
            fieldname: flagName,
            operator: "Equals",
            fieldvalue: "Yes",
          },
        ],
      },
    };

    try {
      const response = await axios.post(url, body, config);
      return response.data as Complaint[];
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
}
