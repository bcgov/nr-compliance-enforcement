import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
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
} from "src/types/zone_at_a_glance/zone_at_a_glance_stats";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { SearchResults } from "../complaint/models/search-results";
import { SearchPayload } from "../complaint/models/search-payload";
import { MapReturn } from "src/types/complaints/map-return-type";

@Injectable()
export class HwcrComplaintService {
  private readonly logger = new Logger(HwcrComplaintService.name);

  constructor(private dataSource: DataSource) {}
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

    const createHwcrComplaintDto: CreateHwcrComplaintDto =
      JSON.parse(hwcrComplaint);
    createHwcrComplaintDto.hwcr_complaint_guid = randomUUID();
    createHwcrComplaintDto.update_utc_timestamp =
      createHwcrComplaintDto.create_utc_timestamp = new Date();
    let newHwcrComplaintString;
    try {
      const complaint: Complaint = await this.complaintService.create(
        JSON.stringify(createHwcrComplaintDto.complaint_identifier),
        queryRunner
      );
      createHwcrComplaintDto.create_user_id =
        createHwcrComplaintDto.update_user_id = complaint.create_user_id;
      createHwcrComplaintDto.complaint_identifier.complaint_identifier =
        complaint.complaint_identifier;
      newHwcrComplaintString = await this.hwcrComplaintsRepository.create(
        createHwcrComplaintDto
      );
      let newHwcrComplaint: HwcrComplaint;
      newHwcrComplaint = <HwcrComplaint>(
        await queryRunner.manager.save(newHwcrComplaintString)
      );

      if (
        createHwcrComplaintDto.complaint_identifier.person_complaint_xref[0] !==
        undefined
      ) {
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
          blankHwcrComplaint.hwcr_complaint_guid =
            newHwcrComplaint.hwcr_complaint_guid;
          newHwcrComplaint.attractant_hwcr_xref[i].hwcr_complaint_guid =
            blankHwcrComplaint;
          await this.attractantHwcrXrefService.create(
            queryRunner,
            newHwcrComplaint.attractant_hwcr_xref[i]
          );
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

  search = async (model: SearchPayload): Promise<SearchResults> => {
    const { sortColumn, sortOrder, page, pageSize, query, ...filters } = model;

    const skip = page && pageSize ? (page - 1) * pageSize : 0;
    const sortTable = this._getSortTable(sortColumn);
    const sortDirection = sortOrder === "DESC" ? "DESC" : "ASC";

    const sortString =
      sortColumn !== "update_utc_timestamp"
        ? `${sortTable}.${sortColumn}`
        : "_update_utc_timestamp";

    //-- build generic wildlife query
    let builder = this._getWildlifeQuery();

    //-- apply filters
    builder = this._applyWildlifeQueryFilters(
      builder,
      filters as SearchPayload
    );

    if (query) {
      builder = this._applySearch(builder, query);
    }

    //-- apply sort
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

    return { complaints: data, totalCount: totalCount };
  };

  searchMap = async (model: SearchPayload): Promise<MapReturn> => {
    const { query } = model;

    //-- build generic wildlife query
    let builder = this._getWildlifeQuery();

    //-- apply search
    if (query) {
      builder = this._applySearch(builder, query);
    }

    //-- apply filters
    builder = this._applyWildlifeQueryFilters(builder, model as SearchPayload);

    //-- filter locations without coordinates
    builder.andWhere("ST_X(complaint.location_geometry_point) <> 0");
    builder.andWhere("ST_Y(complaint.location_geometry_point) <> 0");


    let mapReturn: MapReturn = {complaints: [], unmappedComplaints: 0};

    mapReturn.complaints = await builder.getMany();

    //-- build generic wildlife query
    let builder2 = this._getWildlifeQuery();

    //-- apply search
    if (query) {
      builder2 = this._applySearch(builder2, query);
    }

    //-- apply filters
    builder2 = this._applyWildlifeQueryFilters(builder2, model as SearchPayload);

    //-- filter locations without coordinates
    builder2.andWhere("ST_X(complaint.location_geometry_point) = 0");
    builder2.andWhere("ST_Y(complaint.location_geometry_point) = 0");
    mapReturn.unmappedComplaints = await builder2.getCount();

    return mapReturn;
  };

  findAll = async (
    sortColumn: string,
    sortOrder: string
  ): Promise<Array<HwcrComplaint>> => {
    const sortTable = this._getSortTable(sortColumn);
    const sortDirection = sortOrder === "DESC" ? "DESC" : "ASC";

    const sortString =
      sortColumn !== "update_utc_timestamp"
        ? `${sortTable}.${sortColumn}`
        : "GREATEST(complaint.update_utc_timestamp, hwcr_complaint.update_utc_timestamp)";

    //-- build generic wildlife query
    let builder = this._getWildlifeQuery();

    //-- order and sort
    builder
      .orderBy(sortString, sortDirection)
      .addOrderBy(
        "complaint.incident_reported_utc_timestmp",
        sortColumn === "incident_reported_utc_timestmp" ? sortDirection : "DESC"
      );

    return builder.getMany();
  };

  findOne = async (id: UUID): Promise<HwcrComplaint> => {
    //-- build generic wildlife query
    let builder = this._getWildlifeQuery();
    builder.where("wildlife.hwcr_complaint_guid = :id", { id });

    return builder.getOne();
  };

  async findByComplaintIdentifier(id: string): Promise<HwcrComplaint> {
    //-- build generic wildlife query
    let builder = this._getWildlifeQuery();
    builder.where("complaint.complaint_identifier = :id", { id });

    return builder.getOne();
  }

  async update(
    hwcr_complaint_guid: UUID,
    updateHwcrComplaint: string
  ): Promise<HwcrComplaint> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateHwcrComplaintDto: UpdateHwcrComplaintDto =
        JSON.parse(updateHwcrComplaint);
      const updateData = {
        hwcr_complaint_nature_code:
          updateHwcrComplaintDto.hwcr_complaint_nature_code,
        species_code: updateHwcrComplaintDto.species_code,
      };
      const updatedValue = await this.hwcrComplaintsRepository.update(
        { hwcr_complaint_guid },
        updateData
      );
      await this.complaintService.updateComplex(
        updateHwcrComplaintDto.complaint_identifier.complaint_identifier,
        JSON.stringify(updateHwcrComplaintDto.complaint_identifier)
      );
      //Note: this needs a refactor for when we have more types of persons being loaded in

      if (
        updateHwcrComplaintDto.complaint_identifier.person_complaint_xref[0] !==
        undefined
      ) {
        await this.personComplaintXrefService.assignOfficer(
          queryRunner,
          updateHwcrComplaintDto.complaint_identifier.complaint_identifier,
          updateHwcrComplaintDto.complaint_identifier.person_complaint_xref[0]
        );
      }
      await this.attractantHwcrXrefService.updateComplaintAttractants(
        queryRunner,
        updateHwcrComplaintDto as HwcrComplaint,
        updateHwcrComplaintDto.attractant_hwcr_xref
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return this.findOne(hwcr_complaint_guid);
  }

  async remove(id: UUID): Promise<{ deleted: boolean; message?: string }> {
    try {
      let complaint_identifier = (
        await this.hwcrComplaintsRepository.findOneOrFail({
          where: { hwcr_complaint_guid: id },
          relations: {
            complaint_identifier: true,
          },
        })
      ).complaint_identifier.complaint_identifier;
      await this.hwcrComplaintsRepository.delete(id);
      await this.complaintService.remove(complaint_identifier);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async getZoneAtAGlanceStatistics(zone: string): Promise<ZoneAtAGlanceStats> {
    let results: ZoneAtAGlanceStats = {
      total: 0,
      assigned: 0,
      unassigned: 0,
      offices: [],
    };

    //-- get total complaints for the zone
    let totalComplaints = await this.hwcrComplaintsRepository
      .createQueryBuilder("hwcr_complaint")
      .leftJoinAndSelect(
        "hwcr_complaint.complaint_identifier",
        "complaint_identifier"
      )
      .leftJoinAndSelect("complaint_identifier.cos_geo_org_unit", "area_code")
      .where("area_code.zone_code = :zone", { zone })
      .andWhere("complaint_identifier.complaint_status_code = :status", {
        status: "OPEN",
      })
      .getCount();

    const totalAssignedComplaints = await this.hwcrComplaintsRepository
      .createQueryBuilder("hwcr_complaint")
      .leftJoinAndSelect(
        "hwcr_complaint.complaint_identifier",
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

      const assignedComplaintsQuery = await this.hwcrComplaintsRepository
        .createQueryBuilder("assigned_hwcr_complaint")
        .leftJoinAndSelect(
          "assigned_hwcr_complaint.complaint_identifier",
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

      const totalComplaintsQuery = await this.hwcrComplaintsRepository
        .createQueryBuilder("total_hwcr_complaint")
        .leftJoinAndSelect(
          "total_hwcr_complaint.complaint_identifier",
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
          await this.hwcrComplaintsRepository
            .createQueryBuilder("assigned_hwcr_complaint")
            .leftJoinAndSelect(
              "assigned_hwcr_complaint.complaint_identifier",
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

        officers[j].hwcrAssigned =
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
      case "complaint": //-- complaint_identifier
      case "species_code":
      case "hwcr_complaint_nature_code":
        return "wildlife";
      case "last_name":
        return "person";
      default:
        return "complaint"; //-- complaint_identifier
    }
  };

  private _getWildlifeQuery = (): SelectQueryBuilder<HwcrComplaint> => {
    const builder = this.hwcrComplaintsRepository
      .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
      .addSelect(
        "GREATEST(complaint.update_utc_timestamp,  wildlife.update_utc_timestamp)",
        "_update_utc_timestamp"
      )
      .leftJoinAndSelect("wildlife.complaint_identifier", "complaint")

      .leftJoin("wildlife.species_code", "species_code")
      .addSelect([
        "species_code.species_code",
        "species_code.short_description",
        "species_code.long_description",
      ])

      .leftJoin("wildlife.hwcr_complaint_nature_code", "complaint_nature_code")
      .addSelect([
        "complaint_nature_code.hwcr_complaint_nature_code",
        "complaint_nature_code.short_description",
        "complaint_nature_code.long_description",
      ])

      .leftJoin(
        "wildlife.attractant_hwcr_xref",
        "attractants",
        "attractants.active_ind = true"
      )
      .addSelect([
        "attractants.attractant_hwcr_xref_guid",
        "attractants.attractant_code",
      ])

      .leftJoin("attractants.attractant_code", "attractant_code")
      .addSelect([
        "attractant_code.attractant_code",
        "attractant_code.short_description",
        "attractant_code.long_description",
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

  private _applyWildlifeQueryFilters = (
    builder: SelectQueryBuilder<HwcrComplaint>,
    {
      community,
      zone,
      region,
      officerAssigned,
      natureOfComplaint,
      speciesCode,
      incidentReportedStart,
      incidentReportedEnd,
      status,
    }: SearchPayload
  ): SelectQueryBuilder<HwcrComplaint> => {
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
      if (officerAssigned === "Unassigned")
      {
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
    
    if (natureOfComplaint) {
      builder.andWhere(
        "wildlife.hwcr_complaint_nature_code = :NatureOfComplaint",
        { NatureOfComplaint: natureOfComplaint }
      );
    }

    if (speciesCode) {
      builder.andWhere("wildlife.species_code = :SpeciesCode", {
        SpeciesCode: speciesCode,
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
  };

  private _applySearch = (
    builder: SelectQueryBuilder<HwcrComplaint>,
    query: string
  ): SelectQueryBuilder<HwcrComplaint> => {
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

        qb.orWhere("wildlife.other_attractants_text ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("species_code.short_description ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("species_code.long_description ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("wildlife.hwcr_complaint_nature_code ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("attractant_code.short_description ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("attractant_code.long_description ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("person.first_name ILIKE :query", { query: `%${query}%` });
        qb.orWhere("person.last_name ILIKE :query", { query: `%${query}%` });
      })
    );

    return builder;
  };
}
