import { Inject, Injectable, Logger } from "@nestjs/common";
import { ExternalApiService } from "../external-api-service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { get } from "../../helpers/axios-api";
import { ConfigurationService } from "../../v1/configuration/configuration.service";

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
      return response?.data.data;
    } catch (error) {
      this.logger.error(`exception: unable to delete user's role ${userIdir} - error: ${error}`);
      throw new Error(`exception: unable to delete user's role ${userIdir} - error: ${error}`);
    }
  };

  getUserRoleMapping = async (): Promise<AxiosResponse> => {
    try {
      const apiToken = await this.authenticate();
      //Get all roles from NatCom CSS integation
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
        const usersRolesGroupped = usersRolesFlat.reduce((grouping, item) => {
          grouping[item.userId] = [...(grouping[item.userId] || []), item.role];
          return grouping;
        }, {});

        return usersRolesGroupped;
      }
    } catch (error) {
      this.logger.error(`exception: error: ${error}`);
      return;
    }
  };
}
