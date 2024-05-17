import { Injectable, Logger } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";
import { ComplaintsPublisherService } from "../complaints-publisher/complaints-publisher.service";
import { Complaint } from "src/types/complaint-type";
import axios, { AxiosRequestConfig } from "axios";
import { CronJob } from "cron";
import { format } from "date-fns";
import { WEBEOC_API_COMPLAINTS_LIST_PATH, WEBEOC_API_COMPLAINTS_UPDATE_PATH } from "src/common/constants";
import { ComplaintUpdate } from "src/types/complaint-update-type";

@Injectable()
export class WebEOCComplaintsScheduler {
  private cookie: string;
  private cronJob: CronJob;
  private readonly logger = new Logger(WebEOCComplaintsScheduler.name);

  constructor(private complaintsPublisherService: ComplaintsPublisherService) {}

  onModuleInit() {
    this.cronJob = new CronJob(this.getCronExpression(), async () => {
      await this.fetchAndPublishComplaints(WEBEOC_API_COMPLAINTS_LIST_PATH, this.publishComplaint.bind(this));
      await this.fetchAndPublishComplaints(WEBEOC_API_COMPLAINTS_UPDATE_PATH, this.publishComplaintUpdate.bind(this));
    });

    this.cronJob.start();
  }

  private getCronExpression(): string {
    const defaultCron = CronExpression.EVERY_5_MINUTES;
    const envCronExpression = process.env.WEBEOC_CRON_EXPRESSION || defaultCron;
    this.logger.debug(`Grabbing complaints from WebEOC as per cron schedule ${envCronExpression}`);
    return envCronExpression;
  }

  private async fetchAndPublishComplaints(urlPath: string, publishMethod: (data: any) => Promise<void>) {
    try {
      await this.authenticateWithWebEOC();
      const data = await this.fetchDataFromWebEOC(urlPath);

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

  private async fetchDataFromWebEOC(urlPath: string): Promise<any[]> {
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
        items: [dateFilter],
      },
    };

    try {
      const response = await axios.post(url, body, config);
      return response.data as any[];
    } catch (error) {
      this.logger.error(`Error fetching data from WebEOC at ${urlPath}:`, error);
      throw error;
    }
  }

  private getDateFilter() {
    const complaintsAsOfDate = new Date();
    const complaintHistoryDays = parseInt(process.env.WEBEOC_COMPLAINT_HISTORY_DAYS || "1", 10);

    if (isNaN(complaintHistoryDays)) {
      throw new Error("WEBEOC_COMPLAINT_HISTORY_DAYS is not a valid number");
    }
    complaintsAsOfDate.setDate(complaintsAsOfDate.getDate() - complaintHistoryDays);

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
