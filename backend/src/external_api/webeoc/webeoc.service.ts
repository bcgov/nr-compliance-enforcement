import { Inject, Injectable, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import axios, { AxiosRequestConfig } from "axios";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { format } from "date-fns";
import { HttpsProxyAgent } from "https-proxy-agent";

const httpsProxyAgent = process.env.WEBEOC_HTTPS_PROXY ? new HttpsProxyAgent(process.env.WEBEOC_HTTPS_PROXY) : undefined;
@Injectable()
export class WebeocService {
  private readonly logger = new Logger(WebeocService.name);
  private readonly baseUri: string;
  private readonly userName: string;
  private readonly password: string;
  private readonly position: string;
  private readonly incident: string;
  private readonly COOKIE_CACHE_KEY = "webeoc_session_cookie";
  private readonly COOKIE_EXPIRATION_TIME = 20 * 60 * 1000; // 20 minutes in milliseconds

  @Inject(ConfigurationService)
  readonly configService: ConfigurationService;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.baseUri = process.env.WEBEOC_URL;
    this.userName = process.env.WEBEOC_WRITE_USERNAME;
    this.password = process.env.WEBEOC_WRITE_PASSWORD;
    this.position = process.env.WEBEOC_WRITE_POSITION;
    this.incident = process.env.WEBEOC_INCIDENT;
  }

  private async getCookie(): Promise<string | null> {
    return await this.cacheManager.get<string>(this.COOKIE_CACHE_KEY);
  }

  private async setCookie(cookie: string): Promise<void> {
    await this.cacheManager.set(this.COOKIE_CACHE_KEY, cookie, this.COOKIE_EXPIRATION_TIME);
  }

  private async clearCookie(): Promise<void> {
    await this.cacheManager.del(this.COOKIE_CACHE_KEY);
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

    const cachedCookie = await this.getCookie();

    let config: AxiosRequestConfig = {
      withCredentials: true,
      headers: {
        Cookie: cachedCookie || "",
      },
    };

<<<<<<< HEAD
    if (process.env.HTTPS_PROXY) {
      this.logger.debug(`using HTTPS proxy: ${process.env.HTTPS_PROXY}`);
=======
    if (process.env.WEBEOC_HTTPS_PROXY) {
      this.logger.debug(`using HTTPS proxy: ${process.env.WEBEOC_HTTPS_PROXY}`);
>>>>>>> fce683714f464d3c91b714b4760819d29d637c2e
      config = {
        ...config,
        proxy: false,
        httpsAgent: httpsProxyAgent,
      };
    }

    try {
      let response;
      if (action === "POST") {
        try {
          // try to refresh an existing session
          let response = await axios.get(authUrl, config);
          if (response.status === 200) {
            await this.setCookie(cachedCookie); // Session renewed, extend the cookie expiration time by 20 minutes
          }
        } catch {
          // session is expired, create a new session
          response = await axios.post(authUrl, credentials, config);
          const newCookie = response.headers["set-cookie"]?.[0] || "";
          await this.setCookie(newCookie);
        }
      } else if (action === "DELETE") {
        this.logger.debug(`deleting webEOC session from ${this.baseUri}`);
        response = await axios.delete(authUrl, config);
        await this.clearCookie();
      } else {
        throw new Error(`Invalid action: ${action}`);
      }

      return (await this.getCookie()) || "";
    } catch (error) {
      this.logger.error(`Error ${action}ing WebEOC session:`, error);
      throw error;
    }
  };

  assignOfficer = async (webeocIdentifier: string): Promise<string> => {
    const urlPath = `/board/Conservation Officer Service/input/Input - API ECC NatCom Outcome/${webeocIdentifier}`;
    const url = `${process.env.WEBEOC_URL}/${urlPath}`;

    const cachedCookie = await this.getCookie();

    let config: AxiosRequestConfig = {
      headers: {
        Cookie: cachedCookie || "",
      },
    };

<<<<<<< HEAD
    if (process.env.HTTPS_PROXY) {
      this.logger.debug(`using HTTPS proxy: ${process.env.HTTPS_PROXY}`);
=======
    if (process.env.WEBEOC_HTTPS_PROXY) {
      this.logger.debug(`using HTTPS proxy: ${process.env.WEBEOC_HTTPS_PROXY}`);
>>>>>>> fce683714f464d3c91b714b4760819d29d637c2e
      config = {
        ...config,
        proxy: false,
        httpsAgent: httpsProxyAgent,
      };
    }

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
