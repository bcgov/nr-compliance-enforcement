import { Injectable, Logger } from "@nestjs/common";
import { CreateLinkedComplaintXrefDto } from "./dto/create-linked_complaint_xref.dto";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { Complaint } from "../complaint/entities/complaint.entity";

@Injectable()
export class LinkedComplaintXrefService {
  @InjectRepository(LinkedComplaintXref)
  private readonly linkedComplaintXrefRepository: Repository<LinkedComplaintXref>;

  private readonly logger = new Logger(LinkedComplaintXrefService.name);

  async create(createLinkedComplaintXrefDto: CreateLinkedComplaintXrefDto): Promise<LinkedComplaintXref> {
    const newLinkedComplaintXref = this.linkedComplaintXrefRepository.create(createLinkedComplaintXrefDto);
    return newLinkedComplaintXref;
  }

  async findChildComplaints(parentComplaintId) {
    try {
      const builder = this.linkedComplaintXrefRepository
        .createQueryBuilder("linkedComplaint")
        .leftJoinAndMapOne(
          "linkedComplaint.complaint",
          Complaint,
          "complaint",
          "linkedComplaint.linked_complaint_identifier = complaint.complaint_identifier",
        )
        .leftJoin("complaint.complaint_status_code", "complaint_status")
        .addSelect(["complaint_status.complaint_status_code", "complaint_status.short_description"])
        .leftJoinAndMapOne(
          "linkedComplaint.hwcr_complaint",
          HwcrComplaint,
          "hwcr_complaint",
          "linkedComplaint.linked_complaint_identifier = hwcr_complaint.complaint_identifier",
        )
        .leftJoin("hwcr_complaint.species_code", "species_code")
        .addSelect(["species_code.species_code", "species_code.short_description"])
        .leftJoin("hwcr_complaint.hwcr_complaint_nature_code", "complaint_nature_code")
        .addSelect(["complaint_nature_code.hwcr_complaint_nature_code", "complaint_nature_code.long_description"])
        .where("linkedComplaint.complaint_identifier = :id", { id: parentComplaintId })
        .andWhere("linkedComplaint.active_ind = :active", { active: true })
        .orderBy("complaint.incident_utc_datetime", "DESC");
      const data = await builder.getMany();
      const result = data.map((item: any) => {
        return {
          id: item.complaint.complaint_identifier,
          species: item.hwcr_complaint.species_code.short_description,
          natureOfComplaint: item.hwcr_complaint.hwcr_complaint_nature_code.long_description,
          details: item.complaint.detail_text,
          name: item.complaint.caller_name,
          address: item.complaint.caller_address,
          phone: item.complaint.caller_phone_1,
          status: item.complaint.complaint_status_code.short_description,
          parent: false,
        };
      });
      return result ?? [];
    } catch (err) {
      this.logger.error(err);
    }
  }

  async findParentComplaint(childComplaintId) {
    try {
      const builder = this.linkedComplaintXrefRepository
        .createQueryBuilder("linkedComplaint")
        .leftJoinAndMapOne(
          "linkedComplaint.complaint",
          Complaint,
          "complaint",
          "linkedComplaint.complaint_identifier = complaint.complaint_identifier",
        )
        .leftJoin("complaint.complaint_status_code", "complaint_status")
        .addSelect(["complaint_status.complaint_status_code", "complaint_status.short_description"])
        .leftJoinAndMapOne(
          "linkedComplaint.hwcr_complaint",
          HwcrComplaint,
          "hwcr_complaint",
          "linkedComplaint.complaint_identifier = hwcr_complaint.complaint_identifier",
        )
        .leftJoin("hwcr_complaint.species_code", "species_code")
        .addSelect(["species_code.species_code", "species_code.short_description"])
        .leftJoin("hwcr_complaint.hwcr_complaint_nature_code", "complaint_nature_code")
        .addSelect(["complaint_nature_code.hwcr_complaint_nature_code", "complaint_nature_code.long_description"])
        .where("linkedComplaint.linked_complaint_identifier = :id", { id: childComplaintId })
        .andWhere("linkedComplaint.active_ind = :active", { active: true });
      const data = await builder.getMany();
      const result = data.map((item: any) => {
        return {
          id: item.complaint.complaint_identifier,
          species: item.hwcr_complaint.species_code.short_description,
          natureOfComplaint: item.hwcr_complaint.hwcr_complaint_nature_code.long_description,
          details: item.complaint.detail_text,
          name: item.complaint.caller_name,
          address: item.complaint.caller_address,
          phone: item.complaint.caller_phone_1,
          status: item.complaint.complaint_status_code.short_description,
          parent: true,
        };
      });
      return result ?? [];
    } catch (err) {
      this.logger.error(err);
    }
  }
}
