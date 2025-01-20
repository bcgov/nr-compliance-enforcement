import { Inject, Injectable, Logger } from "@nestjs/common";
import { ExternalApiService } from "../external-api-service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { get } from "../../helpers/axios-api";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { CssUser } from "src/types/css/cssUser";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CssService implements ExternalApiService {
  private readonly logger = new Logger(CssService.name);

  readonly authApi: string;
  readonly baseUri: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly grantType: string;
  readonly env: string;
  readonly maxPages: number;

  @Inject(ConfigurationService)
  readonly configService: ConfigurationService;

  @Inject(CACHE_MANAGER)
  readonly cacheManager: Cache;

  constructor() {
    this.authApi = process.env.CSS_TOKEN_URL;
    this.baseUri = process.env.CSS_URL;
    this.clientId = process.env.CSS_CLIENT_ID;
    this.clientSecret = process.env.CSS_CLIENT_SECRET;
    this.grantType = "client_credentials";
    this.env = process.env.ENVIRONMENT;
    this.maxPages = 20;
  }

  authenticate = async (): Promise<string> => {
    const response: AxiosResponse = await axios.post(
      this.authApi,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: this.grantType,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return response?.data?.access_token;
  };

  getUserIdirByName = async (firstName, lastName): Promise<AxiosResponse> => {
    try {
      const apiToken = await this.authenticate();
      const url = `${this.baseUri}/api/v1/${this.env}/idir/users?firstName=${firstName}&lastName=${lastName}`;
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };
      const response = await get(apiToken, url, config);
      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to get user: ${firstName} ${lastName} - error: ${error}`);
      throw new Error(`exception: unable to get user: ${firstName} ${lastName} - error: ${error}`);
    }
  };

  getUserIdirByEmail = async (email: string): Promise<CssUser[]> => {
    try {
      const apiToken = await this.authenticate();
      const url = `${this.baseUri}/api/v1/${this.env}/idir/users?email=${email}`;
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };
      const response = await get(apiToken, url, config);
      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to get user by email: ${email} - error: ${error}`);
      throw new Error(`exception: unable to get user by email: ${email} - error: ${error}`);
    }
  };

  getUserRoles = async (userIdir): Promise<{ name: string; composite: string }[]> => {
    try {
      const apiToken = await this.authenticate();
      const url = `${this.baseUri}/api/v1/integrations/4794/${this.env}/users/${userIdir}/roles`;
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };
      const response = await get(apiToken, url, config);
      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to get user's roles ${userIdir} - error: ${error}`);
      throw new Error(`exception: unable to get user's roles ${userIdir} - error: ${error}`);
    }
  };

  updateUserRole = async (userIdir, userRoles): Promise<{ name: string; composite: string }[]> => {
    try {
      const apiToken = await this.authenticate();
      const url = `${this.baseUri}/api/v1/integrations/4794/${this.env}/users/${userIdir}/roles`;
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };
      const response = await axios.post(url, userRoles, config);

      // clear cache
      await this.clearUserRoleCache();

      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to update user's roles ${userIdir} - error: ${error}`);
      throw new Error(`exception: unable to update user's roles ${userIdir} - error: ${error}`);
    }
  };

  deleteUserRole = async (userIdir, roleName): Promise<AxiosResponse> => {
    try {
      const apiToken = await this.authenticate();
      const url = `${this.baseUri}/api/v1/integrations/4794/${this.env}/users/${userIdir}/roles/${roleName}`;
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };
      const response = await axios.delete(url, config);

      // clear cache
      await this.clearUserRoleCache();

      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to delete user's role ${userIdir} - error: ${error}`);
      throw new Error(`exception: unable to delete user's role ${userIdir} - error: ${error}`);
    }
  };

  private readonly clearUserRoleCache = async (): Promise<void> => {
    await this.cacheManager.del("css-users-roles-fresh");
    await this.cacheManager.del("css-users-roles-stale");
    await this.cacheManager.del("css-users-roles-refresh-status");
  };

  private readonly fetchAndGroupUserRoles = async (): Promise<any> => {
    //Try to avoid multiple refreshes of cache in case of multiple requests while the cache is being refreshed
    await this.cacheManager.set("css-users-roles-refresh-status", true, 15000);

    const apiToken = await this.authenticate();
    //Get all roles from NatCom CSS integration
    const rolesUrl = `${this.baseUri}/api/v1/integrations/4794/${this.env}/roles`;
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    };
    const roleRes = await get(apiToken, rolesUrl, config);
    if (roleRes?.data.data.length > 0) {
      const {
        data: { data: roleList },
      } = roleRes;

      //Get all users for each role
      let usersUrl: string = "";
      const pages = Array.from(Array(this.maxPages), (_, i) => i + 1);
      const usersRoles = await Promise.all(
        roleList.map(async (role) => {
          let usersRolesTemp = [];
          for (const page of pages) {
            usersUrl = `${this.baseUri}/api/v1/integrations/4794/${this.env}/roles/${role.name}/users?page=${page}`;
            const userRes = await get(apiToken, encodeURI(usersUrl), config);
            if (userRes?.data.data.length > 0) {
              const {
                data: { data: users },
              } = userRes;
              let usersRolesSinglePage = await Promise.all(
                users.map((user) => {
                  return {
                    userId: user.username
                      .replace(/@idir$/i, "")
                      .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5"),
                    role: role.name,
                  };
                }),
              );
              usersRolesTemp.push(...usersRolesSinglePage);
            } else {
              break;
            }
          }
          return usersRolesTemp;
        }),
      );

      //exclude empty roles and concatenate all sub-array elements
      const usersRolesFlat = usersRoles.filter((item) => item !== undefined).flat();

      //group the array elements by a user id
      const usersRolesGrouped = usersRolesFlat.reduce((grouping, item) => {
        grouping[item.userId] = [...(grouping[item.userId] || []), item.role];
        return grouping;
      }, {});

      //set the fresh cache for 10 minutes
      await this.cacheManager.set("css-users-roles-fresh", usersRolesGrouped, 600000);

      //set the stale cache for 60 minutes
      await this.cacheManager.set("css-users-roles-stale", usersRolesGrouped, 3600000);

      return usersRolesGrouped;
    } else {
      throw new Error(`unable to get user roles from CSS or no roles found`);
    }
  };

  getUserRoleMapping = async (): Promise<AxiosResponse> => {
    try {
      // return fresh cache if available
      const usersRolesGroupedFresh = await this.cacheManager.get<any>("css-users-roles-fresh");
      if (usersRolesGroupedFresh) {
        return usersRolesGroupedFresh;
      }

      // return the stale cache if available, but asyncronously refresh cache
      const usersRolesGroupedStale = await this.cacheManager.get<any>("css-users-roles-stale");
      if (usersRolesGroupedStale) {
        // check if a refresh is already in progress, if not start a new refresh
        const refreshingInProgress = await this.cacheManager.get<any>("css-users-roles-refresh-status");
        if (!refreshingInProgress) {
          this.fetchAndGroupUserRoles().catch((error) => {
            this.logger.error(`exception: error: ${error}`);
          });
        }

        return usersRolesGroupedStale;
      }

      // wait for fresh data if no cache is available
      return await this.fetchAndGroupUserRoles();
    } catch (error) {
      this.logger.error(`exception: error: ${error}`);
    }
  };
}
