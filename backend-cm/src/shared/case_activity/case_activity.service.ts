import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CaseActivity, CaseActivityCreateInput } from "src/shared/case_activity/dto/case_activity";
import { UserService } from "src/common/user.service";
import { case_activity } from "prisma/shared/generated/case_activity";

@Injectable()
export class CaseActivityService {
  constructor(
    private readonly prisma: SharedPrismaService,
    private readonly user: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(CaseActivityService.name);

  async create(input: CaseActivityCreateInput): Promise<CaseActivity | any> {
    const result = await this.prisma.case_activity.create({
      data: {
        case_file_guid: input.caseFileGuid,
        activity_type: input.activityType,
        activity_identifier_ref: input.activityIdentifier,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      },
    });
    try {
      return this.mapper.map<case_activity, CaseActivity>(result as case_activity, "case_activity", "CaseActivity");
    } catch (activityError) {
      this.logger.error("Error creating case activity:", activityError);
      throw new Error(`Failed to create case activity. Error: ${activityError}`);
    }
  }
}
