import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { StagingStatusCodeEnum } from "../../enum/staging_status_code.enum";
import { StagingStatusCode } from "../staging_status_code/entities/staging_status_code.entity";
import { StagingActivityCodeEnum } from "../../enum/staging_activity_code.enum";
import { StagingActivityCode } from "../staging_activity_code/entities/staging_activity_code.entity";
import { WebEOCComplaint } from "../../types/webeoc-complaint";
import { StagingComplaint } from "./entities/staging_complaint.entity";
import { WEBEOC_REPORT_TYPE } from "../../types/constants";
import { WebEOCComplaintUpdate } from "../../types/webeoc-complaint-update";
import { isEqual, omit } from "lodash";

@Injectable()
export class StagingComplaintService {
  private readonly WEBEOC_USER = "WebEOC";

  constructor(
    @InjectRepository(StagingComplaint)
    private stagingComplaintRepository: Repository<StagingComplaint>,
  ) {}

  // Creates a new Complaint record in the staging table based on data retrieved from WebEOC.  The new complaint is created based off of the data in the staging table
  async stageNewComplaint(stagingComplaint: WebEOCComplaint): Promise<StagingComplaint> {
    // find the most recent staged complaint (if there is one).  We use this information to determine if the incoming
    // webeoc complaint is new, an edit, or something that already exists.  We get the most recently updated
    // one because there may be multiple edits, and we want to compare the incoming complaint against the most recent
    // edited complaint
    const existingStagingComplaint = await this.stagingComplaintRepository
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

    // ignore non HWCR/ERS complaints
    if (
      stagingComplaint.report_type !== WEBEOC_REPORT_TYPE.HWCR &&
      stagingComplaint.report_type !== WEBEOC_REPORT_TYPE.ERS
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
    const newStagingComplaint = this.stagingComplaintRepository.create();
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

    await this.stagingComplaintRepository.save(newStagingComplaint);
    return newStagingComplaint;
  }

  // Given two WebEOCComplaint objects, compare them and return true if they're the same.  This function
  // ignores some attributes (specifically the back_number_of* attributes)
  _compareWebEOCComplaints = (complaint1: WebEOCComplaint, complaint2: WebEOCComplaint): boolean => {
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
    const previousUpdate = await this.stagingComplaintRepository
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

    const previousUpdateJSON = previousUpdate.complaintJsonb as WebEOCComplaintUpdate;

    // ignore duplicates
    if (this._compareWebEOCComplaintUpdates(previousUpdateJSON, stagingComplaint)) {
      return;
    }

    const newStagingComplaint = this.stagingComplaintRepository.create();
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

    await this.stagingComplaintRepository.save(newStagingComplaint);
    return newStagingComplaint;
  }

  async processWebEOCComplaint(complaintIdentifier: string): Promise<any> {
    await this.stagingComplaintRepository.manager.query("SELECT public.insert_complaint_from_staging($1)", [
      complaintIdentifier,
    ]);
    await this.stagingComplaintRepository.manager.query("SELECT public.edit_complaint_using_webeoc_complaint($1)", [
      complaintIdentifier,
    ]);
  }

  async processWebEOCComplaintUpdate(complaintIdentifier: string, updateNumber: number): Promise<any> {
    await this.stagingComplaintRepository.manager.query("SELECT public.insert_complaint_update_from_staging($1, $2)", [
      complaintIdentifier,
      updateNumber,
    ]);
  }
}
