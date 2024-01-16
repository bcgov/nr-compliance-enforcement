import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ComplaintsService } from '../complaints/complaints.service'; // The service to handle NATS publishing
import { Complaint } from 'src/types/Complaints';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class ScheduledTaskService {
  private cookie: string;

  constructor(private complaintsService: ComplaintsService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    await this.authenticateWithWebEOC();
    // Fetch complaints from WebEOC here
    const complaints = await this.fetchComplaintsFromWebEOC();

    // Publish each complaint to NATS
    for (const complaint of complaints) {
      await this.complaintsService.publishComplaint(complaint);
    }
  }

  public async authenticateWithWebEOC(): Promise<string> {
    const authUrl = 'https://bc.demo.webeocasp.com/bc/api/rest.svc/sessions';
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
      const cookie = response.headers['set-cookie'][0];
      this.cookie = cookie; // Store the cookie for future use

      return cookie;
    } catch (error) {
      console.error('Error authenticating with WebEOC:', error);
      throw error;
    }
  }

  public async fetchComplaintsFromWebEOC(): Promise<Complaint[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const formattedDate = this.formatDate(oneDayAgo);

    if (!this.cookie) {
      throw new Error(
        'No authentication cookie available. Please authenticate first.',
      );
    }

    // add the auth cookie to the header.  Note that WebEOC requires this format, which is why we're not using the encrypted authorization header.
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: this.cookie,
      },
    };

    const body = {
      customFilter: {
        boolean: 'or',
        items: [
          {
            fieldname: 'incident_datetime',
            operator: 'GreaterThan',
            fieldvalue: formattedDate,
          },
        ],
      },
    };

    const url =
      'https://bc.demo.webeocasp.com/bc/api/rest.svc/board/Conservation Officer Service/display/List - COS Integration Incidents';

    try {
      const response = await axios.post(url, body, config);
      return response.data as Complaint[];
    } catch (error) {
      console.error('Error fetching complaints from WebEOC:', error);
      throw error;
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }
}
