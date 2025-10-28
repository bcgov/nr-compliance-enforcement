import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { app_user } from "prisma/shared/generated/app_user";
import { AppUser } from "./dto/app_user";

@Injectable()
export class AppUserService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(AppUserService.name);

  async findAll() {
    const prismaAppUsers = await this.prisma.app_user.findMany({
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

    return this.mapper.mapArray<app_user, AppUser>(prismaAppUsers as Array<app_user>, "app_user", "AppUser");
  }
}
