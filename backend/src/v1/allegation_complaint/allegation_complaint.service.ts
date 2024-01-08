import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  Scope,
} from "@nestjs/common";
import { CreateAllegationComplaintDto } from "./dto/create-allegation_complaint.dto";
import { UpdateAllegationComplaintDto } from "./dto/update-allegation_complaint.dto";
import { AllegationComplaint } from "./entities/allegation_complaint.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { UUID, randomUUID } from "crypto";
import { ComplaintService } from "../complaint/complaint.service";
import {
  OfficeStats,
  OfficerStats,
  ZoneAtAGlanceStats,
} from "../../../src/types/zone_at_a_glance/zone_at_a_glance_stats";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { SearchPayload } from "../complaint/models/search-payload";
import { SearchResults } from "../complaint/models/search-results";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { REQUEST } from "@nestjs/core";
import { MapSearchResults } from "../../../src/types/complaints/map-search-results";

@Injectable({ scope: Scope.REQUEST })
export class AllegationComplaintService {
  private readonly logger = new Logger(AllegationComplaintService.name);

  constructor(
    @Inject(REQUEST) private request: Request,
    private dataSource: DataSource
  ) {}
  @InjectRepository(AllegationComplaint)
  private allegationComplaintsRepository: Repository<AllegationComplaint>;
  @InjectRepository(Office)
  private officeRepository: Repository<Office>;
  @InjectRepository(Officer)
  private officersRepository: Repository<Officer>;
  @InjectRepository(CosGeoOrgUnit)
  private cosGeoOrgUnitRepository: Repository<CosGeoOrgUnit>;
  @Inject(ComplaintService)
  protected readonly complaintService: ComplaintService;
  @Inject(PersonComplaintXrefService)
  protected readonly personComplaintXrefService: PersonComplaintXrefService;

  async create(allegationComplaint: string): Promise<AllegationComplaint> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createAllegationComplaintDto: CreateAllegationComplaintDto =
      JSON.parse(allegationComplaint);
    createAllegationComplaintDto.allegation_complaint_guid = randomUUID();
    createAllegationComplaintDto.update_utc_timestamp =
      createAllegationComplaintDto.create_utc_timestamp = new Date();
    let newAllegationComplaintString;
    try {
      const complaint: Complaint = await this.complaintService.create(
        JSON.stringify(createAllegationComplaintDto.complaint_identifier),
        queryRunner
      );
      createAllegationComplaintDto.create_user_id =
        createAllegationComplaintDto.update_user_id = complaint.create_user_id;
      createAllegationComplaintDto.complaint_identifier.complaint_identifier =
        complaint.complaint_identifier;
      newAllegationComplaintString =
        await this.allegationComplaintsRepository.create(
          createAllegationComplaintDto
        );
      let newAllegationComplaint: AllegationComplaint;
      newAllegationComplaint = <AllegationComplaint>(
        await queryRunner.manager.save(newAllegationComplaintString)
      );

      if (
        createAllegationComplaintDto.complaint_identifier
          .person_complaint_xref?.[0]
      ) {
        createAllegationComplaintDto.complaint_identifier.person_complaint_xref[0].complaint_identifier =
          newAllegationComplaint.complaint_identifier;
        await this.personComplaintXrefService.assignOfficer(queryRunner,
          newAllegationComplaint.complaint_identifier.complaint_identifier,
          createAllegationComplaintDto.complaint_identifier
            .person_complaint_xref[0]
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newAllegationComplaintString;
  }

  async getZoneAtAGlanceStatistics(zone: string): Promise<ZoneAtAGlanceStats> {
    let results: ZoneAtAGlanceStats = { total: 0, assigned: 0, unassigned: 0 };
    const agency = await this._getAgencyByUser();

    //-- get total complaints for the zone
    let totalComplaints = await this.allegationComplaintsRepository
      .createQueryBuilder("allegation_complaint")
      .leftJoinAndSelect(
        "allegation_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
      .where("area_code.zone_code = :zone", { zone })
      .andWhere("complaint_identifier.complaint_status_code = :status", {
        status: "OPEN",
      })
      .andWhere(
        "complaint_identifier.owned_by_agency_code.agency_code = :agency",
        { agency: agency.agency_code }
      )
      .getCount();

    const totalAssignedComplaints = await this.allegationComplaintsRepository
      .createQueryBuilder("allegation_complaint")
      .leftJoinAndSelect(
        "allegation_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
      .innerJoinAndSelect(
        "complaint_identifier.person_complaint_xref",
        "person_complaint_xref",
        "person_complaint_xref.active_ind = true"
      )
      .where("area_code.zone_code = :zone", { zone })
      .andWhere("complaint_identifier.complaint_status_code = :status", {
        status: "OPEN",
      })
      .andWhere(
        "complaint_identifier.owned_by_agency_code.agency_code = :agency",
        { agency: agency.agency_code }
      )
      .getCount();

    const officeQuery = await this.cosGeoOrgUnitRepository
      .createQueryBuilder("cos_geo_org_unit")
      .where("cos_geo_org_unit.zone_code = :zone", { zone })
      .distinctOn(["cos_geo_org_unit.offloc_code"])
      .orderBy("cos_geo_org_unit.offloc_code");

    const zoneOffices = await officeQuery.getMany();

    let offices: OfficeStats[] = [];

    for (let i = 0; i < zoneOffices.length; i++) {
      offices[i] = {
        name: zoneOffices[i].office_location_name,
        assigned: 0,
        unassigned: 0,
        officers: [],
        officeGuid: null,
      };
      const zoneOfficeCode = zoneOffices[i].office_location_code;

      const assignedComplaintsQuery = await this.allegationComplaintsRepository
        .createQueryBuilder("assigned_allegation_complaint")
        .leftJoinAndSelect(
          "assigned_allegation_complaint.complaint_identifier",
          "complaint_identifier"
        )
        .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
        .innerJoinAndSelect(
          "complaint_identifier.person_complaint_xref",
          "person_complaint_xref"
        )
        .where("area_code.offloc_code = :zoneOfficeCode", { zoneOfficeCode })
        .andWhere("person_complaint_xref.active_ind = true")
        .andWhere(
          "person_complaint_xref.person_complaint_xref_code = :Assignee",
          { Assignee: "ASSIGNEE" }
        )
        .andWhere("complaint_identifier.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere(
          "complaint_identifier.owned_by_agency_code.agency_code = :agency",
          { agency: agency.agency_code }
        );

      offices[i].assigned = await assignedComplaintsQuery.getCount();

      const totalComplaintsQuery = await this.allegationComplaintsRepository
        .createQueryBuilder("unassigned_allegation_complaint")
        .leftJoinAndSelect(
          "unassigned_allegation_complaint.complaint_identifier",
          "complaint_identifier"
        )
        .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
        .where("area_code.offloc_code = :zoneOfficeCode", { zoneOfficeCode })
        .andWhere("complaint_identifier.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere(
          "complaint_identifier.owned_by_agency_code.agency_code = :agency",
          { agency: agency.agency_code }
        );

      offices[i].unassigned =
        (await totalComplaintsQuery.getCount()) - offices[i].assigned;

      const geoCode = zoneOffices[i].office_location_code;
      const officeGuidQuery = await this.officeRepository
        .createQueryBuilder("office")
        .where("office.geo_organization_unit_code = :geoCode", { geoCode });
      const office = await officeGuidQuery.getOne();

      const officeGuid = office.office_guid;
      const officeOfficersQuery = await this.officersRepository
        .createQueryBuilder("officers")
        .leftJoinAndSelect("officers.person_guid", "person")
        .where("officers.office_guid = :officeGuid", { officeGuid });

      const officeOfficers = await officeOfficersQuery.getMany();

      let officers: OfficerStats[] = [];
      for (let j = 0; j < officeOfficers.length; j++) {
        officers[j] = {
          name:
            officeOfficers[j].person_guid.first_name +
            " " +
            officeOfficers[j].person_guid.last_name,
          hwcrAssigned: 0,
          allegationAssigned: 0,
          officerGuid: officeOfficers[j].officer_guid,
        };

        const officerGuid = officers[j].officerGuid;

        const assignedOfficerComplaintsQuery =
          await this.allegationComplaintsRepository
            .createQueryBuilder("assigned_allegation_complaint")
            .leftJoinAndSelect(
              "assigned_allegation_complaint.complaint_identifier",
              "complaint_identifier"
            )
            .leftJoinAndSelect(
              "complaint_identifier.cos_geo_org_unit",
              "area_code"
            )
            .leftJoinAndSelect(
              "complaint_identifier.person_complaint_xref",
              "person_complaint_xref"
            )
            .leftJoinAndSelect("person_complaint_xref.person_guid", "person")
            .leftJoinAndSelect("person.officer", "officer")
            .where("person_complaint_xref.active_ind = true")
            .andWhere(
              "person_complaint_xref.person_complaint_xref_code = :Assignee",
              { Assignee: "ASSIGNEE" }
            )
            .andWhere("officer.officer_guid = :officerGuid", { officerGuid })
            .andWhere("complaint_identifier.complaint_status_code = :status", {
              status: "OPEN",
            })
            .andWhere(
              "complaint_identifier.owned_by_agency_code.agency_code = :agency",
              { agency: agency.agency_code }
            );

        officers[j].allegationAssigned =
          await assignedOfficerComplaintsQuery.getCount();
      }
      offices[i].officers = officers;
    }

    results = {
      ...results,
      total: totalComplaints,
      assigned: totalAssignedComplaints,
      unassigned: totalComplaints - totalAssignedComplaints,
      offices: offices,
    };

    return results;
  }

  private _getAgencyByUser = async (): Promise<AgencyCode> => {
    const idir = getIdirFromRequest(this.request);

    const builder = this.officersRepository
      .createQueryBuilder("officer")
      .leftJoinAndSelect("officer.office_guid", "office")
      .leftJoinAndSelect("office.agency_code", "agency")
      .where("officer.user_id = :idir", { idir });

    const result = await builder.getOne();

    //-- pull the user's agency from the query results and return the agency code
    const {
      office_guid: { agency_code },
    } = result;
    return agency_code;
  };
}
