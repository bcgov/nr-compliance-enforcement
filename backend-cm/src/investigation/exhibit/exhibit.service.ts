import { Injectable, Logger } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { exhibit } from "../../../prisma/investigation/generated/exhibit";
import { CreateUpdateExhibitInput, Exhibit, ExhibitFilters, ExhibitResult } from "./dto/exhibit";
import { UserService } from "../../common/user.service";
import { PaginationUtility } from "../../common/pagination.utility";
import { withRlsTransaction } from "../../pg-session-extension/with-rls-transaction";
import { InvestigationService } from "../investigation/investigation.service";

@Injectable()
export class ExhibitService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
    private readonly investigationService: InvestigationService,
  ) {}

  private readonly logger = new Logger(ExhibitService.name);

  // Composes the user-facing exhibit number: investigation name - task number - zero-padded sequence (e.g. INV26-001234-5-001).
  // Extracted to keep the mapper's forMember simple and the control flow out of the parent's complexity score.
  _composeExhibitDisplayNumber = (
    investigationName?: string | null,
    taskNumber?: number | null,
    exhibitNumber?: number | null,
  ): string => {
    const sequence = exhibitNumber == null ? "" : String(exhibitNumber).padStart(3, "0");
    return [investigationName ?? "", taskNumber ?? "", sequence].join("-");
  };

  async findMany(taskGuid?: string) {
    const prismaExhibits = await this.prisma.exhibit.findMany({
      select: {
        exhibit_guid: true,
        task_guid: true,
        investigation_guid: true,
        exhibit_number: true,
        exhibit_display_number: true,
        property_type: true,
        description_text: true,
        quantity_amount: true,
        seized_from_first_name: true,
        seized_from_last_name: true,
        seized_from_address: true,
        seized_from_phone_number: true,
        collected_utc_timestamp: true,
        collected_by_app_user_guid_ref: true,
        location_of_intake_text: true,
        property_tag_number: true,
        active_ind: true,
        create_utc_timestamp: true,
        update_utc_timestamp: true,
        investigation: { select: { name: true } },
        task: { select: { task_number: true } },
      },
      where: {
        active_ind: true,
        ...(taskGuid && { task_guid: taskGuid }),
      },
    });

    return this.mapper.mapArray<exhibit, Exhibit>(prismaExhibits as Array<exhibit>, "exhibit", "Exhibit");
  }

  private readonly SORT_FIELD_MAP: Record<string, string> = {
    exhibitNumber: "exhibit_display_number",
    propertyType: "property_type",
    description: "description_text",
    quantity: "quantity_amount",
    dateCollected: "collected_utc_timestamp",
    location: "location_of_intake_text",
    propertyTag: "property_tag_number",
  };

  private _buildExhibitWhereClause(filters: ExhibitFilters): any {
    const conditions: any[] = [{ active_ind: true }, { investigation_guid: filters.investigationGuid }];

    if (filters.taskFilter) {
      conditions.push({ task_guid: filters.taskFilter });
    }

    if (filters.propertyTypeFilter) {
      conditions.push({ property_type: filters.propertyTypeFilter });
    }

    if (filters.search) {
      const searchConditions: any[] = [
        {
          description_text: { contains: filters.search, mode: "insensitive" },
        },
        {
          exhibit_display_number: { contains: filters.search, mode: "insensitive" },
        },
      ];

      conditions.push({ OR: searchConditions });
    }

    if (filters.officerFilter) {
      conditions.push({ collected_by_app_user_guid_ref: filters.officerFilter });
    }

    if (filters.intakeStartDate || filters.intakeEndDate) {
      const dateCondition: any = {};
      if (filters.intakeStartDate) {
        dateCondition.gte = new Date(filters.intakeStartDate);
      }
      if (filters.intakeEndDate) {
        const end = new Date(filters.intakeEndDate);
        end.setDate(end.getDate() + 1);
        dateCondition.lt = end;
      }
      conditions.push({ collected_utc_timestamp: dateCondition });
    }

    return { AND: conditions };
  }

  private _buildExhibitOrderByClause(filters?: ExhibitFilters): any {
    let orderBy: any = { exhibit_display_number: "asc" };

    if (filters?.sortBy && filters?.sortOrder) {
      const dbField = this.SORT_FIELD_MAP[filters.sortBy];
      const validSortOrder = filters.sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      if (dbField) {
        orderBy = { [dbField]: validSortOrder };
      }
    }

    return orderBy;
  }

  async search(page: number, pageSize: number, filters: ExhibitFilters): Promise<ExhibitResult> {
    const where = this._buildExhibitWhereClause(filters);
    const orderBy = this._buildExhibitOrderByClause(filters);

    const result = await this.paginationUtility.paginate<exhibit, Exhibit>(
      { page, pageSize },
      {
        prismaService: this.prisma,
        modelName: "exhibit",
        sourceTypeName: "exhibit",
        destinationTypeName: "Exhibit",
        mapper: this.mapper,
        whereClause: where,
        orderByClause: orderBy,
      },
    );

    return {
      items: result.items,
      pageInfo: result.pageInfo,
    };
  }

  async findOne(exhibitGuid: string) {
    const prismaExhibit = await this.prisma.exhibit.findUnique({
      select: {
        exhibit_guid: true,
        task_guid: true,
        investigation_guid: true,
        exhibit_number: true,
        exhibit_display_number: true,
        property_type: true,
        description_text: true,
        quantity_amount: true,
        seized_from_first_name: true,
        seized_from_last_name: true,
        seized_from_address: true,
        seized_from_phone_number: true,
        collected_utc_timestamp: true,
        collected_by_app_user_guid_ref: true,
        location_of_intake_text: true,
        property_tag_number: true,
        active_ind: true,
        create_utc_timestamp: true,
        update_utc_timestamp: true,
      },
      where: {
        exhibit_guid: exhibitGuid,
      },
    });

    return this.mapper.map<exhibit, Exhibit>(prismaExhibit as exhibit, "exhibit", "Exhibit");
  }

  async create(exhibitInput: CreateUpdateExhibitInput): Promise<Exhibit> {
    try {
      const exhibit = await withRlsTransaction(this.prisma, async (db) => {
        const taskForExhibit = await db.task.findUnique({
          where: {
            task_guid: exhibitInput.taskGuid,
          },
          select: {
            task_number: true,
            investigation: {
              select: {
                name: true,
              },
            },
          },
        });

        const highestExhibit = await db.exhibit.findFirst({
          where: {
            task_guid: exhibitInput.taskGuid,
          },
          orderBy: {
            exhibit_number: "desc",
          },
          select: {
            exhibit_number: true,
          },
        });

        const nextExhibitNumber = highestExhibit ? highestExhibit.exhibit_number + 1 : 1;

        const exhibitDisplayNumber = this._composeExhibitDisplayNumber(
          taskForExhibit?.investigation?.name,
          taskForExhibit?.task_number,
          nextExhibitNumber,
        );

        return await db.exhibit.create({
          data: {
            task_guid: exhibitInput.taskGuid,
            investigation_guid: exhibitInput.investigationGuid,
            exhibit_number: nextExhibitNumber,
            exhibit_display_number: exhibitDisplayNumber,
            property_type: exhibitInput.propertyType,
            description_text: exhibitInput.description,
            quantity_amount: exhibitInput.quantity,
            seized_from_first_name: exhibitInput.seizedFromFirstName,
            seized_from_last_name: exhibitInput.seizedFromLastName,
            seized_from_address: exhibitInput.seizedFromAddress,
            seized_from_phone_number: exhibitInput.seizedFromPhoneNumber,
            collected_utc_timestamp: exhibitInput.dateCollected ?? new Date(),
            collected_by_app_user_guid_ref: exhibitInput.collectedAppUserGuidRef,
            location_of_intake_text: exhibitInput.locationOfIntake,
            property_tag_number: exhibitInput.propertyTagNumber,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        });
      });
      await this.investigationService.updateInvestigationTimestamp(exhibitInput.investigationGuid);

      return await this.findOne(exhibit.exhibit_guid);
    } catch (error) {
      this.logger.error("Error creating exhibit:", error);
      throw error;
    }
  }

  async remove(exhibitGuid: string): Promise<Exhibit> {
    try {
      const exhibit = await this.prisma.exhibit.findUnique({
        where: { exhibit_guid: exhibitGuid },
      });

      if (!exhibit) {
        throw new Error(`Exhibit with guid ${exhibitGuid} not found`);
      }

      await withRlsTransaction(this.prisma, async (db) => {
        await db.exhibit.update({
          where: {
            exhibit_guid: exhibitGuid,
          },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      });

      await this.investigationService.updateInvestigationTimestamp(exhibit.investigation_guid);
    } catch (error) {
      this.logger.error("Error removing exhibit:", error);
      throw error;
    }
    return await this.findOne(exhibitGuid);
  }

  async update(exhibitInput: CreateUpdateExhibitInput): Promise<Exhibit> {
    try {
      const exhibit = await withRlsTransaction(this.prisma, async (db) => {
        return await db.exhibit.update({
          where: {
            exhibit_guid: exhibitInput.exhibitGuid,
          },
          data: {
            property_type: exhibitInput.propertyType,
            description_text: exhibitInput.description,
            quantity_amount: exhibitInput.quantity,
            seized_from_first_name: exhibitInput.seizedFromFirstName,
            seized_from_last_name: exhibitInput.seizedFromLastName,
            seized_from_address: exhibitInput.seizedFromAddress,
            seized_from_phone_number: exhibitInput.seizedFromPhoneNumber,
            collected_utc_timestamp: exhibitInput.dateCollected ?? new Date(),
            collected_by_app_user_guid_ref: exhibitInput.collectedAppUserGuidRef,
            location_of_intake_text: exhibitInput.locationOfIntake,
            property_tag_number: exhibitInput.propertyTagNumber,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      });

      await this.investigationService.updateInvestigationTimestamp(exhibit.investigation_guid);

      return await this.findOne(exhibit.exhibit_guid);
    } catch (error) {
      this.logger.error("Error updating exhibit:", error);
      throw error;
    }
  }
}
