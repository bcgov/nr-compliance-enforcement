import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateAppUserDto } from "./dto/create-app-user.dto";
import { UpdateAppUserDto } from "./dto/update-app-user.dto";
import { UUID } from "node:crypto";
import { CssService } from "../../external_api/css/css.service";
import { Role } from "../../enum/role.enum";
import { put } from "../../helpers/axios-api";
import {
  getAppUsers,
  getAppUserByGuid,
  getAppUserByUserId,
  getAppUserByAuthUserGuid,
  createAppUser,
  updateAppUser,
  getCosGeoOrgUnits,
  createAppUserTeamXref,
  getTeams,
  getOffices,
} from "../../external_api/shared_data";

@Injectable()
export class AppUserService {
  private readonly logger = new Logger(AppUserService.name);

  constructor(@Inject(CssService) private readonly cssService: CssService) {}

  async findAll(token: string): Promise<any[]> {
    let appUsers = await getAppUsers(token);

    appUsers = appUsers.sort((a, b) => (a.lastName || "").localeCompare(b.lastName || ""));

    const roleMapping = await this.cssService.getUserRoleMapping();

    if (roleMapping) {
      let useGuid: string;
      appUsers = await Promise.all(
        appUsers.map(async (user) => {
          useGuid = Object.keys(roleMapping).find((key) => key === user.authUserGuid);
          const userRoles = roleMapping[useGuid] ?? [];
          const mappedUserToOffice = await this.mapAppUserToDtoWithOffice(user, token);
          return { ...mappedUserToOffice, user_roles: userRoles };
        }),
      );
    }

    return appUsers;
  }

  async findByOffice(office_guid: any, token: string): Promise<any[]> {
    const appUsers = await getAppUsers(token, [office_guid]);

    return appUsers.map((user) => ({
      app_user_guid: user.appUserGuid,
      first_name: user.firstName,
      last_name: user.lastName,
      user_id: user.userId,
      office_guid: user.officeGuid,
    }));
  }

  async findByAuthUserGuid(auth_user_guid: any, token: string): Promise<any> {
    const appUser = await getAppUserByAuthUserGuid(token, auth_user_guid);

    if (!appUser) {
      return null;
    }

    return this.mapAppUserToDtoWithOffice(appUser, token);
  }

  async findByUserId(userid: string, token: string): Promise<any> {
    const appUser = await getAppUserByUserId(token, userid);

    if (!appUser) {
      return null;
    }

    return this.mapAppUserToDtoWithOffice(appUser, token);
  }

  async findByAppUserGuid(app_user_guid: any, token: string): Promise<any> {
    return this.findOne(app_user_guid, token);
  }

  async findOne(app_user_guid: any, token: string): Promise<any> {
    const appUser = await getAppUserByGuid(token, app_user_guid);

    if (!appUser) {
      throw new Error("App user not found");
    }

    const result = await this.mapAppUserToDtoWithOffice(appUser, token);

    return result;
  }

  async create(appUser: CreateAppUserDto, token: string): Promise<any> {
    let newAppUser;

    try {
      const appUserInput = {
        authUserGuid: appUser.auth_user_guid,
        userId: appUser.user_id,
        firstName: appUser.first_name,
        lastName: appUser.last_name,
        agencyCode: appUser.agency_code_ref,
        officeGuid: appUser.office_guid,
        parkAreaGuid: appUser.park_area_guid,
        comsEnrolledIndicator: appUser.coms_enrolled_ind || false,
        deactivateIndicator: appUser.deactivate_ind || false,
      };

      newAppUser = await createAppUser(token, appUserInput);

      if (appUser.team_code) {
        const teams = await getTeams(token, appUser.team_code, "EPO");
        if (teams.length > 0) {
          await createAppUserTeamXref(token, {
            appUserGuid: newAppUser.appUserGuid,
            teamGuid: teams[0].teamGuid,
            activeIndicator: true,
          });
        }
      }

      if (appUser.roles) {
        await this.cssService.updateUserRole(appUser.roles.user_idir, appUser.roles.user_roles);
      }

      return this.mapAppUserToDto(newAppUser);
    } catch (err) {
      this.logger.error(err);
      //remove all css roles on error
      if (appUser.roles) {
        for (const roleItem of appUser.roles.user_roles) {
          await this.cssService.deleteUserRole(appUser.roles.user_idir, roleItem.name);
        }
      }
      throw err;
    }
  }

  async update(app_user_guid: UUID, updateAppUserDto: UpdateAppUserDto, token: string): Promise<any> {
    const userRoles = updateAppUserDto.user_roles;
    //exclude roles field populated from keycloak from update
    delete (updateAppUserDto as any).user_roles;

    try {
      const updateInput: any = {};
      if (updateAppUserDto.auth_user_guid) updateInput.authUserGuid = updateAppUserDto.auth_user_guid;
      if (updateAppUserDto.user_id) updateInput.userId = updateAppUserDto.user_id;
      if (updateAppUserDto.first_name) updateInput.firstName = updateAppUserDto.first_name;
      if (updateAppUserDto.last_name) updateInput.lastName = updateAppUserDto.last_name;
      if (updateAppUserDto.agency_code_ref) updateInput.agencyCode = updateAppUserDto.agency_code_ref;
      if (updateAppUserDto.office_guid !== undefined) updateInput.officeGuid = updateAppUserDto.office_guid;
      if (updateAppUserDto.park_area_guid !== undefined) updateInput.parkAreaGuid = updateAppUserDto.park_area_guid;
      if (updateAppUserDto.coms_enrolled_ind !== undefined)
        updateInput.comsEnrolledIndicator = updateAppUserDto.coms_enrolled_ind;
      if (updateAppUserDto.deactivate_ind !== undefined)
        updateInput.deactivateIndicator = updateAppUserDto.deactivate_ind;

      await updateAppUser(token, app_user_guid, updateInput);

      //remove all roles if deactivate_ind is true
      if (updateAppUserDto.deactivate_ind === true && updateAppUserDto.auth_user_guid) {
        const userIdirUsername = `${updateAppUserDto.auth_user_guid.split("-").join("")}@idir`;
        for (const roleItem of userRoles) {
          await this.cssService.deleteUserRole(userIdirUsername, roleItem);
        }
      }
      return this.findOne(app_user_guid, token);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * This function requests the appropriate level of access to the storage bucket in COMS.
   * If successful, the app user's record has its `coms_enrolled_ind` indicator set to true.
   */
  async requestComsAccess(token: string, app_user_guid: UUID, user: any): Promise<any> {
    try {
      const currentRoles = user.client_roles;
      const permissions = currentRoles.includes(Role.READ_ONLY) ? ["READ"] : ["READ", "CREATE", "UPDATE", "DELETE"];
      const comsPayload = {
        accessKeyId: process.env.OBJECTSTORE_ACCESS_KEY,
        bucket: process.env.OBJECTSTORE_BUCKET,
        bucketName: process.env.OBJECTSTORE_BUCKET_NAME,
        key: process.env.OBJECTSTORE_KEY,
        endpoint: process.env.OBJECTSTORE_HTTPS_URL,
        secretAccessKey: process.env.OBJECTSTORE_SECRET_KEY,
        permCodes: permissions,
      };
      const comsUrl = `${process.env.OBJECTSTORE_API_URL}/bucket`;
      await put(token, comsUrl, comsPayload);

      // Update app_user to set coms_enrolled_ind = true
      const updatedAppUser = await updateAppUser(token, app_user_guid, {
        comsEnrolledIndicator: true,
      });

      return this.mapAppUserToDto(updatedAppUser);
    } catch (error) {
      this.logger.error("An error occurred while requesting COMS access.", error);
      throw error;
    }
  }

  private async mapAppUserToDtoWithOffice(appUser: any, token: string): Promise<any> {
    const baseDto = this.mapAppUserToDto(appUser);

    if (appUser.officeGuid) {
      try {
        const [offices, cosGeoOrgUnits] = await Promise.all([getOffices(token), getCosGeoOrgUnits(token)]);

        const office = offices.find((o) => o.officeGuid === appUser.officeGuid);

        if (office) {
          const cosGeoOrgUnit = cosGeoOrgUnits.find(
            (unit) => unit.officeLocationCode === office.geoOrganizationUnitCode,
          );

          if (cosGeoOrgUnit) {
            baseDto.office_guid = {
              office_guid: office.officeGuid,
              geo_organization_unit_code: office.geoOrganizationUnitCode,
              agency_code_ref: office.agencyCode,
              cos_geo_org_unit: {
                area_code: cosGeoOrgUnit.areaCode,
                area_name: cosGeoOrgUnit.areaName,
                office_location_code: cosGeoOrgUnit.officeLocationCode,
                office_location_name: cosGeoOrgUnit.officeLocationName,
                region_code: cosGeoOrgUnit.regionCode,
                region_name: cosGeoOrgUnit.regionName,
                zone_code: cosGeoOrgUnit.zoneCode,
                zone_name: cosGeoOrgUnit.zoneName,
                administrative_office_ind: cosGeoOrgUnit.administrativeOfficeIndicator,
              },
            };
          } else {
            this.logger.warn(`CosGeoOrgUnit not found for office ${office.officeGuid}`);
          }
        } else {
          this.logger.warn(`Office not found for officeGuid ${appUser.officeGuid}`);
        }
      } catch (error) {
        this.logger.error(`Error fetching office data for app user: ${error}`);
      }
    }

    return baseDto;
  }

  private mapAppUserToDto(appUser: any): any {
    return {
      app_user_guid: appUser.appUserGuid,
      auth_user_guid: appUser.authUserGuid,
      user_id: appUser.userId,
      first_name: appUser.firstName,
      last_name: appUser.lastName,
      office_guid: appUser.officeGuid,
      agency_code_ref: appUser.agencyCode,
      coms_enrolled_ind: appUser.comsEnrolledIndicator,
      deactivate_ind: appUser.deactivateIndicator,
      park_area_guid: appUser.parkAreaGuid,
    };
  }
}
