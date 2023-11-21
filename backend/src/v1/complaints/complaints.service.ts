import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";

import { COMPLAINT_TYPE } from "src/types/complaints/complaint-type";
import { Complaint } from "../complaint/entities/complaint.entity";

import { DelegateDto } from "src/types/models/people/delegate";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { createComplaintMetaData } from "src/middleware/maps/automapper-meta-data";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { OrganizationCodeTable } from "src/types/models/code-tables";
import { applyComplaintMap } from "src/middleware/maps/automapper-maps";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";
import { ComplaintDto } from "src/types/models/complaints/complaint";

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);

  @InjectRepository(Complaint)
  private _complaintsRepository: Repository<Complaint>;

  private mapper: Mapper;
  //   @InjectRepository(AllegationComplaint)
  //   private _allegationsRepository: Repository<AllegationComplaint>;

  constructor(@InjectMapper() mapper) {
    this.mapper = mapper;

    createComplaintMetaData();
    applyComplaintMap(mapper);
  }

  private _generateQueryBuilder = (
    type: COMPLAINT_TYPE
  ): SelectQueryBuilder<Complaint> => {
    const builder = this._complaintsRepository
      .createQueryBuilder("complaint")
      .leftJoin("complaint.complaint_status_code", "complaint_status")
      .addSelect([
        "complaint_status.complaint_status_code",
        "complaint_status.short_description",
        "complaint_status.long_description",
      ])
      .leftJoin("complaint.referred_by_agency_code", "referred_by")
      .addSelect([
        "referred_by.agency_code",
        "referred_by.short_description",
        "referred_by.long_description",
      ])
      .leftJoin("complaint.owned_by_agency_code", "owned_by")
      .addSelect([
        "owned_by.agency_code",
        "owned_by.short_description",
        "owned_by.long_description",
      ])
      .leftJoinAndSelect("complaint.cos_geo_org_unit", "cos_organization")
      .leftJoinAndSelect(
        "complaint.person_complaint_xref",
        "delegate",
        "delegate.active_ind = true"
      )
      .leftJoinAndSelect("delegate.person_complaint_xref_code", "delegate_code")
      .leftJoinAndSelect(
        "delegate.person_guid",
        "person",
        "delegate.active_ind = true"
      )
      .addSelect([
        "person.person_guid",
        "person.first_name",
        "person.middle_name_1",
        "person.middle_name_2",
        "person.last_name",
      ]);
    return builder;
  };

  findAllByType = async (
    complaintType: COMPLAINT_TYPE
  ): Promise<Array<ComplaintDto>> => {
    const builder = this._generateQueryBuilder(complaintType);
    const results = await builder.getMany();

    const items = this.mapper.mapArray<Complaint, ComplaintDto>(
      results,
      "Complaint",
      "ComplaintDto"
    );

    return items;
  };
}
