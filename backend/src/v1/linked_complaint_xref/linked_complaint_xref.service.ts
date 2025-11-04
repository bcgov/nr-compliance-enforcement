import { Injectable, Logger, Inject, Scope } from "@nestjs/common";
import { CreateLinkedComplaintXrefDto } from "./dto/create-linked_complaint_xref.dto";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { REQUEST } from "@nestjs/core";
import { getIdirFromRequest, getUserAuthGuidFromRequest } from "../../common/get-idir-from-request";
import { getAppUserByAuthUserGuid } from "../../external_api/shared_data";

@Injectable({ scope: Scope.REQUEST })
export class LinkedComplaintXrefService {
  @InjectRepository(LinkedComplaintXref)
  private readonly linkedComplaintXrefRepository: Repository<LinkedComplaintXref>;

  private readonly logger = new Logger(LinkedComplaintXrefService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async create(createLinkedComplaintXrefDto: CreateLinkedComplaintXrefDto): Promise<LinkedComplaintXref> {
    const newLinkedComplaintXref = this.linkedComplaintXrefRepository.create(createLinkedComplaintXrefDto);
    return newLinkedComplaintXref;
  }

  private async findLinkedComplaintsByRelationship(complaintId: string, isParent: boolean) {
    const joinField = isParent ? "linkedComplaint.complaint_identifier" : "linkedComplaint.linked_complaint_identifier";
    const whereField = isParent
      ? "linkedComplaint.linked_complaint_identifier"
      : "linkedComplaint.complaint_identifier";

    const builder = this.linkedComplaintXrefRepository
      .createQueryBuilder("linkedComplaint")
      .leftJoinAndMapOne(
        "linkedComplaint.complaint",
        Complaint,
        "complaint",
        `${joinField} = complaint.complaint_identifier`,
      )
      .leftJoin("complaint.complaint_status_code", "complaint_status")
      .addSelect(["complaint_status.complaint_status_code", "complaint_status.short_description"])
      .leftJoin("complaint.complaint_type_code", "complaint_type")
      .addSelect(["complaint_type.complaint_type_code", "complaint_type.long_description"])
      .addSelect(["complaint.owned_by_agency_code_ref"])
      .leftJoinAndMapOne(
        "linkedComplaint.hwcr_complaint",
        HwcrComplaint,
        "hwcr_complaint",
        `${joinField} = hwcr_complaint.complaint_identifier`,
      )
      .leftJoin("hwcr_complaint.species_code", "species_code")
      .addSelect(["species_code.species_code", "species_code.short_description"])
      .leftJoin("hwcr_complaint.hwcr_complaint_nature_code", "complaint_nature_code")
      .addSelect(["complaint_nature_code.hwcr_complaint_nature_code", "complaint_nature_code.long_description"])
      .leftJoinAndMapOne(
        "linkedComplaint.allegation_complaint",
        AllegationComplaint,
        "allegation_complaint",
        `${joinField} = allegation_complaint.complaint_identifier`,
      )
      .leftJoin("allegation_complaint.violation_code", "violation_code")
      .addSelect(["violation_code.violation_code", "violation_code.long_description"])
      .leftJoinAndMapOne(
        "linkedComplaint.gir_complaint",
        GirComplaint,
        "gir_complaint",
        `${joinField} = gir_complaint.complaint_identifier`,
      )
      .leftJoin("gir_complaint.gir_type_code", "gir_type_code")
      .addSelect(["gir_type_code.gir_type_code", "gir_type_code.long_description"])
      .where(`${whereField} = :id`, { id: complaintId })
      .andWhere("linkedComplaint.active_ind = :active", { active: true });

    if (!isParent) {
      builder.orderBy("complaint.incident_utc_datetime", "DESC");
    }

    const data = await builder.getMany();

    const result = data.map((item: any) => {
      // Determine issueType based on complaint type
      let issueType = null;
      const complaintType = item.complaint.complaint_type_code?.complaint_type_code;

      if (complaintType === "HWCR") {
        issueType = item.hwcr_complaint?.hwcr_complaint_nature_code?.hwcr_complaint_nature_code || null;
      } else if (complaintType === "ERS") {
        issueType = item.allegation_complaint?.violation_code?.violation_code || null;
      } else if (complaintType === "GIR") {
        issueType = item.gir_complaint?.gir_type_code?.gir_type_code || null;
      }

      return {
        id: item.complaint.complaint_identifier,
        issueType: issueType,
        details: item.complaint.detail_text,
        name: item.complaint.caller_name,
        address: item.complaint.caller_address,
        phone: item.complaint.caller_phone_1,
        status: item.complaint.complaint_status_code.short_description,
        parent: isParent,
        link_type: item.link_type,
        agency: item.complaint.owned_by_agency_code_ref || null,
        type: complaintType || null,
        complaintTypeDescription: item.complaint.complaint_type_code.long_description,
        species: item.hwcr_complaint?.species_code?.short_description,
        natureOfComplaint: item.hwcr_complaint?.hwcr_complaint_nature_code?.long_description,
        violationType: item.allegation_complaint?.violation_code?.long_description,
        girType: item.gir_complaint?.gir_type_code?.long_description,
      };
    });

    return result ?? [];
  }

  async findChildComplaints(parentComplaintId: string) {
    return this.findLinkedComplaintsByRelationship(parentComplaintId, false);
  }

  async findParentComplaint(childComplaintId: string) {
    return this.findLinkedComplaintsByRelationship(childComplaintId, true);
  }

  async findDirectLinks(complaintId: string) {
    try {
      const parents = await this.findLinkedComplaintsByRelationship(complaintId, true);
      const children = await this.findLinkedComplaintsByRelationship(complaintId, false);

      const combined = [...parents, ...children];

      const uniqueMap = new Map();
      combined.forEach((complaint) => {
        uniqueMap.set(complaint.id, complaint);
      });

      return Array.from(uniqueMap.values());
    } catch (err) {
      this.logger.error(`Error finding direct links: ${err}`);
      return [];
    }
  }

  async findAllRelatedComplaints(complaintId: string) {
    try {
      const visited = new Set<string>();
      const result: any[] = [];
      const queue: string[] = [complaintId];

      while (queue.length > 0) {
        const currentId = queue.shift();

        if (visited.has(currentId)) {
          continue;
        }
        visited.add(currentId);

        const parents = await this.findLinkedComplaintsByRelationship(currentId, true);
        const children = await this.findLinkedComplaintsByRelationship(currentId, false);

        for (const parent of parents) {
          if (!visited.has(parent.id)) {
            result.push(parent);
            queue.push(parent.id);
          }
        }

        for (const child of children) {
          if (!visited.has(child.id)) {
            result.push(child);
            queue.push(child.id);
          }
        }
      }

      result.sort((a, b) => a.id.localeCompare(b.id));

      return result;
    } catch (err) {
      this.logger.error(`Error finding all related complaints: ${err}`);
      return [];
    }
  }

  async linkComplaints(
    parentComplaintId: string,
    childComplaintId: string,
    linkType: string,
    user: any,
    token: string,
  ) {
    try {
      const idir = getIdirFromRequest(this.request);

      const authUserGuid = getUserAuthGuidFromRequest(this.request);

      const appUser = await getAppUserByAuthUserGuid(token, authUserGuid);

      if (!appUser) {
        throw new Error("App user not found");
      }

      const existingLink = await this.linkedComplaintXrefRepository.findOne({
        where: {
          complaint_id: parentComplaintId,
          linked_complaint_id: childComplaintId,
          active_ind: true,
        },
      });

      if (existingLink) {
        if (existingLink.link_type !== linkType) {
          existingLink.link_type = linkType;
          existingLink.update_user_id = idir;
          existingLink.update_utc_timestamp = new Date();
          existingLink.app_user_guid = appUser.appUserGuid;
          return await this.linkedComplaintXrefRepository.save(existingLink);
        }
        return existingLink;
      }

      const newLink = this.linkedComplaintXrefRepository.create({
        complaint_id: parentComplaintId,
        linked_complaint_id: childComplaintId,
        link_type: linkType,
        active_ind: true,
        create_user_id: idir,
        create_utc_timestamp: new Date(),
        update_user_id: idir,
        update_utc_timestamp: new Date(),
        app_user_guid: appUser.appUserGuid,
      });

      return await this.linkedComplaintXrefRepository.save(newLink);
    } catch (error) {
      this.logger.error(`Error linking complaints: ${error.message}`);
      throw error;
    }
  }

  async unlinkComplaints(complaintId: string, linkedComplaintId: string, user: any) {
    try {
      const idir = getIdirFromRequest(this.request);

      // Find the link in either direction (could be parent->child or child->parent)
      const link = await this.linkedComplaintXrefRepository.findOne({
        where: [
          {
            complaint_id: complaintId,
            linked_complaint_id: linkedComplaintId,
            active_ind: true,
          },
          {
            complaint_id: linkedComplaintId,
            linked_complaint_id: complaintId,
            active_ind: true,
          },
        ],
      });

      if (!link) {
        throw new Error("Link not found");
      }

      link.active_ind = false;
      link.update_user_id = idir;
      link.update_utc_timestamp = new Date();

      return await this.linkedComplaintXrefRepository.save(link);
    } catch (error) {
      this.logger.error(`Error unlinking complaints: ${error.message}`);
      throw error;
    }
  }
}
