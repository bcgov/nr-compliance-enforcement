import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { app_user } from "prisma/shared/generated/app_user";
import { AppUser, CreateAppUserInput, UpdateAppUserInput } from "./dto/app_user";
import { UserService } from "../../common/user.service";

@Injectable()
export class AppUserService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(AppUserService.name);

  async findAll(officeGuids?: string[], agencyCode?: string) {
    const whereClause: any = {};

    if (officeGuids && officeGuids.length > 0) {
      whereClause.office_guid = {
        in: officeGuids,
      };
    }

    if (agencyCode) {
      whereClause.agency_code_ref = agencyCode;
    }

    const appUsers = await this.prisma.app_user.findMany({
      where: whereClause,
      select: {
        app_user_guid: true,
        auth_user_guid: true,
        user_id: true,
        first_name: true,
        last_name: true,
        coms_enrolled_ind: true,
        deactivate_ind: true,
        agency_code_ref: true,
        office_guid: true,
        park_area_guid: true,
        create_user_id: true,
        create_utc_timestamp: true,
        update_user_id: true,
        update_utc_timestamp: true,
      },
    });

    return this.mapper.mapArray<app_user, AppUser>(appUsers as Array<app_user>, "app_user", "AppUser");
  }

  async findOne(userId?: string, authUserGuid?: string, appUserGuid?: string) {
    const whereClause: any = {};

    if (userId) {
      whereClause.user_id = {
        equals: userId,
        mode: "insensitive",
      };
    }

    if (appUserGuid) {
      whereClause.app_user_guid = appUserGuid;
    }

    if (authUserGuid) {
      whereClause.auth_user_guid = authUserGuid.replaceAll("-", "").toUpperCase();
    }

    if (!userId && !authUserGuid && !appUserGuid) {
      return null;
    }

    const appUser = await this.prisma.app_user.findFirst({
      where: whereClause,
      select: {
        app_user_guid: true,
        auth_user_guid: true,
        user_id: true,
        first_name: true,
        last_name: true,
        coms_enrolled_ind: true,
        deactivate_ind: true,
        agency_code_ref: true,
        office_guid: true,
        park_area_guid: true,
        create_user_id: true,
        create_utc_timestamp: true,
        update_user_id: true,
        update_utc_timestamp: true,
      },
    });

    if (!appUser) {
      return null;
    }

    return this.mapper.map<app_user, AppUser>(appUser as app_user, "app_user", "AppUser");
  }

  async search(searchTerm: string) {
    const appUsers = await this.prisma.app_user.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            last_name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            user_id: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        app_user_guid: true,
        auth_user_guid: true,
        user_id: true,
        first_name: true,
        last_name: true,
        coms_enrolled_ind: true,
        deactivate_ind: true,
        agency_code_ref: true,
        office_guid: true,
        park_area_guid: true,
        create_user_id: true,
        create_utc_timestamp: true,
        update_user_id: true,
        update_utc_timestamp: true,
      },
    });

    return this.mapper.mapArray<app_user, AppUser>(appUsers as Array<app_user>, "app_user", "AppUser");
  }

  async create(input: CreateAppUserInput) {
    const appUser = await this.prisma.app_user.create({
      data: {
        auth_user_guid: input.authUserGuid,
        user_id: input.userId,
        first_name: input.firstName,
        last_name: input.lastName,
        agency_code_ref: input.agencyCode,
        office_guid: input.officeGuid,
        park_area_guid: input.parkAreaGuid,
        coms_enrolled_ind: input.comsEnrolledIndicator ?? false,
        deactivate_ind: input.deactivateIndicator ?? false,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      },
    });

    return this.mapper.map<app_user, AppUser>(appUser as app_user, "app_user", "AppUser");
  }

  async update(appUserGuid: string, input: UpdateAppUserInput) {
    const updateData: any = {
      update_user_id: this.user.getIdirUsername(),
      update_utc_timestamp: new Date(),
    };

    if (input.authUserGuid !== undefined) updateData.auth_user_guid = input.authUserGuid;
    if (input.userId !== undefined) updateData.user_id = input.userId;
    if (input.firstName !== undefined) updateData.first_name = input.firstName;
    if (input.lastName !== undefined) updateData.last_name = input.lastName;
    if (input.agencyCode !== undefined) updateData.agency_code_ref = input.agencyCode;
    if (input.officeGuid !== undefined) updateData.office_guid = input.officeGuid;
    if (input.parkAreaGuid !== undefined) updateData.park_area_guid = input.parkAreaGuid;
    if (input.comsEnrolledIndicator !== undefined) updateData.coms_enrolled_ind = input.comsEnrolledIndicator;
    if (input.deactivateIndicator !== undefined) updateData.deactivate_ind = input.deactivateIndicator;

    const appUser = await this.prisma.app_user.update({
      where: { app_user_guid: appUserGuid },
      data: updateData,
    });

    return this.mapper.map<app_user, AppUser>(appUser as app_user, "app_user", "AppUser");
  }
}
