import { BadRequestException, Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { CreateHwcrComplaintDto } from "./dto/create-hwcr_complaint.dto";
import { UpdateHwcrComplaintDto } from "./dto/update-hwcr_complaint.dto";
import { HwcrComplaint } from "./entities/hwcr_complaint.entity";
import { ComplaintService } from "../complaint/complaint.service";
import { Brackets, DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID, randomUUID } from "crypto";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
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
import { SearchResults } from "../complaint/models/search-results";
import { SearchPayload } from "../complaint/models/search-payload";
import { REQUEST } from "@nestjs/core";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { MapSearchResults } from "../../../src/types/complaints/map-search-results";

@Injectable({ scope: Scope.REQUEST })
export class HwcrComplaintService {
  private readonly logger = new Logger(HwcrComplaintService.name);

  constructor(@Inject(REQUEST) private request: Request, private dataSource: DataSource) {}
  @InjectRepository(HwcrComplaint)
  private hwcrComplaintsRepository: Repository<HwcrComplaint>;
  @InjectRepository(CosGeoOrgUnit)
  private cosGeoOrgUnitRepository: Repository<CosGeoOrgUnit>;
  @InjectRepository(Office)
  private officeRepository: Repository<Office>;
  @InjectRepository(Officer)
  private officersRepository: Repository<Officer>;
  @Inject(ComplaintService)
  protected readonly complaintService: ComplaintService;
  @Inject(AttractantHwcrXrefService)
  protected readonly attractantHwcrXrefService: AttractantHwcrXrefService;
  @Inject(PersonComplaintXrefService)
  protected readonly personComplaintXrefService: PersonComplaintXrefService;

  async create(hwcrComplaint: string): Promise<HwcrComplaint> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createHwcrComplaintDto: CreateHwcrComplaintDto = JSON.parse(hwcrComplaint);
    createHwcrComplaintDto.hwcr_complaint_guid = randomUUID();
    createHwcrComplaintDto.update_utc_timestamp = createHwcrComplaintDto.create_utc_timestamp = new Date();
    let newHwcrComplaintString;
    try {
      const complaint: Complaint = await this.complaintService.create(
        JSON.stringify(createHwcrComplaintDto.complaint_identifier),
        queryRunner
      );
      createHwcrComplaintDto.create_user_id = createHwcrComplaintDto.update_user_id = complaint.create_user_id;
      createHwcrComplaintDto.complaint_identifier.complaint_identifier = complaint.complaint_identifier;
      newHwcrComplaintString = await this.hwcrComplaintsRepository.create(createHwcrComplaintDto);
      let newHwcrComplaint: HwcrComplaint;
      newHwcrComplaint = <HwcrComplaint>await queryRunner.manager.save(newHwcrComplaintString);

      if (createHwcrComplaintDto.complaint_identifier.person_complaint_xref[0] !== undefined) {
        createHwcrComplaintDto.complaint_identifier.person_complaint_xref[0].complaint_identifier =
          newHwcrComplaint.complaint_identifier;
        await this.personComplaintXrefService.assignOfficer(
          queryRunner,
          newHwcrComplaint.complaint_identifier.complaint_identifier,
          createHwcrComplaintDto.complaint_identifier.person_complaint_xref[0]
        );
      }

      if (newHwcrComplaint.attractant_hwcr_xref != null) {
        for (let i = 0; i < newHwcrComplaint.attractant_hwcr_xref.length; i++) {
          const blankHwcrComplaint = new HwcrComplaint();
          blankHwcrComplaint.hwcr_complaint_guid = newHwcrComplaint.hwcr_complaint_guid;
          newHwcrComplaint.attractant_hwcr_xref[i].hwcr_complaint_guid = blankHwcrComplaint;
          await this.attractantHwcrXrefService.create(queryRunner, newHwcrComplaint.attractant_hwcr_xref[i]);
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newHwcrComplaintString;
  }

  async getZoneAtAGlanceStatistics(zone: string): Promise<ZoneAtAGlanceStats> {
    let results: ZoneAtAGlanceStats = {
      total: 0,
      assigned: 0,
      unassigned: 0,
      offices: [],
    };

    const agency = await this._getAgencyByUser();

    //-- get total complaints for the zone
    let totalComplaints = await this.hwcrComplaintsRepository
      .createQueryBuilder("hwcr_complaint")
      .leftJoinAndSelect("hwcr_complaint.complaint_identifier", "complaint_identifier")
      .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
      .where("area_code.zone_code = :zone", { zone })
      .andWhere("complaint_identifier.complaint_status_code = :status", {
        status: "OPEN",
      })
      .andWhere("complaint_identifier.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code })
      .getCount();

    const totalAssignedComplaints = await this.hwcrComplaintsRepository
      .createQueryBuilder("hwcr_complaint")
      .leftJoinAndSelect("hwcr_complaint.complaint_identifier", "complaint_identifier")
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
      .andWhere("complaint_identifier.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code })
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

      const assignedComplaintsQuery = await this.hwcrComplaintsRepository
        .createQueryBuilder("assigned_hwcr_complaint")
        .leftJoinAndSelect("assigned_hwcr_complaint.complaint_identifier", "complaint_identifier")
        .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
        .innerJoinAndSelect("complaint_identifier.person_complaint_xref", "person_complaint_xref")
        .where("area_code.offloc_code = :zoneOfficeCode", { zoneOfficeCode })
        .andWhere("person_complaint_xref.active_ind = true")
        .andWhere("person_complaint_xref.person_complaint_xref_code = :Assignee", { Assignee: "ASSIGNEE" })
        .andWhere("complaint_identifier.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("complaint_identifier.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

      offices[i].assigned = await assignedComplaintsQuery.getCount();

      const totalComplaintsQuery = await this.hwcrComplaintsRepository
        .createQueryBuilder("total_hwcr_complaint")
        .leftJoinAndSelect("total_hwcr_complaint.complaint_identifier", "complaint_identifier")
        .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
        .where("area_code.offloc_code = :zoneOfficeCode", { zoneOfficeCode })
        .andWhere("complaint_identifier.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("complaint_identifier.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

      offices[i].unassigned = (await totalComplaintsQuery.getCount()) - offices[i].assigned;

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
          name: officeOfficers[j].person_guid.first_name + " " + officeOfficers[j].person_guid.last_name,
          hwcrAssigned: 0,
          allegationAssigned: 0,
          officerGuid: officeOfficers[j].officer_guid,
        };

        const officerGuid = officers[j].officerGuid;

        const assignedOfficerComplaintsQuery = await this.hwcrComplaintsRepository
          .createQueryBuilder("assigned_hwcr_complaint")
          .leftJoinAndSelect("assigned_hwcr_complaint.complaint_identifier", "complaint_identifier")
          .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
          .leftJoinAndSelect("complaint_identifier.person_complaint_xref", "person_complaint_xref")
          .leftJoinAndSelect("person_complaint_xref.person_guid", "person")
          .leftJoinAndSelect("person.officer", "officer")
          .where("person_complaint_xref.active_ind = true")
          .andWhere("person_complaint_xref.person_complaint_xref_code = :Assignee", { Assignee: "ASSIGNEE" })
          .andWhere("officer.officer_guid = :officerGuid", { officerGuid })
          .andWhere("complaint_identifier.complaint_status_code = :status", {
            status: "OPEN",
          })
          .andWhere("complaint_identifier.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

        officers[j].hwcrAssigned = await assignedOfficerComplaintsQuery.getCount();
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
