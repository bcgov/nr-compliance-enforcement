import { Injectable } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { TaskTypeCode } from "./dto/task_type_code";
import { task_type_code } from "../../../prisma/investigation/generated/task_type_code";

@Injectable()
export class TaskTypeCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaTaskTypes = await this.prisma.task_type_code.findMany({
      select: {
        task_type_code: true,
        task_category_type_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
      },
    });

    return this.mapper.mapArray<task_type_code, TaskTypeCode>(
      prismaTaskTypes as Array<task_type_code>,
      "task_type_code",
      "TaskTypeCode",
    );
  }
}
