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
import { getIdirFromRequest } from "../../common/get-user";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { REQUEST } from "@nestjs/core";
import { MapSearchResults } from "../../../src/types/complaints/map-search-results"

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

  findAll = async (
    sortColumn: string,
    sortOrder: string
  ): Promise<Array<AllegationComplaint>> => {
    const sortTable = this._getSortTable(sortColumn);
    const sortDirection = sortOrder === "DESC" ? "DESC" : "ASC";

    const sortString =
      sortColumn !== "update_utc_timestamp"
        ? `${sortTable}.${sortColumn}`
        : "GREATEST(complaint.update_utc_timestamp, allegation_complaint.update_utc_timestamp)";

    //-- build generic wildlife query
    let builder = this._getAllegationQuery();

    //-- order and sort
    builder
      .orderBy(sortString, sortDirection)
      .addOrderBy(
        "complaint.incident_reported_utc_timestmp",
        sortColumn === "incident_reported_utc_timestmp" ? sortDirection : "DESC"
      );

    return builder.getMany();
  };

  findOne = async (id: UUID): Promise<AllegationComplaint> => {
    //-- build generic wildlife query
    let builder = this._getAllegationQuery();
    builder.where("allegation_complaint_guid = :id", { id }).getOne();

    return builder.getOne();
  };

  search = async (model: SearchPayload): Promise<SearchResults> => {
    const { sortColumn, sortOrder, page, pageSize, query, ...filters } = model;

    const skip = page && pageSize ? (page - 1) * pageSize : 0;
    const sortTable = this._getSortTable(sortColumn);
    const sortDirection = sortOrder === "DESC" ? "DESC" : "ASC";

    const sortString =
      sortColumn !== "update_utc_timestamp"
        ? `${sortTable}.${sortColumn}`
        : "_update_utc_timestamp";

    //-- build generic query
    let builder = this._getAllegationQuery();

    //-- apply filters
    builder = this._applyAllegationQueryFilters(
      builder,
      filters as SearchPayload
    );

    if (query) {
      builder = this._applySearch(builder, query);
    }

    //-- only return complaints for the agency the user is associated with
    const agency = await this._getAgencyByUser();
    if (agency) {
      builder.andWhere("complaint.owned_by_agency_code.agency_code = :agency", {
        agency: agency.agency_code,
      });
    }

    //-- apply sorting
    builder
      .orderBy(sortString, sortDirection)
      .addOrderBy(
        "complaint.incident_reported_utc_timestmp",
        sortColumn === "incident_reported_utc_timestmp" ? sortDirection : "DESC"
      );

    const [data, totalCount] = await builder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return { complaints: [], totalCount: totalCount };
  };

  searchMap = async (model: SearchPayload): Promise<MapSearchResults> => {
    const { query } = model;

    //-- build generic wildlife query
    let complaintBuilder = this._getAllegationQuery();

    //-- apply search
    if (query) {
      complaintBuilder = this._applySearch(complaintBuilder, query);
    }

    //-- apply filters
    complaintBuilder = this._applyAllegationQueryFilters(
      complaintBuilder,
      model
    );

    //-- filter locations without coordinates
    complaintBuilder.andWhere("ST_X(complaint.location_geometry_point) <> 0");
    complaintBuilder.andWhere("ST_Y(complaint.location_geometry_point) <> 0");

    //-- only return complaints for the agency the user is associated with
    const agency = await this._getAgencyByUser();
    if (agency) {
      complaintBuilder.andWhere(
        "complaint.owned_by_agency_code.agency_code = :agency",
        { agency: agency.agency_code }
      );
    }

    const mappedComplaints = await complaintBuilder.getMany();

    //-- build generic wildlife query
    let unMappedBuilder = this._getAllegationQuery();

    //-- apply search
    if (query) {
      unMappedBuilder = this._applySearch(unMappedBuilder, query);
    }

    //-- apply filters
    unMappedBuilder = this._applyAllegationQueryFilters(unMappedBuilder, model);

    //-- filter locations without coordinates
    unMappedBuilder.andWhere("ST_X(complaint.location_geometry_point) = 0");
    unMappedBuilder.andWhere("ST_Y(complaint.location_geometry_point) = 0");

    if (agency) {
      unMappedBuilder.andWhere(
        "complaint.owned_by_agency_code.agency_code = :agency",
        { agency: agency.agency_code }
      );
    }

    const unmappedComplaints = await unMappedBuilder.getCount();

    return { complaints: mappedComplaints, unmappedComplaints };
  };

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
    //-- build generic wildlife query
    let builder = this._getAllegationQuery();
    builder.where("complaint.complaint_identifier = :id", { id });

    return builder.getOne();
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

  private _getSortTable = (column: string): string => {
    switch (column) {
      case "last_name":
        return "person";
      case "complaint_identifier":
      case "violation_code":
      case "in_progress_ind":
      default:
        return "complaint";
    }
  };

  private _getAllegationQuery = (): SelectQueryBuilder<AllegationComplaint> => {
    const builder = this.allegationComplaintsRepository
      .createQueryBuilder("allegation")
      .addSelect(
        "GREATEST(complaint.update_utc_timestamp, allegation.update_utc_timestamp)",
        "_update_utc_timestamp"
      )
      .leftJoinAndSelect("allegation.complaint_identifier", "complaint")

      .leftJoin("allegation.violation_code", "violation_code")
      .addSelect([
        "violation_code.violation_code",
        "violation_code.short_description",
        "violation_code.long_description",
      ])

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
        "people",
        "people.active_ind = true"
      )

      .leftJoinAndSelect(
        "people.person_guid",
        "person",
        "people.active_ind = true"
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

  private _applyAllegationQueryFilters(
    builder: SelectQueryBuilder<AllegationComplaint>,
    {
      community,
      zone,
      region,
      officerAssigned,
      violationCode,
      incidentReportedStart,
      incidentReportedEnd,
      status,
    }: SearchPayload
  ): SelectQueryBuilder<AllegationComplaint> {
    if (community) {
      builder.andWhere("cos_organization.area_code = :Community", {
        Community: community,
      });
    }

    if (zone) {
      builder.andWhere("cos_organization.zone_code = :Zone", {
        Zone: zone,
      });
    }

    if (region) {
      builder.andWhere("cos_organization.region_code = :Region", {
        Region: region,
      });
    }

    if (officerAssigned) {
      if (officerAssigned === "Unassigned") {
        //Special case for unassigned
        builder.andWhere("people.person_complaint_xref_guid IS NULL");
      } else {
        builder.andWhere("people.person_complaint_xref_code = :Assignee", {
          Assignee: "ASSIGNEE",
        });
        builder.andWhere("people.person_guid = :PersonGuid", {
          PersonGuid: officerAssigned,
        });
      }
    }

    if (violationCode) {
      builder.andWhere("allegation.violation_code = :ViolationCode", {
        ViolationCode: violationCode,
      });
    }

    if (incidentReportedStart !== null && incidentReportedStart !== undefined) {
      builder.andWhere(
        "complaint.incident_reported_utc_timestmp >= :IncidentReportedStart",
        { IncidentReportedStart: incidentReportedStart }
      );
    }
    if (incidentReportedEnd !== null && incidentReportedEnd !== undefined) {
      builder.andWhere(
        "complaint.incident_reported_utc_timestmp <= :IncidentReportedEnd",
        { IncidentReportedEnd: incidentReportedEnd }
      );
    }

    if (status) {
      builder.andWhere("complaint.complaint_status_code = :Status", {
        Status: status,
      });
    }

    return builder;
  }

  private _applySearch(
    builder: SelectQueryBuilder<AllegationComplaint>,
    query: string
  ): SelectQueryBuilder<AllegationComplaint> {
    builder.andWhere(
      new Brackets((qb) => {
        qb.orWhere("complaint.complaint_identifier ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.detail_text ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.caller_name ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.caller_address ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.caller_email ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.caller_phone_1 ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.caller_phone_2 ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.caller_phone_3 ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.location_summary_text ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.location_detailed_text ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.referred_by_agency_other_text ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("referred_by.short_description ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("referred_by.long_description ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("owned_by.short_description ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("owned_by.long_description ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("cos_organization.region_name ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("cos_organization.area_name ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("cos_organization.zone_name ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("cos_organization.offloc_name ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("allegation.suspect_witnesss_dtl_text ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("violation_code.short_description ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("violation_code.long_description ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("person.first_name ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("person.last_name ILIKE :query", {
          query: `%${query}%`,
        });
      })
    );

    return builder;
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
