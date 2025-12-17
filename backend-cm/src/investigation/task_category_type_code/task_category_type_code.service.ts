import { Injectable } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { TaskCategoryTypeCode } from "./dto/task_category_type_code";
import { task_category_type_code } from "../../../prisma/investigation/generated/task_category_type_code";

@Injectable()
export class TaskCategoryTypeCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaTaskTypes = await this.prisma.task_category_type_code.findMany({
      select: {
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

    return this.mapper.mapArray<task_category_type_code, TaskCategoryTypeCode>(
      prismaTaskTypes as Array<task_category_type_code>,
      "task_category_type_code",
      "TaskCategoryTypeCode",
    );
  }
}
