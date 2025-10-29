import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { app_user_team_xref } from "prisma/shared/generated/app_user_team_xref";
import { AppUserTeamXref, CreateAppUserTeamXrefInput, UpdateAppUserTeamXrefInput } from "./dto/app_user_team_xref";
import { UserService } from "../../common/user.service";

@Injectable()
export class AppUserTeamXrefService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(AppUserTeamXrefService.name);

  async findAll() {
    const prismaAppUserTeamXrefs = await this.prisma.app_user_team_xref.findMany({
      select: {
        app_user_team_xref_guid: true,
        app_user_guid: true,
        team_guid: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<app_user_team_xref, AppUserTeamXref>(
      prismaAppUserTeamXrefs as Array<app_user_team_xref>,
      "app_user_team_xref",
      "AppUserTeamXref",
    );
  }

  async findOne(appUserGuid: string) {
    const prismaAppUserTeamXref = await this.prisma.app_user_team_xref.findFirst({
      where: {
        app_user_guid: appUserGuid,
      },
      select: {
        app_user_team_xref_guid: true,
        app_user_guid: true,
        team_guid: true,
        active_ind: true,
      },
    });

    if (!prismaAppUserTeamXref) {
      return null;
    }

    return this.mapper.map<app_user_team_xref, AppUserTeamXref>(
      prismaAppUserTeamXref as app_user_team_xref,
      "app_user_team_xref",
      "AppUserTeamXref",
    );
  }

  async create(input: CreateAppUserTeamXrefInput) {
    const prismaAppUserTeamXref = await this.prisma.app_user_team_xref.create({
      data: {
        app_user_guid: input.appUserGuid,
        team_guid: input.teamGuid,
        active_ind: input.activeIndicator,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      },
    });

    return this.mapper.map<app_user_team_xref, AppUserTeamXref>(
      prismaAppUserTeamXref as app_user_team_xref,
      "app_user_team_xref",
      "AppUserTeamXref",
    );
  }

  async update(appUserGuid: string, input: UpdateAppUserTeamXrefInput) {
    const updateData: any = {
      update_user_id: this.user.getIdirUsername(),
      update_utc_timestamp: new Date(),
    };

    if (input.teamGuid !== undefined) updateData.team_guid = input.teamGuid;
    if (input.activeIndicator !== undefined) updateData.active_ind = input.activeIndicator;

    await this.prisma.app_user_team_xref.updateMany({
      where: { app_user_guid: appUserGuid },
      data: updateData,
    });

    return this.findOne(appUserGuid);
  }

  async delete(appUserTeamXrefGuid: string) {
    await this.prisma.app_user_team_xref.delete({
      where: { app_user_team_xref_guid: appUserTeamXrefGuid },
    });

    return true;
  }
}
