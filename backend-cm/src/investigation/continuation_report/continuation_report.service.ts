import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { ContinuationReport, ContinuationReportInput } from "./dto/continuation_report";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";
import { continuation_report } from "prisma/investigation/generated/continuation_report";

@Injectable()
export class ContinuationReportService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
  ) {}

  private readonly logger = new Logger(ContinuationReportService.name);

  async findOne(continuationReportGuid: string) {
    const prismaContinuationReport = await this.prisma.continuation_report.findUnique({
      where: {
        continuation_report_guid: continuationReportGuid,
        active_ind: true,
      },
    });
    if (!prismaContinuationReport) {
      throw new Error(`Continuation report with guid ${continuationReportGuid} not found`);
    }

    try {
      return this.mapper.map<continuation_report, ContinuationReport>(
        prismaContinuationReport as continuation_report,
        "continuation_report",
        "ContinuationReport",
      );
    } catch (error) {
      this.logger.error("Error mapping ContinuationReport:", error);
      throw error;
    }
  }

  async findManyByInvestigationGuid(investigationGuid: string) {
    const prismaContinuationReports = await this.prisma.continuation_report.findMany({
      where: {
        investigation_guid: investigationGuid,
        active_ind: true,
      },
      orderBy: {
        actioned_utc_timestamp: "desc",
      },
    });
    if (!prismaContinuationReports) {
      throw new Error(`Continuation reports of investigation ${investigationGuid} not found`);
    }

    try {
      return this.mapper.mapArray<continuation_report, ContinuationReport>(
        prismaContinuationReports as Array<continuation_report>,
        "continuation_report",
        "ContinuationReport",
      );
    } catch (error) {
      this.logger.error("Error mapping ContinuationReport:", error);
      throw error;
    }
  }

  async save(input: ContinuationReportInput): Promise<ContinuationReport> {
    let result;
    if (input.continuationReportGuid) {
      //Update existing continuation report
      result = await this.prisma.continuation_report.update({
        where: { continuation_report_guid: input.continuationReportGuid },
        data: {
          investigation_guid: input.investigationGuid,
          content_json: JSON.parse(input.contentJson),
          actioned_utc_timestamp: input.actionedTimestamp,
          reported_utc_timestamp: input.reportedTimestamp,
          actioned_app_user_guid_ref: input.actionedAppUserGuidRef,
          reported_app_user_guid_ref: input.reportedAppUserGuidRef,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      });
    } else {
      // Create new continuation report
      try {
        result = await this.prisma.continuation_report.create({
          data: {
            investigation_guid: input.investigationGuid,
            content_json: JSON.parse(input.contentJson),
            content_text: input.contentText,
            actioned_utc_timestamp: input.actionedTimestamp,
            reported_utc_timestamp: input.reportedTimestamp,
            actioned_app_user_guid_ref: input.actionedAppUserGuidRef,
            reported_app_user_guid_ref: input.reportedAppUserGuidRef,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      } catch (error) {
        this.logger.error("Error creating Continuation Report:", error);
        throw error;
      }
    }

    try {
      const mappedResult = this.mapper.map<continuation_report, ContinuationReport>(
        result as continuation_report,
        "continuation_report",
        "ContinuationReport",
      );
      return mappedResult;
    } catch (error) {
      this.logger.error("Error mapping Continuation Report:", error);
      throw error;
    }
  }
}
