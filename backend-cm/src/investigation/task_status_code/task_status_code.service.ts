import { Injectable } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { task_status_code } from "../../../prisma/investigation/generated/task_status_code";
import { TaskStatusCode } from "./dto/task_status_code";

@Injectable()
export class TaskStatusCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaStatuses = await this.prisma.task_status_code.findMany({
      select: {
        task_status_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
      },
    });

    return this.mapper.mapArray<task_status_code, TaskStatusCode>(
      prismaStatuses as Array<task_status_code>,
      "task_status_code",
      "TaskStatusCode",
    );
  }
}
