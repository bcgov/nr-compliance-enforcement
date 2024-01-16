import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ComplaintsService } from '../complaints/complaints.service'; // The service to handle NATS publishing
import { AxiosRequestConfig } from 'axios';
import { Complaint } from 'src/types/Complaints';

@Injectable()
export class ScheduledTaskService {
  private cookie: string;

  constructor(
    private httpService: HttpService,
    private complaintsService: ComplaintsService,
  ) {}

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

  async authenticateWithWebEOC(): Promise<string> {
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
      const response = await this.httpService
        .post(authUrl, credentials, config)
        .toPromise();

      // Extract the cookie from the response
      const cookie = response.headers['set-cookie'][0];
      this.cookie = cookie; // Store the cookie for future use

      return cookie;
    } catch (error) {
      console.error('Error authenticating with WebEOC:', error);
      throw error;
    }
  }

  async fetchComplaintsFromWebEOC(): Promise<Complaint[]> {
    const complaintsUrl = `${process.env.WEBEOC_URL}/board/Conservation Officer Service/display/List - COS Integration Incidents`;
    if (!this.cookie) {
      throw new Error(
        'No authentication cookie available. Please authenticate first.',
      );
    }
    const headers = {
      Cookie: this.cookie,
    };

    try {
      const response = await this.httpService
        .get(complaintsUrl, { headers })
        .toPromise();
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints from WebEOC:', error);
      throw error;
    }
  }
}
