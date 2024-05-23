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

@Injectable()
export class StagingComplaintService {
  private readonly WEBEOC_USER = "WebEOC";

  constructor(
    @InjectRepository(StagingComplaint)
    private stagingComplaintRepository: Repository<StagingComplaint>,
  ) {}

  // Creates a new Complaint record based on data retrieved from WebEOC.  The new complaint is created based off of the data in the staging table
  async createNewComplaint(stagingComplaint: WebEOCComplaint): Promise<StagingComplaint> {
    const currentDate = new Date();
    const existingStagingComplaint = await this.stagingComplaintRepository
      .createQueryBuilder("stagingComplaint")
      .leftJoinAndSelect("stagingComplaint.stagingActivityCode", "stagingActivityCode")
      .where("stagingComplaint.complaintIdentifer = :complaintIdentifier", {
        complaintIdentifier: stagingComplaint.incident_number,
      })
      .andWhere("stagingActivityCode.stagingActivityCode = :activityCode", { activityCode: "INSERT" })
      .getOne();

    // ignore duplicates
    if (existingStagingComplaint) {
      return;
    }

    // ignore non HWCR/ERS complaints
    if (
      stagingComplaint.report_type !== WEBEOC_REPORT_TYPE.HWCR &&
      stagingComplaint.report_type !== WEBEOC_REPORT_TYPE.ERS
    ) {
      return;
    }

    const newStagingComplaint = this.stagingComplaintRepository.create();
    newStagingComplaint.stagingStatusCode = { stagingStatusCode: StagingStatusCodeEnum.PENDING } as StagingStatusCode;
    newStagingComplaint.stagingActivityCode = {
      stagingActivityCode: StagingActivityCodeEnum.INSERT,
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

  // Creates a Complaint Update staging record.  Used when WebEOC creates a complaint update.
  async createComplaintUpdate(stagingComplaint: WebEOCComplaintUpdate): Promise<StagingComplaint> {
    const currentDate = new Date();
    // ignore existing updates of the same incident number and update number, they already exist in the staging table
    const existingStagingComplaint = await this.stagingComplaintRepository
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
      .getOne();

    // ignore duplicates
    if (existingStagingComplaint) {
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
  }

  async processWebEOCComplaintUpdate(complaintIdentifier: string, updateNumber: number): Promise<any> {
    await this.stagingComplaintRepository.manager.query("SELECT public.insert_complaint_update_from_staging($1, $2)", [
      complaintIdentifier,
      updateNumber,
    ]);
  }
}
