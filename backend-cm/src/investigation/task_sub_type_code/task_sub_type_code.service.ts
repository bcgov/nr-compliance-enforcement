import { Injectable } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { task_sub_type_code } from "../../../prisma/investigation/generated/task_sub_type_code";
import { TaskSubTypeCode } from "./dto/task_sub_type_code";

@Injectable()
export class TaskSubTypeCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaTaskSubTypes = await this.prisma.task_sub_type_code.findMany({
      select: {
        task_sub_type_code: true,
        task_type_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
      },
    });

    return this.mapper.mapArray<task_sub_type_code, TaskSubTypeCode>(
      prismaTaskSubTypes as Array<task_sub_type_code>,
      "task_sub_type_code",
      "TaskSubTypeCode",
    );
  }
}
