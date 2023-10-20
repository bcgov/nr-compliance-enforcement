import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { CreateAllegationComplaintDto } from "./dto/create-allegation_complaint.dto";
import { UpdateAllegationComplaintDto } from "./dto/update-allegation_complaint.dto";
import { AllegationComplaint } from "./entities/allegation_complaint.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { UUID, randomUUID } from "crypto";
import { ComplaintService } from "../complaint/complaint.service";
import {
  OfficeStats,
  OfficerStats,
  ZoneAtAGlanceStats,
} from "src/types/zone_at_a_glance/zone_at_a_glance_stats";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { AllegationSearchOptions } from '../../types/complaints/allegation_search_options';

@Injectable()
export class AllegationComplaintService {
  private readonly logger = new Logger(AllegationComplaintService.name);

  constructor(private dataSource: DataSource) {}
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
        await this.personComplaintXrefService.assignOfficer(
          queryRunner,
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

  async findAll(
    sortColumn: string,
    sortOrder: string
  ): Promise<AllegationComplaint[]> {
    //compiler complains if you don't explicitly set the sort order to 'DESC' or 'ASC' in the function
    const sortOrderString = sortOrder === "DESC" ? "DESC" : "ASC";
    const sortTable =
      sortColumn === "complaint_identifier" ||
      sortColumn === "violation_code" ||
      sortColumn === "in_progress_ind"
        ? "allegation_complaint."
        : "complaint_identifier.";
    const sortString =
      sortColumn !== "update_utc_timestamp"
        ? sortTable + sortColumn
        : "GREATEST(complaint_identifier.update_utc_timestamp, allegation_complaint.update_utc_timestamp)";
    return this.allegationComplaintsRepository
      .createQueryBuilder("allegation_complaint")
      .leftJoinAndSelect(
        "allegation_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoinAndSelect(
        "allegation_complaint.violation_code",
        "violation_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.complaint_status_code",
        "complaint_status_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.referred_by_agency_code",
        "referred_by_agency_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.owned_by_agency_code",
        "owned_by_agency_code"
      )
      .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
      .leftJoinAndSelect(
        "complaint_identifier.person_complaint_xref",
        "person_complaint_xref",
        "person_complaint_xref.active_ind = true"
      )
      .leftJoinAndSelect("complaint_identifier.timezone_code", "timezone_code")
      .leftJoinAndSelect(
        "person_complaint_xref.person_guid",
        "person",
        "person_complaint_xref.active_ind = true"
      )

      .orderBy(sortString, sortOrderString)
      .addOrderBy(
        "complaint_identifier.incident_reported_utc_timestmp",
        sortColumn === "incident_reported_utc_timestmp"
          ? sortOrderString
          : "DESC"
      )
      .getMany();
  }

  async search(
    sortColumn: string,
    sortOrder: string,
    options: AllegationSearchOptions,
    page?: number,
    pageSize?: number
  ): Promise<{ complaints: AllegationComplaint[]; totalCount: number }> {
    let skip: number;
    if (page && pageSize) {
      skip = (page - 1) * pageSize;
    }

    //compiler complains if you don't explicitly set the sort order to 'DESC' or 'ASC' in the function
    const sortOrderString = sortOrder === "DESC" ? "DESC" : "ASC";
    let sortTable = "complaint_identifier.";
    if (
      sortColumn === "complaint_identifier" ||
      sortColumn === "violation_code" ||
      sortColumn === "in_progress_ind"
    ) {
      sortTable = "allegation_complaint.";
    } else if (sortColumn === "last_name") {
      sortTable = "person.";
    }
    const sortString =
      sortColumn !== "update_utc_timestamp"
        ? sortTable + sortColumn
        : "_update_utc_timestamp";

    const queryBuilder = this.allegationComplaintsRepository
      .createQueryBuilder("allegation_complaint")
      .addSelect(
        "GREATEST(complaint_identifier.update_utc_timestamp, allegation_complaint.update_utc_timestamp)",
        "_update_utc_timestamp"
      )
      .leftJoinAndSelect(
        "allegation_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoinAndSelect(
        "allegation_complaint.violation_code",
        "violation_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.complaint_status_code",
        "complaint_status_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.referred_by_agency_code",
        "referred_by_agency_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.owned_by_agency_code",
        "owned_by_agency_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.cos_geo_org_unit",
        "cos_geo_org_unit"
      )
      .leftJoinAndSelect(
        "complaint_identifier.person_complaint_xref",
        "person_complaint_xref",
        "person_complaint_xref.active_ind = true"
      )
      .leftJoinAndSelect(
        "person_complaint_xref.person_guid",
        "person",
        "person_complaint_xref.active_ind = true"
      )
      .orderBy(sortString, sortOrderString)
      .addOrderBy(
        "complaint_identifier.incident_reported_utc_timestmp",
        sortColumn === "incident_reported_utc_timestmp"
          ? sortOrderString
          : "DESC"
      );

    this.searchQueryBuilder(
      queryBuilder,
      options
    );

    if (skip !== undefined) {
      // a page number was supplied, limit the results returned
      const [data, totalCount] = await queryBuilder
        .skip(skip)
        .take(pageSize)
        .getManyAndCount();
      return { complaints: data, totalCount: totalCount };
    } else {
      // not paginating results, just get them all
      const [data, totalCount] = await queryBuilder.getManyAndCount();
      return { complaints: data, totalCount: totalCount };
    }
  }

  async searchMap(
    sortColumn: string,
    sortOrder: string,
    options: AllegationSearchOptions
  ): Promise<AllegationComplaint[]> {
    // how many records to skip based on the current page and page size

    const queryBuilder = this.allegationComplaintsRepository
      .createQueryBuilder("allegation_complaint")
      .leftJoinAndSelect(
        "allegation_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoin("allegation_complaint.violation_code", "violation_code")
      .leftJoin(
        "complaint_identifier.complaint_status_code",
        "complaint_status_code"
      )
      .leftJoin(
        "complaint_identifier.referred_by_agency_code",
        "referred_by_agency_code"
      )
      .leftJoin(
        "complaint_identifier.owned_by_agency_code",
        "owned_by_agency_code"
      )
      .leftJoin("complaint_identifier.cos_geo_org_unit", "cos_geo_org_unit")
      .leftJoin(
        "complaint_identifier.person_complaint_xref",
        "person_complaint_xref",
        "person_complaint_xref.active_ind = true"
      )
      .leftJoinAndSelect("complaint_identifier.timezone_code", "timezone_code")
      .leftJoin(
        "person_complaint_xref.person_guid",
        "person",
        "person_complaint_xref.active_ind = true"
      );

    this.searchQueryBuilder(
      queryBuilder,
      options
    );

    queryBuilder.andWhere(
      "ST_X(complaint_identifier.location_geometry_point) <> 0"
    );
    queryBuilder.andWhere(
      "ST_Y(complaint_identifier.location_geometry_point) <> 0"
    );
    return queryBuilder.getMany();
  }

  private searchQueryBuilder(
    queryBuilder: SelectQueryBuilder<AllegationComplaint>,
    options: AllegationSearchOptions
  ) {

    const {
      community,
      zone,
      region,
      officerAssigned,
      violationCode,
      incidentReportedStart,
      incidentReportedEnd,
      status,
    } = options;

    if (community !== null && community !== undefined && community !== "") {
      queryBuilder.andWhere("cos_geo_org_unit.area_code = :Community", {
        Community: community,
      });
    }
    if (zone !== null && zone !== undefined && zone !== "") {
      queryBuilder.andWhere("cos_geo_org_unit.zone_code = :Zone", {
        Zone: zone,
      });
    }
    if (region !== null && region !== undefined && region !== "") {
      queryBuilder.andWhere("cos_geo_org_unit.region_code = :Region", {
        Region: region,
      });
    }
    if (
      officerAssigned !== null &&
      officerAssigned !== undefined &&
      officerAssigned !== "" &&
      officerAssigned !== "null"
    ) {
      queryBuilder.andWhere(
        "person_complaint_xref.person_complaint_xref_code = :Assignee",
        { Assignee: "ASSIGNEE" }
      );
      queryBuilder.andWhere("person_complaint_xref.person_guid = :PersonGuid", {
        PersonGuid: officerAssigned,
      });
    } else if (officerAssigned === "null") {
      queryBuilder.andWhere("person_complaint_xref.person_guid IS NULL");
    }
    if (
      violationCode !== null &&
      violationCode !== undefined &&
      violationCode !== ""
    ) {
      queryBuilder.andWhere(
        "allegation_complaint.violation_code = :ViolationCode",
        { ViolationCode: violationCode }
      );
    }
    if (
      incidentReportedStart !== null &&
      incidentReportedStart !== undefined &&
      incidentReportedStart !== ""
    ) {
      queryBuilder.andWhere(
        "complaint_identifier.incident_reported_utc_timestmp >= :IncidentReportedStart",
        { IncidentReportedStart: incidentReportedStart }
      );
    }
    if (
      incidentReportedEnd !== null &&
      incidentReportedEnd !== undefined &&
      incidentReportedEnd !== ""
    ) {
      queryBuilder.andWhere(
        "complaint_identifier.incident_reported_utc_timestmp <= :IncidentReportedEnd",
        { IncidentReportedEnd: incidentReportedEnd }
      );
    }
    if (status !== null && status !== undefined && status !== "") {
      queryBuilder.andWhere(
        "complaint_identifier.complaint_status_code = :Status",
        { Status: status }
      );
    }
  }

  async findOne(id: any): Promise<AllegationComplaint> {
    return this.allegationComplaintsRepository
      .createQueryBuilder("allegation_complaint")
      .leftJoinAndSelect(
        "allegation_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoinAndSelect(
        "allegation_complaint.violation_code",
        "violation_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.complaint_status_code",
        "complaint_status_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.referred_by_agency_code",
        "referred_by_agency_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.owned_by_agency_code",
        "owned_by_agency_code"
      )
      .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
      .leftJoinAndSelect(
        "complaint_identifier.person_complaint_xref",
        "person_complaint_xref",
        "person_complaint_xref.active_ind = true"
      )
      .leftJoinAndSelect("complaint_identifier.timezone_code", "timezone_code")
      .leftJoinAndSelect(
        "person_complaint_xref.person_guid",
        "person",
        "person_complaint_xref.active_ind = true"
      )
      .where("allegation_complaint_guid = :id", { id })
      .getOne();
  }

  async update(
    allegation_complaint_guid: UUID,
    updateAllegationComplaint: string
  ): Promise<AllegationComplaint> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateAllegationComplaintDto: UpdateAllegationComplaintDto =
        JSON.parse(updateAllegationComplaint);

      const updateData = {
        allegation_complaint_guid:
          updateAllegationComplaintDto.allegation_complaint_guid,
        in_progress_ind: updateAllegationComplaintDto.in_progress_ind,
        observed_ind: updateAllegationComplaintDto.observed_ind,
        violation_code: updateAllegationComplaintDto.violation_code,
        suspect_witnesss_dtl_text:
          updateAllegationComplaintDto.suspect_witnesss_dtl_text,
      };
      await this.allegationComplaintsRepository.update(
        { allegation_complaint_guid },
        updateData
      );
      await this.complaintService.updateComplex(
        updateAllegationComplaintDto.complaint_identifier.complaint_identifier,
        JSON.stringify(updateAllegationComplaintDto.complaint_identifier)
      );
      //Note: this needs a refactor for when we have more types of persons being loaded in
      if (
        updateAllegationComplaintDto.complaint_identifier
          .person_complaint_xref[0] !== undefined
      ) {
        await this.personComplaintXrefService.assignOfficer(
          queryRunner,
          updateAllegationComplaintDto.complaint_identifier
            .complaint_identifier,
          updateAllegationComplaintDto.complaint_identifier
            .person_complaint_xref[0]
        );
      }
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return this.findOne(allegation_complaint_guid);
  }

  async remove(id: UUID): Promise<{ deleted: boolean; message?: string }> {
    try {
      let complaint_identifier = (
        await this.allegationComplaintsRepository.findOneOrFail({
          where: { allegation_complaint_guid: id },
          relations: {
            complaint_identifier: true,
          },
        })
      ).complaint_identifier.complaint_identifier;
      await this.allegationComplaintsRepository.delete(id);
      await this.complaintService.remove(complaint_identifier);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async findByComplaintIdentifier(id: any): Promise<AllegationComplaint> {
    return this.allegationComplaintsRepository
      .createQueryBuilder("allegation_complaint")
      .leftJoinAndSelect(
        "allegation_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoinAndSelect(
        "allegation_complaint.violation_code",
        "violation_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.complaint_status_code",
        "complaint_status_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.referred_by_agency_code",
        "referred_by_agency_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.owned_by_agency_code",
        "owned_by_agency_code"
      )
      .leftJoinAndSelect(
        "complaint_identifier.cos_geo_org_unit",
        "geo_organization_unit_code"
      )
      .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
      .leftJoinAndSelect(
        "complaint_identifier.person_complaint_xref",
        "person_complaint_xref",
        "person_complaint_xref.active_ind = true"
      )
      .leftJoinAndSelect("complaint_identifier.timezone_code", "timezone_code")
      .leftJoinAndSelect(
        "person_complaint_xref.person_guid",
        "person",
        "person_complaint_xref.active_ind = true"
      )
      .where("complaint_identifier.complaint_identifier = :id", { id })
      .getOne();
  }

  async getZoneAtAGlanceStatistics(zone: string): Promise<ZoneAtAGlanceStats> {
    let results: ZoneAtAGlanceStats = { total: 0, assigned: 0, unassigned: 0 };

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
        });

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
        });

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
            });

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
}
