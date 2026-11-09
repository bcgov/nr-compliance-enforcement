import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { UserService } from "src/common/user.service";

@Injectable()
export class AppUserActivityXrefService {
  constructor(
    private readonly prisma: SharedPrismaService,
    private readonly user: UserService,
  ) {}

  private readonly logger = new Logger(AppUserActivityXrefService.name);

  async addCollaborator(activityType: string, activityIdentifier: string, appUserGuid: string): Promise<void> {
    try {
      await this.prisma.app_user_activity_xref.create({
        data: {
          activity_type: activityType,
          activity_identifier_ref: activityIdentifier,
          app_user_guid: appUserGuid,
          app_user_activity_xref_code: "COLLABORAT",
          active_ind: true,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Error adding collaborator:", error);
      throw error;
    }
  }

  async removeCollaborator(
    activityType: string,
    activityIdentifier: string,
    appUserActivityXrefGuid: string,
  ): Promise<void> {
    try {
      const collaborator = await this.prisma.app_user_activity_xref.findFirst({
        where: {
          app_user_activity_xref_guid: appUserActivityXrefGuid,
          activity_type: activityType,
          activity_identifier_ref: activityIdentifier,
          app_user_activity_xref_code: "COLLABORAT",
        },
      });

      if (!collaborator) {
        throw new Error("Collaborator not found for this activity.");
      }

      await this.prisma.app_user_activity_xref.update({
        where: {
          app_user_activity_xref_guid: appUserActivityXrefGuid,
        },
        data: {
          active_ind: false,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Error removing collaborator:", error);
      throw error;
    }
  }

  async assign(
    activityType: string,
    activityIdentifier: string,
    code: string,
    appUserGuid: string | null,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const assigned = await tx.app_user_activity_xref.findFirst({
          where: {
            activity_type: activityType,
            activity_identifier_ref: activityIdentifier,
            app_user_activity_xref_code: code,
            active_ind: true,
          },
        });

        if (assigned?.app_user_guid === appUserGuid) {
          return;
        }

        if (assigned) {
          await tx.app_user_activity_xref.update({
            where: {
              app_user_activity_xref_guid: assigned.app_user_activity_xref_guid,
            },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        }

        if (appUserGuid) {
          await tx.app_user_activity_xref.create({
            data: {
              activity_type: activityType,
              activity_identifier_ref: activityIdentifier,
              app_user_guid: appUserGuid,
              app_user_activity_xref_code: code,
              active_ind: true,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error(`Error assigning ${code}:`, error);
      throw error;
    }
  }

  findAssignees(activityType: string, activityIdentifiers: string[]) {
    return this.prisma.app_user_activity_xref.findMany({
      where: {
        activity_type: activityType,
        activity_identifier_ref: { in: activityIdentifiers },
        app_user_activity_xref_code: { in: ["ASSIGNEE", "SUPERVISOR", "FILECOORD"] },
        active_ind: true,
      },
    });
  }

  async findAssignedActivityIdentifiers(activityType: string, code: string, appUserGuid: string): Promise<string[]> {
    const assigned = await this.prisma.app_user_activity_xref.findMany({
      where: {
        activity_type: activityType,
        app_user_activity_xref_code: code,
        app_user_guid: appUserGuid,
        active_ind: true,
      },
      select: {
        activity_identifier_ref: true,
      },
    });
    return assigned.map((xref) => xref.activity_identifier_ref);
  }

  findCollaborators(activityType: string, activityIdentifier: string) {
    return this.prisma.app_user_activity_xref.findMany({
      where: {
        activity_type: activityType,
        activity_identifier_ref: activityIdentifier,
        app_user_activity_xref_code: "COLLABORAT",
        active_ind: true,
      },
      orderBy: {
        create_utc_timestamp: "asc",
      },
    });
  }
}
