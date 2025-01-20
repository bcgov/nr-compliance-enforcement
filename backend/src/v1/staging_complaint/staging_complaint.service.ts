import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { StagingStatusCodeEnum } from "../../enum/staging_status_code.enum";
import { StagingStatusCode } from "../staging_status_code/entities/staging_status_code.entity";
import { StagingActivityCodeEnum } from "../../enum/staging_activity_code.enum";
import { StagingActivityCode } from "../staging_activity_code/entities/staging_activity_code.entity";
import { WebEOCComplaint } from "../../types/webeoc-complaint";
import { StagingComplaint } from "./entities/staging_complaint.entity";
import { ACTION_TAKEN_ACTION_TYPES, ACTION_TAKEN_TYPES, WEBEOC_REPORT_TYPE } from "../../types/constants";
import { WebEOCComplaintUpdate } from "../../types/webeoc-complaint-update";
import { isEqual, omit } from "lodash";
import { Complaint } from "../complaint/entities/complaint.entity";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";

@Injectable()
export class StagingComplaintService {
  private readonly WEBEOC_USER = "WebEOC";

  private readonly logger = new Logger(StagingComplaintService.name);

  constructor(
    @InjectRepository(StagingComplaint)
    private repository: Repository<StagingComplaint>,

    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,

    @InjectRepository(ComplaintUpdate)
    private complaintUpdateRepository: Repository<ComplaintUpdate>,
  ) {}

  // Creates a new Complaint record in the staging table based on data retrieved from WebEOC.  The new complaint is created based off of the data in the staging table
  async stageNewComplaint(stagingComplaint: WebEOCComplaint): Promise<StagingComplaint> {
    // find the most recent staged complaint (if there is one).  We use this information to determine if the incoming
    // webeoc complaint is new, an edit, or something that already exists.  We get the most recently updated
    // one because there may be multiple edits, and we want to compare the incoming complaint against the most recent
    // edited complaint
    const existingStagingComplaint = await this.repository
      .createQueryBuilder("stagingComplaint")
      .leftJoinAndSelect("stagingComplaint.stagingActivityCode", "stagingActivityCode")
      .where("stagingComplaint.complaintIdentifer = :complaintIdentifier", {
        complaintIdentifier: stagingComplaint.incident_number,
      })
      .andWhere("stagingActivityCode.stagingActivityCode IN (:...activityCodes)", {
        activityCodes: ["INSERT", "EDIT"],
      })
      .orderBy("stagingComplaint.update_utc_timestamp", "DESC")
      .getOne();

    // the incoming complaint may be an edit, let's check for that.  If it is an edit, we need to create this as an edit record in the staging table
    const existingComplaintJson = existingStagingComplaint?.complaintJsonb as WebEOCComplaint;

    // ignore non HWCR/ERS/GIR complaints
    if (
      stagingComplaint.report_type !== WEBEOC_REPORT_TYPE.HWCR &&
      stagingComplaint.report_type !== WEBEOC_REPORT_TYPE.ERS &&
      stagingComplaint.report_type !== WEBEOC_REPORT_TYPE.GIR
    ) {
      return;
    }

    // The complaint doesn't exist in staging, so create it
    if (!existingComplaintJson) {
      return await this._createNewComplaintInStaging(stagingComplaint, StagingActivityCodeEnum.INSERT);
    }

    // see if the incoming complaint is different than the most recent complaint in staging
    const editIndicator = !this._compareWebEOCComplaints(stagingComplaint, existingComplaintJson);

    // if the incoming webeoc record is an edit, then create this in the staging table as an edit
    if (editIndicator) {
      return await this._createNewComplaintInStaging(stagingComplaint, StagingActivityCodeEnum.EDIT);
    } else {
      // if it's not an edit, that means the complaints are the same, so don't recreate in staging
      return;
    }
  }

  // create a new staged record, using a staging activity code
  async _createNewComplaintInStaging(
    stagingComplaint: WebEOCComplaint,
    stagingActivityCode: StagingActivityCodeEnum,
  ): Promise<StagingComplaint> {
    const newStagingComplaint = this.repository.create();
    const currentDate = new Date();
    newStagingComplaint.stagingStatusCode = { stagingStatusCode: StagingStatusCodeEnum.PENDING } as StagingStatusCode;
    newStagingComplaint.stagingActivityCode = {
      stagingActivityCode: stagingActivityCode,
    } as StagingActivityCode;
    newStagingComplaint.complaintIdentifer = stagingComplaint.incident_number;
    newStagingComplaint.complaintJsonb = stagingComplaint;
    newStagingComplaint.createUserId = this.WEBEOC_USER;
    newStagingComplaint.createUtcTimestamp = currentDate;
    newStagingComplaint.updateUserId = this.WEBEOC_USER;
    newStagingComplaint.updateUtcTimestamp = currentDate;

    await this.repository.save(newStagingComplaint);
    return newStagingComplaint;
  }

  // Given two WebEOCComplaint objects, compare them and return true if they're the same.  This function
  // ignores some attributes (specifically the back_number_of* attributes)
  _compareWebEOCComplaints = (complaint1: WebEOCComplaint, complaint2: WebEOCComplaint): boolean => {
    // Attributes to ignore, if these are changed we don't consider it an edit
    const attributesToIgnore = [
      "back_number_of_days",
      "back_number_of_hours",
      "back_number_of_minutes",
      "status",
      "entrydate", // WebEOC will update the following 3 fields when entering an action taken
      "positionname",
      "username",
    ];

    // Omit the attributes to ignore
    const complaint1Filtered = omit(complaint1, attributesToIgnore);
    const complaint2Filtered = omit(complaint2, attributesToIgnore);

    // If both are null or undefined, return true
    if (!complaint1 && !complaint2) {
      return true;
    }

    // If one is null or undefined, return false
    if (!complaint1 || !complaint2) {
      return false;
    }

    // Perform deep comparison
    return isEqual(complaint1Filtered, complaint2Filtered);
  };

  // Given two StagingComplaint objects, compare them and return true if they're the same.  This function
  // ignores some attributes (specifically the back_number_of* attributes)
  _compareWebEOCComplaintUpdates = (complaint1: WebEOCComplaintUpdate, complaint2: WebEOCComplaintUpdate): boolean => {
    // Attributes to ignore
    const attributesToIgnore = ["back_number_of_days", "back_number_of_hours", "back_number_of_minutes"];

    // Omit the attributes to ignore
    const complaint1Filtered = omit(complaint1, attributesToIgnore);
    const complaint2Filtered = omit(complaint2, attributesToIgnore);

    // If both are null or undefined, return true
    if (!complaint1 && !complaint2) {
      return true;
    }

    // If one is null or undefined, return false
    if (!complaint1 || !complaint2) {
      return false;
    }

    // Perform deep comparison
    return isEqual(complaint1Filtered, complaint2Filtered);
  };

  // Creates a Complaint Update in the staging table.  Used when WebEOC creates a complaint update.
  async stageUpdateComplaint(stagingComplaint: WebEOCComplaintUpdate): Promise<StagingComplaint> {
    const currentDate = new Date();
    // ignore existing updates of the same incident number and update number, they already exist in the staging table
    const previousUpdate = await this.repository
      .createQueryBuilder("stagingComplaint")
      .leftJoinAndSelect("stagingComplaint.stagingActivityCode", "stagingActivityCode")
      .where("stagingComplaint.complaintIdentifer = :complaintIdentifier", {
        complaintIdentifier: stagingComplaint.parent_incident_number,
      })
      .andWhere("stagingActivityCode.stagingActivityCode = :activityCode", { activityCode: "UPDATE" })
      .andWhere(
        new Brackets((qb) => {
          qb.where("stagingComplaint.complaint_jsonb @> :updateNumber", {
            updateNumber: { update_number: stagingComplaint.update_number },
          }).orWhere("stagingComplaint.complaint_jsonb IS NULL");
        }),
      )
      .orderBy("stagingComplaint.update_utc_timestamp", "DESC")
      .getOne();

    const previousUpdateJSON = previousUpdate?.complaintJsonb as WebEOCComplaintUpdate;

    // ignore duplicates
    if (this._compareWebEOCComplaintUpdates(previousUpdateJSON, stagingComplaint)) {
      return;
    }

    const newStagingComplaint = this.repository.create();
    newStagingComplaint.stagingStatusCode = { stagingStatusCode: StagingStatusCodeEnum.PENDING } as StagingStatusCode;
    newStagingComplaint.stagingActivityCode = {
      stagingActivityCode: StagingActivityCodeEnum.UPDATE,
    } as StagingActivityCode;
    newStagingComplaint.complaintIdentifer = stagingComplaint.parent_incident_number;
    newStagingComplaint.complaintJsonb = stagingComplaint;
    newStagingComplaint.createUserId = this.WEBEOC_USER;
    newStagingComplaint.createUtcTimestamp = currentDate;
    newStagingComplaint.updateUserId = this.WEBEOC_USER;
    newStagingComplaint.updateUtcTimestamp = currentDate;

    await this.repository.save(newStagingComplaint);
    return newStagingComplaint;
  }

  async processWebEOCComplaint(complaintIdentifier: string): Promise<any> {
    await this.repository.manager.query("SELECT public.insert_complaint_from_staging($1)", [complaintIdentifier]);
    await this.repository.manager.query("SELECT public.edit_complaint_using_webeoc_complaint($1)", [
      complaintIdentifier,
    ]);
  }

  async processWebEOCComplaintUpdate(complaintIdentifier: string, updateNumber: number): Promise<any> {
    await this.repository.manager.query("SELECT public.insert_complaint_update_from_staging($1, $2)", [
      complaintIdentifier,
      updateNumber,
    ]);
  }

  private _findComplaintIdByWebeocId = async (webeocId: string): Promise<string> => {
    try {
      const result = (await this.complaintRepository
        .createQueryBuilder("complaint")
        .where("complaint.webeoc_identifier = :webeocId", { webeocId })
        .select("complaint.complaint_identifier")
        .orderBy("complaint.update_utc_timestamp", "DESC")
        .getOne()) as Complaint;

      return result?.complaint_identifier;
    } catch (error) {
      this.logger.error(`Unable to find parent complaint for action-taken webeocId: ${webeocId}: error: ${error}`);
      throw Error(`Unable to find parent complaint for action-taken webeocId: ${webeocId}`);
    }
  };

  private _findComplaintUpdateIdByWebeocId = async (webeocId: string): Promise<string> => {
    try {
      const result = (await this.complaintUpdateRepository
        .createQueryBuilder("update")
        .where("update.webeoc_identifier = :webeocId", { webeocId })
        .orderBy("update.update_utc_timestamp", "DESC")
        .getOne()) as ComplaintUpdate;

      return result?.complaintId;
    } catch (error) {
      this.logger.error(
        `Unable to find parent complaint update for action-taken-update webeocId: ${webeocId}: error: ${error}`,
      );
      throw Error(`Unable to find parent complaint update for action-taken-update webeocId: ${webeocId}`);
    }
  };

  private _findActionTakenStagingIdByWebeocId = async (webeocId: string, dataid: number): Promise<string> => {
    try {
      let builder: SelectQueryBuilder<StagingComplaint> = this.repository
        .createQueryBuilder("stg")
        .where(`stg.complaint_jsonb ->> 'webeocId' = :webeocId`, { webeocId });

      if (dataid) {
        builder.andWhere(`stg.complaint_jsonb ->> 'dataid' = :dataid`, { dataid });
      }

      const result = await builder.getOne();

      return result.stagingComplaintGuid;
    } catch (error) {}
  };

  //-- staging and processing functionality
  //-- add any type of object to the staging table so that it can be processed and added to the correct type
  stageObject = async (type: string, entity: any) => {
    const _hasExistingActionTaken = async (complaintId: string, dataId: number, type: string): Promise<boolean> => {
      try {
        const result: StagingComplaint = await this.repository
          .createQueryBuilder("staging")
          .where("staging.complaint_identifier = :complaintId", { complaintId })
          .andWhere("staging.staging_activity_code = :status", { status: type })
          .andWhere(`staging.complaint_jsonb ->> 'dataid' = :dataId`, { dataId })
          .getOne();

        if (result === null) {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        this.logger.error(`Unable to find an action-taken for complaint: ${complaintId}: error: ${error}`);
        throw Error(`Unable to find an action-taken for complaint: ${complaintId}`);
      }
    };

    const _stageActionTaken = async (entity: any, activityCode: string): Promise<StagingComplaint> => {
      const current = new Date();
      const { complaintId: complaintIdentifer } = entity;

      try {
        let item = this.repository.create();

        item = {
          ...item,
          stagingStatusCode: { stagingStatusCode: StagingStatusCodeEnum.PENDING } as StagingStatusCode,
          stagingActivityCode: { stagingActivityCode: activityCode } as StagingActivityCode,
          complaintIdentifer,
          complaintJsonb: entity,
          createUserId: this.WEBEOC_USER,
          updateUserId: this.WEBEOC_USER,
          createUtcTimestamp: current,
          updateUtcTimestamp: current,
        };

        await this.repository.save(item);
        return item;
      } catch (error) {
        this.logger.error(
          `Unable to add ${activityCode} - ${complaintIdentifer} object to the staging table: error: ${error}`,
        );
      }
    };

    const _findComplaintUpdateGuidByWebeocId = async (webeocId: string): Promise<string> => {
      try {
        const result = (await this.complaintUpdateRepository
          .createQueryBuilder("update")
          .where("update.webeoc_identifier = :webeocId", { webeocId })
          .orderBy("update.update_utc_timestamp", "DESC")
          .getOne()) as ComplaintUpdate;

        return result?.complaintUpdateGuid;
      } catch (error) {
        this.logger.error(
          `Unable to find parent complaint update for action-taken-update webeocId: ${webeocId}: error: ${error}`,
        );
        throw Error(`Unable to find parent complaint update for action-taken-update webeocId: ${webeocId}`);
      }
    };

    try {
      const { dataid } = entity;

      if (type === ACTION_TAKEN_TYPES.ACTION_TAKEN) {
        //-- check to see if there is a duplicate action-taken
        const complaintId = await this._findComplaintIdByWebeocId(entity["webeocId"]);
        this.logger.log("webeocId: ", entity["webeocId"]);

        if (complaintId !== undefined) {
          const hasExisting = await _hasExistingActionTaken(
            complaintId,
            dataid,
            ACTION_TAKEN_ACTION_TYPES.CREATE_ACTION_TAKEN,
          );

          //-- I'm not sure this is right the original story CE-618 isn't
          //-- exactly clear on how to handle an edit
          if (hasExisting) {
            //-- do we update the existing action taken?
          } else {
            const actionTaken = { ...entity, complaintId };
            const result = await _stageActionTaken(actionTaken, ACTION_TAKEN_ACTION_TYPES.CREATE_ACTION_TAKEN);
            if (result) {
              //-- when an action is staged a message should be sent back to the webeoc project
              //-- to fire off the next task, to promote the action-taken from staging table to
              //-- action-taken table
            }
          }
        }
      } else if (type === ACTION_TAKEN_TYPES.ACTION_TAKEN_UPDATE) {
        const complaintId = await this._findComplaintUpdateIdByWebeocId(entity["webeocId"]);
        const complaintUpdateGuid = await _findComplaintUpdateGuidByWebeocId(entity["webeocId"]);

        if (complaintId !== undefined) {
          const hasExisting = await _hasExistingActionTaken(
            complaintId,
            dataid,
            ACTION_TAKEN_ACTION_TYPES.UPDATE_ACTION_TAKEN,
          );

          //-- I'm not sure this is right the original story CE-618 isn't
          //-- exactly clear on how to handle an edit
          if (hasExisting) {
            //-- do we update the existing action taken?
          } else {
            const actionTaken = { ...entity, complaintId, complaintUpdateGuid };
            const result = await _stageActionTaken(actionTaken, ACTION_TAKEN_ACTION_TYPES.UPDATE_ACTION_TAKEN);
            if (result) {
              //-- when an action is staged a message should be sent back to the webeoc project
              //-- to fire off the next task, to promote the action-taken-update from staging table to
              //-- action-taken table
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Unable to stage ${type}: ${JSON.stringify(entity)} unable to identify parent complaint: ${error}`,
      );
    }
  };

  processObject = async (type: string, webeocId: string, dataid?: number) => {
    let stagingId = await this._findActionTakenStagingIdByWebeocId(webeocId, dataid);

    if (stagingId !== undefined) {
      await this.repository.manager.query("SELECT public.process_staging_activity_taken($1, $2)", [stagingId, type]);
    } else {
      this.logger.error(`unable to find staging object for webeocid: ${webeocId} - ${type}`);
    }
  };
}
