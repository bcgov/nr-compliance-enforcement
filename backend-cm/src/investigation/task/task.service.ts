import { Injectable, Logger } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { task } from "../../../prisma/investigation/generated/task";
import { CreateUpdateTaskInput, Task } from "./dto/task";
import { UserService } from "../../common/user.service";

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  async findMany(investigationIdentifier?: string) {
    const prismaTasks = await this.prisma.task.findMany({
      select: {
        task_guid: true,
        investigation_guid: true,
        task_type_code: true,
        task_status_code: true,
        assigned_app_user_guid_ref: true,
        app_create_user_guid_ref: true,
        create_utc_timestamp: true,
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
        task_status_code: true,
        assigned_app_user_guid_ref: true,
        app_create_user_guid_ref: true,
        create_utc_timestamp: true,
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

  async create(taskInput: CreateUpdateTaskInput): Promise<Task> {
    const maxRetries = 3;
    let lastError: any;

    // Manual Concurrency to handle race conditions as we don't have a broader concurrency strategy in place
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const task = await this.prisma.$transaction(async (tx) => {
          // Get the highest task number
          const highestTask = await tx.task.findFirst({
            where: {
              investigation_guid: taskInput.investigationIdentifier,
            },
            orderBy: {
              task_number: "desc",
            },
            select: {
              task_number: true,
            },
          });

          // Generate next task number (start at 1 if no tasks exist)
          const nextTaskNumber = highestTask ? highestTask.task_number + 1 : 1;

          return await tx.task.create({
            data: {
              investigation_guid: taskInput.investigationIdentifier,
              task_type_code: taskInput.taskTypeCode,
              task_status_code: taskInput.taskStatusCode,
              assigned_app_user_guid_ref: taskInput.assignedUserIdentifier,
              app_create_user_guid_ref: taskInput.appUserIdentifier,
              app_create_utc_timestamp: new Date(),
              task_number: nextTaskNumber,
              description: taskInput.description,
              active_ind: true,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });
        });

        return await this.findOne(task.task_guid);
      } catch (error) {
        lastError = error;

        // Check if it's a unique constraint violation
        if (error?.code === "P2002") {
          if (attempt < maxRetries - 1) {
            // Adds a small delay before retrying
            await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
            continue;
          }
        }

        // If it's not a unique constraint error, or we've exhausted retries, throw
        this.logger.error("Error adding task:", error);
        throw error;
      }
    }
  }

  async remove(taskIdentifier: string): Promise<Task> {
    try {
      await this.prisma.task.update({
        where: {
          task_guid: taskIdentifier,
        },
        data: {
          active_ind: false,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Error removing contravention:", error);
      throw error;
    }
    return await this.findOne(taskIdentifier);
  }

  async update(taskInput: CreateUpdateTaskInput): Promise<Task> {
    try {
      const task = await this.prisma.task.update({
        where: {
          task_guid: taskInput.taskIdentifier,
        },
        data: {
          task_type_code: taskInput.taskTypeCode,
          task_status_code: taskInput.taskStatusCode,
          assigned_app_user_guid_ref: taskInput.assignedUserIdentifier,
          app_update_user_guid_ref: taskInput.appUserIdentifier,
          app_update_utc_timestamp: new Date(),
          description: taskInput.description,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });

      return await this.findOne(task.task_guid);
    } catch (error) {
      this.logger.error("Error adding task:", error);
      throw error;
    }
  }
}
