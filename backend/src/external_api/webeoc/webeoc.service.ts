import { Inject, Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import { ConfigurationService } from "../../v1/configuration/configuration.service";

@Injectable()
export class WebeocService {
  private readonly logger = new Logger(WebeocService.name);
  private readonly baseUri: string;
  private readonly userName: string;
  private readonly password: string;
  private readonly position: string;
  private readonly incident: string;

  private cookie: string;

  @Inject(ConfigurationService)
  readonly configService: ConfigurationService;

  constructor() {
    this.baseUri = process.env.WEBEOC_URL;
    this.userName = process.env.WEBEOC_WRITE_USERNAME;
    this.password = process.env.WEBEOC_WRITE_PASSWORD;
    this.position = process.env.WEBEOC_WRITE_POSITION;
    this.incident = process.env.WEBEOC_INCIDENT;
  }

  manageSession = async (action: "POST" | "DELETE"): Promise<string> => {
    this.logger.debug(`${action}ing webEOC session from ${this.baseUri}`);
    const authUrl = `${process.env.WEBEOC_URL}/sessions`;

    const credentials = {
      username: this.userName,
      password: this.password,
      position: this.position,
      incident: this.incident,
    };

    let config: AxiosRequestConfig = {
      withCredentials: true,
      headers: {
        Cookie: this.cookie,
      },
    };

    try {
      let response;
      if (action === "POST") {
        response = await axios.post(authUrl, credentials, config);
      } else {
        response = await axios.delete(authUrl, config);
      }

      this.cookie = response.headers["set-cookie"]?.[0] || "";
      return this.cookie;
    } catch (error) {
      this.logger.error(`Error ${action}ing WebEOC session:`, error);
      throw error;
    }
  };

  assignOfficer = async (complaintIdentifier: string, webeocIdentifier: string): Promise<string> => {
    const urlPath = `/board/Conservation Officer Service/input/Input - API ECC NatCom Outcome/${webeocIdentifier}`;
    const url = `${process.env.WEBEOC_URL}/${urlPath}`;
    let config: AxiosRequestConfig = {
      headers: {
        Cookie: this.cookie,
      },
    };

    // construct the body of the request
    const body = {
      dataid: webeocIdentifier,
      incident_number: complaintIdentifier,
      nc_off_assign: "Yes",
      nc_dt_assign: new Date(),
    };

    try {
      const response = await axios.post(url, body, config);
      return response.data;
    } catch (error) {
      this.logger.error(`Error posting data to WebEOC at ${urlPath}:`, error);
      throw error;
    }
  };
}
