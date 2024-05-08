import { Injectable, Logger } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";
import { ComplaintsPublisherService } from "../complaints-publisher/complaints-publisher.service"; // The service to handle NATS publishing
import { Complaint } from "src/types/Complaints";
import axios, { AxiosRequestConfig } from "axios";
import { CronJob } from "cron";
import { format } from "date-fns";

@Injectable()
export class WebEOCComplaintsScheduler {
  private cookie: string;
  private cronJob: CronJob;
  private readonly logger = new Logger(WebEOCComplaintsScheduler.name);

  constructor(private complaintsPublisherService: ComplaintsPublisherService) {}

  onModuleInit() {
    this.cronJob = new CronJob(this.getCronExpression(), async () => {
      await this.fetchAndPublishComplaintsFromWebEOC();
    });

    this.cronJob.start();
  }

  // Get the cron expression from the WEBEOC_CRON_EXPRESSION environment variable.  Detaults to 5 minutes if no schedule is found.
  private getCronExpression(): string {
    const defaultCron = CronExpression.EVERY_5_MINUTES;
    const envCronExpression = process.env.WEBEOC_CRON_EXPRESSION || defaultCron;
    this.logger.debug(`Grabbing complaints from WebEOC as per cron schedule ${envCronExpression}`);
    return envCronExpression;
  }

  // Grabs the complaints and publishes them to NATS
  async fetchAndPublishComplaintsFromWebEOC() {
    await this.authenticateWithWebEOC();
    // Fetch complaints from WebEOC here
    const complaints = await this.fetchComplaintsFromWebEOC();

    this.logger.debug(`Found ${complaints?.length} complaints from WebEOC`);

    // Publish each complaint to NATS
    for (const complaint of complaints) {
      await this.complaintsPublisherService.publishComplaintsFromWebEOC(complaint);
    }
  }

  // WebEOC requires that a cookie be attached to each authenticated request.  This method grabs that cookie.
  public async authenticateWithWebEOC(): Promise<string> {
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

      // Extract the cookie from the response
      const cookie = response.headers["set-cookie"][0];
      this.cookie = cookie; // Store the cookie for future use

      return cookie;
    } catch (error) {
      this.logger.error("Error authenticating with WebEOC:", error);
      throw error;
    }
  }

  // Grabs all complaints created within a certain period (defined by WEBEOC_COMPLAINT_HISTORY_DAYS)
  public async fetchComplaintsFromWebEOC(): Promise<Complaint[]> {
    const complaintsAsOfDate = new Date(); // Grab complaints that have been created on a date greater than or equal to this date
    const complaintHistoryDays = parseInt(process.env.WEBEOC_COMPLAINT_HISTORY_DAYS || "1", 10);

    if (isNaN(complaintHistoryDays)) {
      throw new Error("WEBEOC_COMPLAINT_HISTORY_DAYS is not a valid number");
    }
    complaintsAsOfDate.setDate(complaintsAsOfDate.getDate() - complaintHistoryDays);

    const formattedDate = this.formatDate(complaintsAsOfDate);

    if (!this.cookie) {
      throw new Error("No authentication cookie available. Please authenticate first.");
    }

    // add the auth cookie to the header.  Note that WebEOC requires this format, which is why we're not using the encrypted authorization header.
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: this.cookie,
      },
    };

    const body = {
      customFilter: {
        boolean: "and",
        items: [
          {
            fieldname: "incident_datetime",
            operator: "GreaterThan",
            fieldvalue: formattedDate,
          },
        ],
      },
    };

    const url = `${process.env.WEBEOC_URL}/board/Conservation Officer Service/display/List - COS Integration Incidents`;

    try {
      const response = await axios.post(url, body, config);
      return response.data as Complaint[];
    } catch (error) {
      this.logger.error("Error fetching complaints from WebEOC:", error);
      throw error;
    }
  }

  // Formats a date to be in a format required by WEBEOC.  Used to determine how far back in time to go to grab new complaints.
  private formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd HH:mm:ss");
  }
}
