import { Inject, Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { format } from "date-fns";

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
        let response = await axios.get(authUrl, config); // try to refresh an existing session
        if (response.status !== 200) {
          // if the session is not found, create a new one
          response = await axios.post(authUrl, credentials, config);
          this.cookie = response.headers["set-cookie"]?.[0] || ""; // update the cookie
        }
      } else {
        response = await axios.delete(authUrl, config);
        this.cookie = ""; // clear the cookie
      }

      return this.cookie;
    } catch (error) {
      this.logger.error(`Error ${action}ing WebEOC session:`, error);
      throw error;
    }
  };

  assignOfficer = async (webeocIdentifier: string): Promise<string> => {
    const urlPath = `/board/Conservation Officer Service/input/Input - API ECC NatCom Outcome/${webeocIdentifier}`;
    const url = `${process.env.WEBEOC_URL}/${urlPath}`;
    let config: AxiosRequestConfig = {
      headers: {
        Cookie: this.cookie,
      },
    };

    // construct the body of the request
    const params = {
      nc_off_assign: "Yes",
      nc_dt_assign: format(new Date(), "MM/dd/yyyy HH:mm:ss"),
    };

    // webEOC write API expects everything in a single "data" parameter.
    const body = {
      data: JSON.stringify(params),
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
