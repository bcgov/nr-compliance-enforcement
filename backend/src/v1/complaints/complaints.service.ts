import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";

import { COMPLAINT_TYPE } from "src/types/complaints/complaint-type";
import { Complaint } from "../complaint/entities/complaint.entity";
// import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import * as Complaints from "src/types/models/complaints";
import { Delegate } from "src/types/models/people/delegate";

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);

  @InjectRepository(Complaint)
  private _complaintsRepository: Repository<Complaint>;
  //   @InjectRepository(AllegationComplaint)
  //   private _allegationsRepository: Repository<AllegationComplaint>;

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
  ): Promise<Array<Complaints.Complaint>> => {
    const builder = this._generateQueryBuilder(complaintType);
    const items = await builder.getMany();

    const results = items.map((item) => {
      const {
        complaint_identifier: id,
        detail_text: details,
        caller_name: name,
        caller_address: address,
        caller_email: email,
        caller_phone_1: phone1,
        caller_phone_2: phone2,
        caller_phone_3: phone3,
        location_geometry_point: { type: locationType, coordinates },
        location_summary_text: locationSummary,
        location_detailed_text: locationDetail,
        complaint_status_code: { complaint_status_code: status },
        referred_by_agency_code: referredBy,
        owned_by_agency_code: ownedBy,
        referred_by_agency_other_text: referredByAgencyOther,
        incident_reported_utc_timestmp: incidentDateTime,
        incident_utc_datetime: reportedOn,
        cos_geo_org_unit: organization,
        person_complaint_xref: rawDelegates,
      } = item;

      let record: Complaints.Complaint = {
        id,
        details,
        name,
        address,
        email,
        phone1,
        phone2,
        phone3,
        location: { type: locationType, coordinates },
        locationSummary,
        locationDetail,
        status,
        referredBy: referredBy ? referredBy.agency_code : "",
        ownedBy: ownedBy ? ownedBy.agency_code : "",
        referredByAgencyOther,
        reportedOn,
        incidentDateTime,
        organization: { area: "", region: "", zone: "" },
        delegates: [],
      };

      if (organization) {
        const {
          area_code: area,
          zone_code: zone,
          region_code: region,
        } = organization;
        record = { ...record, organization: { area, zone, region } };
      }

      if (rawDelegates && rawDelegates.length !== 0) {
        const delegates = rawDelegates.map(
          ({
            personComplaintXrefGuid: xrefId,
            active_ind: isActive,
            person_complaint_xref_code: {
              person_complaint_xref_code: delegateType,
            },
            person_guid: {
              person_guid: personId,
              first_name: firstName,
              last_name: lastName,
              middle_name_1: middleName1,
              middle_name_2: middleName2,
            },
          }) => {
            return {
              xrefId,
              isActive,
              type: delegateType,
              person: {
                id: personId,
                firstName,
                lastName,
                middleName1,
                middleName2,
              },
            } as Delegate
          }
        );

        record = { ...record, delegates };
      }

      return record;
    });

    return results;
  };
}
