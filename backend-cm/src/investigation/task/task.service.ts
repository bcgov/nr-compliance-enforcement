import { Injectable } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { task } from "../../../prisma/investigation/generated/task";
import { Task } from "./dto/task";

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findMany(investigationIdentifier?: string) {
    const prismaTasks = await this.prisma.task.findMany({
      select: {
        task_guid: true,
        investigation_guid: true,
        task_type_code: true,
        task_sub_type_code: true,
        task_status_code: true,
        assigned_app_user_guid_ref: true,
        task_number: true,
        description: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
        ...(investigationIdentifier && {
          investigation_guid: investigationIdentifier,
        }),
      },
    });

    return this.mapper.mapArray<task, Task>(prismaTasks as Array<task>, "task", "Task");
  }

  async findOne(taskIdentifier: string) {
    const prismaTask = await this.prisma.task.findUnique({
      select: {
        task_guid: true,
        investigation_guid: true,
        task_type_code: true,
        task_sub_type_code: true,
        task_status_code: true,
        assigned_app_user_guid_ref: true,
        task_number: true,
        description: true,
        active_ind: true,
      },
      where: {
        task_guid: taskIdentifier,
      },
    });

    return this.mapper.map<task, Task>(prismaTask as task, "task", "Task");
  }
}
