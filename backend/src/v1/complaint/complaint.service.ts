import { map } from "lodash";
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { caseFileQueryFields, get } from "../../external_api/case_management";

import {
  applyAllegationComplaintMap,
  applyGeneralInfomationComplaintMap,
  applyWildlifeComplaintMap,
  complaintToComplaintDtoMap,
  mapAllegationReport,
  mapWildlifeReport,
} from "../../middleware/maps/automapper-entity-to-dto-maps";

import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { WildlifeComplaintDto } from "../../types/models/complaints/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/allegation-complaint";
///
import { Complaint } from "./entities/complaint.entity";
import { UpdateComplaintDto } from "../../types/models/complaints/update-complaint.dto";

import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";

import { ComplaintDto } from "../../types/models/complaints/complaint";
import { CodeTableService } from "../code-table/code-table.service";
import { ComplaintUpdatesService } from "../complaint_updates/complaint_updates.service";
import {
  mapAllegationComplaintDtoToAllegationComplaint,
  mapAttractantXrefDtoToAttractantHwcrXref,
  mapComplaintDtoToComplaint,
  mapWildlifeComplaintDtoToHwcrComplaint,
  mapGirComplaintDtoToGirComplaint,
} from "../../middleware/maps/automapper-dto-to-entity-maps";

import { ComplaintSearchParameters } from "../../types/models/complaints/complaint-search-parameters";
import { SearchResults } from "../../types/models/complaints/search-results";
import { ComplaintFilterParameters } from "../../types/models/complaints/complaint-filter-parameters";
import { REQUEST } from "@nestjs/core";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { MapSearchResults } from "../../types/models/complaints/map-search-results";
import {
  mapComplaintDtoToComplaintTable,
  mapDelegateDtoToPersonComplaintXrefTable,
} from "../../middleware/maps/dto-to-table-map";
import { DelegateDto } from "../../types/models/people/delegate";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { PersonComplaintXrefTable } from "../../types/tables/person-complaint-xref.table";
import { OfficeStats, OfficerStats, ZoneAtAGlanceStats } from "../../types/zone_at_a_glance/zone_at_a_glance_stats";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { UUID, randomUUID } from "crypto";

import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { toDate, toZonedTime, format } from "date-fns-tz";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/gir-complaint";
import { ComplaintUpdateDto } from "src/types/models/complaint-updates/complaint-update-dto";
import { WildlifeReportData } from "src/types/models/reports/complaints/wildlife-report-data";
import { AllegationReportData } from "src/types/models/reports/complaints/allegation-report-data";
import { RelatedDataDto } from "src/types/models/complaints/related-data";
import { CompMthdRecvCdAgcyCdXrefService } from "../comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.service";
import { OfficerService } from "../officer/officer.service";

type complaintAlias = HwcrComplaint | AllegationComplaint | GirComplaint;
@Injectable({ scope: Scope.REQUEST })
export class ComplaintService {
  private readonly logger = new Logger(ComplaintService.name);
  private mapper: Mapper;

  @InjectRepository(Complaint)
  private complaintsRepository: Repository<Complaint>;
  @InjectRepository(HwcrComplaint)
  private _wildlifeComplaintRepository: Repository<HwcrComplaint>;
  @InjectRepository(AllegationComplaint)
  private _allegationComplaintRepository: Repository<AllegationComplaint>;
  @InjectRepository(GirComplaint)
  private _girComplaintRepository: Repository<GirComplaint>;
  @InjectRepository(ComplaintUpdate)
  private _complaintUpdateRepository: Repository<ComplaintUpdate>;
  @InjectRepository(Officer)
  private _officertRepository: Repository<Officer>;
  @InjectRepository(Office)
  private _officeRepository: Repository<Office>;
  @InjectRepository(CosGeoOrgUnit)
  private _cosOrganizationUnitRepository: Repository<CosGeoOrgUnit>;

  constructor(
    @Inject(REQUEST)
    private request: Request,
    @InjectMapper() mapper,
    private readonly _codeTableService: CodeTableService,
    private readonly _compliantUpdatesService: ComplaintUpdatesService,
    private readonly _personService: PersonComplaintXrefService,
    private readonly _attractantService: AttractantHwcrXrefService,
    private readonly _compMthdRecvCdAgcyCdXrefService: CompMthdRecvCdAgcyCdXrefService,
    private readonly _officerService: OfficerService,
    private dataSource: DataSource,
  ) {
    this.mapper = mapper;

    //-- ENTITY -> DTO
    complaintToComplaintDtoMap(mapper);
    applyWildlifeComplaintMap(mapper);
    applyAllegationComplaintMap(mapper);
    applyGeneralInfomationComplaintMap(mapper);

    //-- DTO -> ENTITY
    mapComplaintDtoToComplaint(mapper);
    mapWildlifeComplaintDtoToHwcrComplaint(mapper);
    mapGirComplaintDtoToGirComplaint(mapper);
    mapAllegationComplaintDtoToAllegationComplaint(mapper);
    mapComplaintDtoToComplaintTable(mapper);
    mapDelegateDtoToPersonComplaintXrefTable(mapper);
    mapAttractantXrefDtoToAttractantHwcrXref(mapper);
  }

  private _getAgencyByUser = async (): Promise<AgencyCode> => {
    const idir = getIdirFromRequest(this.request);

    const builder = this._officertRepository
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

  private _getSortTable = (column: string): string => {
    switch (column) {
      case "species_code":
      case "hwcr_complaint_nature_code":
        return "wildlife";
      case "last_name":
        return "person";
      case "gir_type_code":
        return "general";
      case "violation_code":
      case "in_progress_ind":
        return "allegation";
      case "area_name":
        return "cos_organization";
      case "complaint_identifier":
      default:
        return "complaint";
    }
  };

  private _generateQueryBuilder = (
    type: COMPLAINT_TYPE,
  ): SelectQueryBuilder<HwcrComplaint | AllegationComplaint | GirComplaint> => {
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint | GirComplaint>;
    switch (type) {
      case "ERS":
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .addSelect(
            "GREATEST(complaint.update_utc_timestamp, allegation.update_utc_timestamp, COALESCE((SELECT MAX(update.update_utc_timestamp) FROM complaint_update update WHERE update.complaint_identifier = complaint.complaint_identifier), '1970-01-01'))",
            "_update_utc_timestamp",
          )
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint")
          .leftJoin("allegation.violation_code", "violation_code")
          .addSelect([
            "violation_code.violation_code",
            "violation_code.short_description",
            "violation_code.long_description",
            "violation_code.agency_code",
          ]);
        break;
      case "GIR":
        builder = this._girComplaintRepository
          .createQueryBuilder("general")
          .addSelect(
            "GREATEST(complaint.update_utc_timestamp, general.update_utc_timestamp, COALESCE((SELECT MAX(update.update_utc_timestamp) FROM complaint_update update WHERE update.complaint_identifier = complaint.complaint_identifier), '1970-01-01'))",
            "_update_utc_timestamp",
          )
          .leftJoinAndSelect("general.complaint_identifier", "complaint")
          .leftJoin("general.gir_type_code", "gir")
          .addSelect(["gir.gir_type_code", "gir.short_description", "gir.long_description"]);
        break;
      case "HWCR":
      default:
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
          .addSelect(
            "GREATEST(complaint.update_utc_timestamp, wildlife.update_utc_timestamp, COALESCE((SELECT MAX(update.update_utc_timestamp) FROM complaint_update update WHERE update.complaint_identifier = complaint.complaint_identifier), '1970-01-01'))",
            "_update_utc_timestamp",
          )
          .leftJoinAndSelect("wildlife.complaint_identifier", "complaint")
          .leftJoin("wildlife.species_code", "species_code")
          .addSelect(["species_code.species_code", "species_code.short_description", "species_code.long_description"])

          .leftJoin("wildlife.hwcr_complaint_nature_code", "complaint_nature_code")
          .addSelect([
            "complaint_nature_code.hwcr_complaint_nature_code",
            "complaint_nature_code.short_description",
            "complaint_nature_code.long_description",
          ])

          .leftJoin("wildlife.attractant_hwcr_xref", "attractants", "attractants.active_ind = true")
          .addSelect(["attractants.attractant_hwcr_xref_guid", "attractants.attractant_code", "attractants.active_ind"])

          .leftJoin("attractants.attractant_code", "attractant_code")
          .addSelect([
            "attractant_code.attractant_code",
            "attractant_code.short_description",
            "attractant_code.long_description",
          ]);
        break;
    }

    builder
      .leftJoin("complaint.complaint_status_code", "complaint_status")
      .addSelect([
        "complaint_status.complaint_status_code",
        "complaint_status.short_description",
        "complaint_status.long_description",
      ])
      .leftJoin("complaint.reported_by_code", "reported_by")
      .addSelect(["reported_by.reported_by_code", "reported_by.short_description", "reported_by.long_description"])
      .leftJoin("complaint.owned_by_agency_code", "owned_by")
      .addSelect(["owned_by.agency_code", "owned_by.short_description", "owned_by.long_description"])
      .leftJoinAndSelect("complaint.cos_geo_org_unit", "cos_organization")
      .leftJoinAndSelect("complaint.person_complaint_xref", "delegate", "delegate.active_ind = true")
      .leftJoinAndSelect("delegate.person_complaint_xref_code", "delegate_code")
      .leftJoinAndSelect("delegate.person_guid", "person", "delegate.active_ind = true")
      .leftJoinAndSelect("complaint.comp_mthd_recv_cd_agcy_cd_xref", "method_xref")
      .leftJoinAndSelect("method_xref.complaint_method_received_code", "method_code")
      .leftJoinAndSelect("method_xref.agency_code", "method_agency");

    return builder;
  };

  private _applyFilters(
    builder: SelectQueryBuilder<complaintAlias>,
    {
      community,
      zone,
      region,
      incidentReportedStart,
      incidentReportedEnd,
      status,
      officerAssigned,
      natureOfComplaint,
      speciesCode,
      violationCode,
      girTypeCode,
      complaintMethod,
    }: ComplaintFilterParameters,
    complaintType: COMPLAINT_TYPE,
  ): SelectQueryBuilder<complaintAlias> {
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

    if (incidentReportedStart !== null && incidentReportedStart !== undefined) {
      builder.andWhere("complaint.incident_reported_utc_timestmp >= :IncidentReportedStart", {
        IncidentReportedStart: incidentReportedStart,
      });
    }
    if (incidentReportedEnd !== null && incidentReportedEnd !== undefined) {
      builder.andWhere("complaint.incident_reported_utc_timestmp <= :IncidentReportedEnd", {
        IncidentReportedEnd: incidentReportedEnd,
      });
    }

    if (status) {
      builder.andWhere("complaint.complaint_status_code = :Status", {
        Status: status,
      });
    }

    if (officerAssigned && officerAssigned === "Unassigned") {
      builder.andWhere("delegate.person_complaint_xref_guid IS NULL");
    } else if (officerAssigned) {
      builder
        .andWhere("delegate.person_complaint_xref_code = :Assignee", {
          Assignee: "ASSIGNEE",
        })
        .andWhere("delegate.person_guid = :PersonGuid", {
          PersonGuid: officerAssigned,
        });
    }

    switch (complaintType) {
      case "ERS": {
        if (violationCode) {
          builder.andWhere("allegation.violation_code = :ViolationCode", {
            ViolationCode: violationCode,
          });
        }
        if (complaintMethod) {
          builder.andWhere("method_xref.complaint_method_received_code = :ComplaintMethod", {
            ComplaintMethod: complaintMethod,
          });
        }
        break;
      }
      case "GIR": {
        if (girTypeCode) {
          builder.andWhere("general.gir_type_code = :GirTypeCode", {
            GirTypeCode: girTypeCode,
          });
        }
        break;
      }
      case "HWCR":
      default: {
        if (natureOfComplaint) {
          builder.andWhere("wildlife.hwcr_complaint_nature_code = :NatureOfComplaint", {
            NatureOfComplaint: natureOfComplaint,
          });
        }

        if (speciesCode) {
          builder.andWhere("wildlife.species_code = :SpeciesCode", {
            SpeciesCode: speciesCode,
          });
        }
        break;
      }
    }

    return builder;
  }

  private _applySearch(
    builder: SelectQueryBuilder<complaintAlias>,
    complaintType: COMPLAINT_TYPE,
    query: string,
  ): SelectQueryBuilder<complaintAlias> {
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
        qb.orWhere("complaint.reported_by_other_text ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("complaint.reference_number ILIKE :query", {
          query: `%${query}%`,
        });

        qb.orWhere("reported_by.short_description ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("reported_by.long_description ILIKE :query", {
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

        switch (complaintType) {
          case "ERS": {
            qb.orWhere("allegation.suspect_witnesss_dtl_text ILIKE :query", {
              query: `%${query}%`,
            });

            qb.orWhere("violation_code.short_description ILIKE :query", {
              query: `%${query}%`,
            });
            qb.orWhere("violation_code.long_description ILIKE :query", {
              query: `%${query}%`,
            });
            break;
          }
          case "GIR": {
            qb.orWhere("general.gir_type_code ILIKE :query", {
              query: `%${query}%`,
            });
            break;
          }
          case "HWCR":
          default: {
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
            break;
          }
        }

        qb.orWhere("person.first_name ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("person.last_name ILIKE :query", {
          query: `%${query}%`,
        });
      }),
    );

    return builder;
  }

  private _getTotalComplaintsByZone = async (complaintType: COMPLAINT_TYPE, zone: string): Promise<number> => {
    const agency = await this._getAgencyByUser();
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>;

    switch (complaintType) {
      case "ERS": {
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint");
        break;
      }
      case "HWCR":
      default: {
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
          .leftJoinAndSelect("wildlife.complaint_identifier", "complaint");
        break;
      }
    }

    builder
      .leftJoinAndSelect("complaint.cos_geo_org_unit", "area_code")
      .where("area_code.zone_code = :zone", { zone })
      .andWhere("complaint.complaint_status_code = :status", {
        status: "OPEN",
      })
      .andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

    const result = await builder.getCount();

    return result;
  };

  private _getTotalComplaintsByOffice = async (complaintType: COMPLAINT_TYPE, office: string): Promise<number> => {
    const agency = await this._getAgencyByUser();
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>;

    switch (complaintType) {
      case "ERS": {
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint");
        break;
      }
      case "HWCR":
      default: {
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
          .leftJoinAndSelect("wildlife.complaint_identifier", "complaint");
        break;
      }
    }

    builder
      .leftJoinAndSelect("complaint.cos_geo_org_unit", "area_code")
      .where("area_code.offloc_code = :office", { office })
      .andWhere("complaint.complaint_status_code = :status", {
        status: "OPEN",
      })
      .andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

    return await builder.getCount();
  };

  private _getTotalAssignedComplaintsByZone = async (complaintType: COMPLAINT_TYPE, zone: string): Promise<number> => {
    const agency = await this._getAgencyByUser();
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>;

    switch (complaintType) {
      case "ERS": {
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint");
        break;
      }
      case "HWCR":
      default: {
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
          .leftJoinAndSelect("wildlife.complaint_identifier", "complaint");
        break;
      }
    }

    builder
      .leftJoinAndSelect("complaint.cos_geo_org_unit", "area_code")
      .innerJoinAndSelect(
        "complaint.person_complaint_xref",
        "person_complaint_xref",
        "person_complaint_xref.active_ind = true",
      )
      .where("area_code.zone_code = :zone", { zone })
      .andWhere("complaint.complaint_status_code = :status", {
        status: "OPEN",
      })
      .andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

    const result = await builder.getCount();

    return result;
  };

  private _getTotalAssignedComplaintsByOffice = async (
    complaintType: COMPLAINT_TYPE,
    office: string,
  ): Promise<number> => {
    const agency = await this._getAgencyByUser();
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>;

    switch (complaintType) {
      case "ERS": {
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint");
        break;
      }
      case "HWCR":
      default: {
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife")
          .leftJoinAndSelect("wildlife.complaint_identifier", "complaint");
        break;
      }
    }

    builder
      .leftJoinAndSelect("complaint.cos_geo_org_unit", "area_code")
      .innerJoinAndSelect("complaint.person_complaint_xref", "person")
      .where("area_code.offloc_code = :office", { office })
      .andWhere("complaint.complaint_status_code = :status", {
        status: "OPEN",
      })
      .andWhere("person.active_ind = true")
      .andWhere("person.person_complaint_xref_code = :assignee", { assignee: "ASSIGNEE" })
      .andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

    const result = await builder.getCount();

    return result;
  };

  private _getOfficeIdByOrganizationUnitCode = async (code: string): Promise<UUID> => {
    try {
      const agency = await this._getAgencyByUser();
      const officeGuidQuery = await this._officeRepository
        .createQueryBuilder("office")
        .where("office.geo_organization_unit_code = :code", { code })
        .andWhere("office.agency_code = :agency", { agency: agency.agency_code });

      const office = await officeGuidQuery.getOne();

      if (office) {
        return office.office_guid;
      }
    } catch (error) {}
  };

  private _getOfficersByOffice = async (complaintType: COMPLAINT_TYPE, officeGuid: string): Promise<OfficerStats[]> => {
    let results: Array<OfficerStats> = [];

    try {
      const query = await this._officertRepository
        .createQueryBuilder("officers")
        .leftJoinAndSelect("officers.person_guid", "person")
        .where("officers.office_guid = :officeGuid", { officeGuid });

      const officers = await query.getMany();

      for (const officer of officers) {
        const { person_guid: person, officer_guid: officerId } = officer;
        const { first_name, last_name } = person;

        const assigned = await this._getTotalAssignedComplaintsByOfficer(complaintType, officerId);

        let record = {
          name: `${last_name}, ${first_name}`,
          hwcrAssigned: complaintType === "HWCR" ? assigned : 0,
          allegationAssigned: complaintType === "ERS" ? assigned : 0,
          officerGuid: officerId,
        };

        results = [...results, record];
      }

      return results;
    } catch (error) {}
  };

  private _getTotalAssignedComplaintsByOfficer = async (complaintType: string, officerId: string): Promise<number> => {
    const agency = await this._getAgencyByUser();
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>;

    try {
      switch (complaintType) {
        case "ERS": {
          builder = this._allegationComplaintRepository
            .createQueryBuilder("allegation")
            .leftJoinAndSelect("allegation.complaint_identifier", "complaint");
          break;
        }
        case "HWCR":
        default: {
          builder = this._wildlifeComplaintRepository
            .createQueryBuilder("wildlife")
            .leftJoinAndSelect("wildlife.complaint_identifier", "complaint");
          break;
        }
      }

      builder
        .leftJoinAndSelect("complaint.cos_geo_org_unit", "area_code")
        .leftJoinAndSelect("complaint.person_complaint_xref", "person_complaint_xref")
        .leftJoinAndSelect("person_complaint_xref.person_guid", "person")
        .leftJoinAndSelect("person.officer", "officer")
        .where("person_complaint_xref.active_ind = true")
        .andWhere("person_complaint_xref.person_complaint_xref_code = :assignee", { assignee: "ASSIGNEE" })
        .andWhere("officer.officer_guid = :officerId", { officerId })
        .andWhere("complaint.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });

      return builder.getCount();
    } catch (error) {
      this.logger.error(error);
    }
  };

  private _getComplaintsByOffice = async (complaintType: COMPLAINT_TYPE, zone: string): Promise<OfficeStats[]> => {
    let results: OfficeStats[] = [];

    const officeQuery = await this._cosOrganizationUnitRepository
      .createQueryBuilder("cos_geo_org_unit")
      .where("cos_geo_org_unit.zone_code = :zone", { zone })
      .distinctOn(["cos_geo_org_unit.offloc_code"])
      .orderBy("cos_geo_org_unit.offloc_code");

    const offices = await officeQuery.getMany();

    for (const office of offices) {
      const { office_location_code: code, office_location_name: name } = office;

      const total = await this._getTotalComplaintsByOffice(complaintType, code);
      const assigned = await this._getTotalAssignedComplaintsByOffice(complaintType, code);
      const unassigned = total - assigned;

      const officeGuid = await this._getOfficeIdByOrganizationUnitCode(code);
      const officers = await this._getOfficersByOffice(complaintType, officeGuid);

      const record: OfficeStats = {
        name,
        assigned,
        unassigned,
        officeGuid,
        officers,
      };

      results = [...results, record];
    }

    return Promise.resolve(results);
  };

  private _getComplaintsByActionTaken = async (token: string, actionTaken: string): Promise<string[]> => {
    const { data, errors } = await get(token, {
      query: `{getLeadsByActionTaken (actionCode: "${actionTaken}")}`,
    });
    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }
    /**
     * If no leads in the case manangement database have had the selected action taken, `getLeadsByActionTaken`
     * returns an empty array, and WHERE...IN () does not accept an empty set, it throws an error. In our use
     * case, if `getLeadsByActionTaken` returns an empty array, we do not want the entire search to error, it
     * should simply return an empty result set. To handle this, if `getLeadsByActionTaken` returns an empty
     * array, we populate the array with a value that would never match on a complaint_identifier: -1.
     */
    const complaintIdentifiers = data.getLeadsByActionTaken.length > 0 ? data.getLeadsByActionTaken : ["-1"];
    return complaintIdentifiers;
  };

  findAllByType = async (
    complaintType: COMPLAINT_TYPE,
  ): Promise<Array<WildlifeComplaintDto> | Array<AllegationComplaintDto>> => {
    const builder = this._generateQueryBuilder(complaintType);
    const results = await builder.getMany();

    try {
      switch (complaintType) {
        case "ERS":
          return this.mapper.mapArray<AllegationComplaint, AllegationComplaintDto>(
            results as Array<AllegationComplaint>,
            "AllegationComplaint",
            "AllegationComplaintDto",
          );
        case "HWCR":
        default:
          return this.mapper.mapArray<HwcrComplaint, WildlifeComplaintDto>(
            results as Array<HwcrComplaint>,
            "HwcrComplaint",
            "WildlifeComplaintDto",
          );
      }
    } catch (error) {
      this.logger.error(error);

      throw new NotFoundException();
    }
  };

  findById = async (
    id: string,
    complaintType?: COMPLAINT_TYPE,
  ): Promise<ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto> => {
    let builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>;

    try {
      if (complaintType) {
        builder = this._generateQueryBuilder(complaintType);
      } else {
        builder = this.complaintsRepository
          .createQueryBuilder("complaint")
          .leftJoin("complaint.complaint_status_code", "complaint_status")
          .addSelect([
            "complaint_status.complaint_status_code",
            "complaint_status.short_description",
            "complaint_status.long_description",
          ])
          .leftJoin("complaint.reported_by_code", "reported_by")
          .addSelect(["reported_by.reported_by_code", "reported_by.short_description", "reported_by.long_description"])
          .leftJoin("complaint.owned_by_agency_code", "owned_by")
          .addSelect(["owned_by.agency_code", "owned_by.short_description", "owned_by.long_description"])
          .leftJoinAndSelect("complaint.cos_geo_org_unit", "cos_organization")
          .leftJoinAndSelect("complaint.person_complaint_xref", "delegate", "delegate.active_ind = true")
          .leftJoinAndSelect("delegate.person_complaint_xref_code", "delegate_code")
          .leftJoinAndSelect("delegate.person_guid", "person", "delegate.active_ind = true")
          .addSelect([
            "person.person_guid",
            "person.first_name",
            "person.middle_name_1",
            "person.middle_name_2",
            "person.last_name",
          ])
          .leftJoinAndSelect("complaint.comp_mthd_recv_cd_agcy_cd_xref", "method_xref")
          .leftJoinAndSelect("method_xref.complaint_method_received_code", "method_code")
          .leftJoinAndSelect("method_xref.agency_code", "method_agency");
      }

      builder.where("complaint.complaint_identifier = :id", { id });
      const result = await builder.getOne();

      switch (complaintType) {
        case "ERS": {
          return this.mapper.map<AllegationComplaint, AllegationComplaintDto>(
            result as AllegationComplaint,
            "AllegationComplaint",
            "AllegationComplaintDto",
          );
        }
        case "GIR": {
          return this.mapper.map<GirComplaint, GeneralIncidentComplaintDto>(
            result as GirComplaint,
            "GirComplaint",
            "GeneralIncidentComplaintDto",
          );
        }
        case "HWCR": {
          const hwcr = this.mapper.map<HwcrComplaint, WildlifeComplaintDto>(
            result as HwcrComplaint,
            "HwcrComplaint",
            "WildlifeComplaintDto",
          );
          return hwcr;
        }
        default: {
          return this.mapper.map<Complaint, ComplaintDto>(result as Complaint, "Complaint", "ComplaintDto");
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  };

  search = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintSearchParameters,
    hasCEEBRole: boolean,
    token?: string,
  ): Promise<SearchResults> => {
    try {
      let results: SearchResults = { totalCount: 0, complaints: [] };

      const { orderBy, sortBy, page, pageSize, query, ...filters } = model;

      const skip = page && pageSize ? (page - 1) * pageSize : 0;
      const sortTable = this._getSortTable(sortBy);

      const sortString = sortBy !== "update_utc_timestamp" ? `${sortTable}.${sortBy}` : "_update_utc_timestamp";

      //-- generate initial query
      let builder = this._generateQueryBuilder(complaintType);

      //-- apply filters if used
      if (Object.keys(filters).length !== 0) {
        builder = this._applyFilters(builder, filters as ComplaintFilterParameters, complaintType);
      }

      // search for complaints based on the user's role
      const agency = hasCEEBRole ? "EPO" : "COS";
      builder.andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency });

      //-- return Waste and Pestivide complaints for CEEB users
      if (hasCEEBRole && complaintType === "ERS") {
        builder.andWhere("violation_code.agency_code = :agency", { agency: "EPO" });
      }

      // -- filter by complaint identifiers returned by case management if actionTaken filter is present
      if (hasCEEBRole && filters.actionTaken) {
        const complaintIdentifiers = await this._getComplaintsByActionTaken(token, filters.actionTaken);

        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      //-- apply search
      if (query) {
        builder = this._applySearch(builder, complaintType, query);
      }

      //-- apply sort if provided
      if (sortBy && orderBy) {
        builder
          .orderBy(sortString, orderBy)
          .addOrderBy(
            "complaint.incident_reported_utc_timestmp",
            sortBy === "incident_reported_utc_timestmp" ? orderBy : "DESC",
          );
      }

      //-- search and count
      const [complaints, total] =
        page && pageSize ? await builder.skip(skip).take(pageSize).getManyAndCount() : await builder.getManyAndCount();
      results.totalCount = total;

      switch (complaintType) {
        case "ERS": {
          const items = this.mapper.mapArray<AllegationComplaint, AllegationComplaintDto>(
            complaints as Array<AllegationComplaint>,
            "AllegationComplaint",
            "AllegationComplaintDto",
          );
          results.complaints = items;
          break;
        }
        case "GIR": {
          const items = this.mapper.mapArray<GirComplaint, GeneralIncidentComplaintDto>(
            complaints as Array<GirComplaint>,
            "GirComplaint",
            "GeneralIncidentComplaintDto",
          );
          results.complaints = items;
          break;
        }
        case "HWCR":
        default: {
          const items = this.mapper.mapArray<HwcrComplaint, WildlifeComplaintDto>(
            complaints as Array<HwcrComplaint>,
            "HwcrComplaint",
            "WildlifeComplaintDto",
          );

          results.complaints = items;
          break;
        }
      }

      return results;
    } catch (error) {
      this.logger.error(error.response);
      throw new HttpException("Unable to Perform Search", HttpStatus.BAD_REQUEST);
    }
  };

  findRelatedDataById = async (id: string): Promise<RelatedDataDto> => {
    try {
      const udpates = await this._compliantUpdatesService.findByComplaintId(id);
      const actions = await this._compliantUpdatesService.findActionsByComplaintId(id);

      let fullResults: RelatedDataDto = { updates: udpates, actions: actions };
      return fullResults;
    } catch (error) {
      this.logger.error(error);
    }
  };

  mapSearch = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintSearchParameters,
    hasCEEBRole: boolean,
    token?: string,
  ): Promise<MapSearchResults> => {
    const { orderBy, sortBy, page, pageSize, query, ...filters } = model;

    try {
      let results: MapSearchResults = { complaints: [], unmappedComplaints: 0 };

      //-- get the users assigned agency
      const agency = await this._getAgencyByUser();

      //-- search for complaints
      let complaintBuilder = this._generateQueryBuilder(complaintType);

      //-- apply search
      if (query) {
        complaintBuilder = this._applySearch(complaintBuilder, complaintType, query);
      }

      //-- apply filters
      if (Object.keys(filters).length !== 0) {
        complaintBuilder = this._applyFilters(complaintBuilder, filters as ComplaintFilterParameters, complaintType);
      }

      //-- only return complaints for the agency the user is associated with
      if (agency) {
        complaintBuilder.andWhere("complaint.owned_by_agency_code.agency_code = :agency", {
          agency: agency.agency_code,
        });
      }

      //-- added this for consistency with search method
      //-- return Waste and Pestivide complaints for CEEB users
      if (hasCEEBRole && complaintType === "ERS") {
        complaintBuilder.andWhere("violation_code.agency_code = :agency", { agency: "EPO" });
      }

      //-- filter locations without coordinates
      complaintBuilder.andWhere("ST_X(complaint.location_geometry_point) <> 0");
      complaintBuilder.andWhere("ST_Y(complaint.location_geometry_point) <> 0");

      //-- get unmapable complaints
      let unMappedBuilder = this._generateQueryBuilder(complaintType);

      //-- apply search
      if (query) {
        unMappedBuilder = this._applySearch(unMappedBuilder, complaintType, query);
      }

      //-- apply filters
      if (Object.keys(filters).length !== 0) {
        unMappedBuilder = this._applyFilters(unMappedBuilder, filters as ComplaintFilterParameters, complaintType);
      }

      //-- only return complaints for the agency the user is associated with
      if (agency) {
        unMappedBuilder.andWhere("complaint.owned_by_agency_code.agency_code = :agency", {
          agency: agency.agency_code,
        });
      }

      //-- added this for consistency with search method
      //-- return Waste and Pestivide complaints for CEEB users
      if (hasCEEBRole && complaintType === "ERS") {
        unMappedBuilder.andWhere("violation_code.agency_code = :agency", { agency: "EPO" });
      }

      //-- filter locations without coordinates
      unMappedBuilder.andWhere("ST_X(complaint.location_geometry_point) = 0");
      unMappedBuilder.andWhere("ST_Y(complaint.location_geometry_point) = 0");

      // -- filter by complaint identifiers returned by case management if actionTaken filter is present
      if (hasCEEBRole && filters.actionTaken) {
        const complaintIdentifiers = await this._getComplaintsByActionTaken(token, filters.actionTaken);
        complaintBuilder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
        unMappedBuilder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      //-- run queries
      const mappedComplaints = await complaintBuilder.getMany();
      const unmappedComplaints = await unMappedBuilder.getCount();
      results = { ...results, unmappedComplaints };

      //-- map results
      switch (complaintType) {
        case "ERS": {
          const items = this.mapper.mapArray<AllegationComplaint, AllegationComplaintDto>(
            mappedComplaints as Array<AllegationComplaint>,
            "AllegationComplaint",
            "AllegationComplaintDto",
          );
          results.complaints = items;
          break;
        }
        case "GIR": {
          const items = this.mapper.mapArray<GirComplaint, GeneralIncidentComplaintDto>(
            mappedComplaints as Array<GirComplaint>,
            "GirComplaint",
            "GeneralIncidentComplaintDto",
          );

          results.complaints = items;
          break;
        }
        case "HWCR":
        default: {
          const items = this.mapper.mapArray<HwcrComplaint, WildlifeComplaintDto>(
            mappedComplaints as Array<HwcrComplaint>,
            "HwcrComplaint",
            "WildlifeComplaintDto",
          );

          results.complaints = items;
          break;
        }
      }
      return results;
    } catch (error) {
      this.logger.error(error.response);
      throw new HttpException("Unable to Perform Search", HttpStatus.BAD_REQUEST);
    }
  };

  updateComplaintStatusById = async (id: string, status: string): Promise<ComplaintDto> => {
    try {
      const idir = getIdirFromRequest(this.request);

      const statusCode = await this._codeTableService.getComplaintStatusCodeByStatus(status);
      const result = await this.complaintsRepository
        .createQueryBuilder("complaint")
        .update()
        .set({ complaint_status_code: statusCode, update_user_id: idir })
        .where("complaint_identifier = :id", { id })
        .execute();

      //-- check to make sure that only one record was updated
      if (result.affected === 1) {
        const complaint = await this.findById(id);
        return complaint as ComplaintDto;
      } else {
        this.logger.error(`Unable to update complaint: ${id} complaint status to ${status}`);
        throw new HttpException(
          `Unable to update complaint: ${id} complaint status to ${status}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    } catch (error) {
      this.logger.error(`An Error occured trying to update complaint: ${id}, update status: ${status}`);
      this.logger.error(error.response);

      throw new HttpException(
        `Unable to update complaint: ${id} complaint status to ${status}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  updateComplaintById = async (
    id: string,
    complaintType: string,
    model: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto,
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto> => {
    const agencyCode = model.ownedBy;
    const hasAssignees = (delegates: Array<DelegateDto>): boolean => {
      if (delegates && delegates.length > 0) {
        const result = delegates.find((item) => item.type === "ASSIGNEE");

        return !!result;
      }

      return false;
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const idir = getIdirFromRequest(this.request);

    try {
      //-- convert the the dto from the client back into an entity
      //-- so that it can be used to update the complaint
      let entity: Complaint | HwcrComplaint | AllegationComplaint | GirComplaint;

      switch (complaintType) {
        case "ERS": {
          entity = this.mapper.map<AllegationComplaintDto, AllegationComplaint>(
            model as AllegationComplaintDto,
            "AllegationComplaintDto",
            "AllegationComplaint",
          );
          break;
        }
        case "GIR": {
          entity = this.mapper.map<GeneralIncidentComplaintDto, GirComplaint>(
            model as GeneralIncidentComplaintDto,
            "GeneralIncidentComplaintDto",
            "GirComplaint",
          );
          break;
        }
        case "HWCR":
        default: {
          entity = this.mapper.map<WildlifeComplaintDto, HwcrComplaint>(
            model as WildlifeComplaintDto,
            "WildlifeComplaintDto",
            "HwcrComplaint",
          );
          break;
        }
      }

      //-- unlike a typical ORM typeORM can't update an entity and each entity type needs to be updated
      //-- becuase of this we need to transform the entity into a type and that is then used to update
      //-- the original entity
      const complaintTable = this.mapper.map<ComplaintDto, UpdateComplaintDto>(
        model as ComplaintDto,
        "ComplaintDto",
        "UpdateComplaintDto",
      );

      const xref = await this._compMthdRecvCdAgcyCdXrefService.findByComplaintMethodReceivedCodeAndAgencyCode(
        model.complaintMethodReceivedCode,
        agencyCode,
      );

      complaintTable.comp_mthd_recv_cd_agcy_cd_xref = xref;

      //set the audit field
      complaintTable.update_user_id = idir;

      const complaintUpdateResult = await this.complaintsRepository
        .createQueryBuilder("complaint")
        .update()
        .set(complaintTable)
        .where("complaint_identifier = :id", { id })
        .execute();

      //-- only continue the update if the base complaint has been update otherwise roll the transaction back
      if (complaintUpdateResult.affected === 1) {
        const { delegates } = model;

        if (hasAssignees(delegates)) {
          const assignee = delegates.find((item) => item.type === "ASSIGNEE" && item.isActive);
          if (assignee) {
            const converted = this.mapper.map<DelegateDto, PersonComplaintXrefTable>(
              assignee,
              "DelegateDto",
              "PersonComplaintXrefTable",
            );
            converted.create_user_id = idir;
            converted.complaint_identifier = id;

            this._personService.assignNewOfficer(id, converted as any);
          } else {
            //-- the complaint has no assigned officer
            const unassigned = delegates.filter(({ isActive }) => !isActive);
            unassigned.forEach((officer) => {
              const converted = this.mapper.map<DelegateDto, PersonComplaintXrefTable>(
                officer,
                "DelegateDto",
                "PersonComplaintXrefTable",
              );

              converted.create_user_id = idir;
              converted.update_user_id = idir;
              converted.complaint_identifier = id;

              this._personService.assignNewOfficer(id, converted as any);
            });
          }
        }

        //-- apply complaint specific updates
        switch (complaintType) {
          case "ERS": {
            const { violation, isInProgress, wasObserved, violationDetails, ersId } = model as AllegationComplaintDto;
            await this._allegationComplaintRepository
              .createQueryBuilder()
              .update(AllegationComplaint)
              .set({
                violation_code: {
                  violation_code: violation,
                },
                in_progress_ind: isInProgress,
                observed_ind: wasObserved,
                suspect_witnesss_dtl_text: violationDetails,
                update_user_id: idir,
              })
              .where("allegation_complaint_guid = :ersId", { ersId })
              .execute();
            break;
          }
          case "GIR": {
            const { girType, girId } = model as GeneralIncidentComplaintDto;
            await this._girComplaintRepository
              .createQueryBuilder()
              .update(GirComplaint)
              .set({
                gir_type_code: {
                  gir_type_code: girType,
                },
                update_user_id: idir,
              })
              .where("gir_complaint_guid = :girId", { girId })
              .execute();
            break;
          }
          case "HWCR":
          default: {
            const { natureOfComplaint, species, otherAttractants, hwcrId } = model as WildlifeComplaintDto;
            const { attractant_hwcr_xref: attractants } = entity as HwcrComplaint;

            this._attractantService.updateComplaintAttractants(entity as HwcrComplaint, attractants);

            await this._wildlifeComplaintRepository
              .createQueryBuilder()
              .update(HwcrComplaint)
              .set({
                hwcr_complaint_nature_code: {
                  hwcr_complaint_nature_code: natureOfComplaint,
                },
                species_code: { species_code: species },
                other_attractants_text: otherAttractants,
                update_user_id: idir,
              })
              .where("hwcr_complaint_guid = :hwcrId", { hwcrId })
              .execute();

            break;
          }
        }
        await queryRunner.commitTransaction();

        const result = (await this.findById(id, complaintType as COMPLAINT_TYPE)) as any;
        return result;
      } else {
        throw new HttpException(`Unable to update complaint: ${id}`, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `An Error occured trying to update ${complaintType} complaint: ${id}, update details: ${JSON.stringify(model)}`,
      );
      this.logger.error(error.response);

      throw new HttpException(`Unable to update complaint: ${id}`, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  };

  create = async (
    complaintType: COMPLAINT_TYPE,
    model: WildlifeComplaintDto | AllegationComplaintDto,
    webeocInd?: boolean,
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto> => {
    this.logger.debug("Creating new complaint");
    const generateComplaintId = async (queryRunner: QueryRunner): Promise<string> => {
      let sequence;
      await queryRunner.manager.query("SELECT nextval('complaint_sequence')").then(function (returnData) {
        sequence = map(returnData, "nextval");
      });
      const prefix = format(new Date(), "yy");

      const complaintId = `${prefix}-${sequence}`;
      this.logger.debug(`Created new complaint ${complaintId}`);
      return complaintId;
    };

    const idir = webeocInd ? "webeoc" : getIdirFromRequest(this.request);

    const agencyCodeInstance = new AgencyCode("COS");

    const { ownedBy } = model;

    const agencyCode = webeocInd ? agencyCodeInstance : new AgencyCode(ownedBy);

    const queryRunner = this.dataSource.createQueryRunner();
    let complaintId = "";

    try {
      queryRunner.connect();
      queryRunner.startTransaction();

      complaintId = await generateComplaintId(queryRunner);

      //-- convert the the dto from the client back into an entity
      //-- so that it can be used to create the comaplaint
      let entity: Complaint = this.mapper.map<ComplaintDto, Complaint>(
        model as ComplaintDto,
        "ComplaintDto",
        "Complaint",
      );

      //-- apply audit user data
      entity.create_user_id = idir;
      entity.update_user_id = idir;
      entity.complaint_identifier = complaintId;
      entity.owned_by_agency_code = agencyCode;

      const xref = await this._compMthdRecvCdAgcyCdXrefService.findByComplaintMethodReceivedCodeAndAgencyCode(
        model.complaintMethodReceivedCode,
        agencyCode.agency_code,
      );

      entity.comp_mthd_recv_cd_agcy_cd_xref = xref;

      const complaint = await this.complaintsRepository.create(entity);
      await this.complaintsRepository.save(complaint);

      //-- if there are any asignees apply them to the complaint
      if (entity.person_complaint_xref) {
        const { person_complaint_xref } = entity;

        const selectedAssignee = person_complaint_xref.find(
          ({ person_complaint_xref_code: { person_complaint_xref_code }, active_ind }) =>
            person_complaint_xref_code === "ASSIGNEE" && active_ind,
        );

        if (selectedAssignee) {
          const {
            person_guid: { person_guid: id },
          } = selectedAssignee;

          const assignee = {
            active_ind: true,
            person_guid: {
              person_guid: id,
            },
            complaint_identifier: complaintId,
            person_complaint_xref_code: "ASSIGNEE",
            create_user_id: idir,
          } as any;

          this._personService.assignNewOfficer(complaintId, assignee);
        }
      }

      switch (complaintType) {
        case "ERS": {
          const { violation, isInProgress, wasObserved, violationDetails } = model as AllegationComplaintDto;
          const ersId = randomUUID();

          const ers = {
            allegation_complaint_guid: ersId,
            complaint_identifier: complaintId,
            violation_code: violation,
            in_progress_ind: !!isInProgress,
            observed_ind: !!wasObserved,
            suspect_witnesss_dtl_text: violationDetails,
            create_user_id: idir,
            update_user_id: idir,
          } as any;

          const newAllegation = await this._allegationComplaintRepository.create(ers);
          await this._allegationComplaintRepository.save(newAllegation);
          break;
        }
        case "HWCR":
        default: {
          const { species, natureOfComplaint, otherAttractants, attractants } = model as WildlifeComplaintDto;
          const hwcrId = randomUUID();

          const hwcr = {
            hwcr_complaint_guid: hwcrId,
            complaint_identifier: complaintId,
            species_code: species,
            hwcr_complaint_nature_code: natureOfComplaint,
            other_attractants_text: otherAttractants,
            create_user_id: idir,
            update_user_id: idir,
          } as any;

          const newWildlife = await this._wildlifeComplaintRepository.create(hwcr);
          await this._wildlifeComplaintRepository.save(newWildlife);

          if (attractants) {
            attractants.forEach(({ attractant }) => {
              const record = {
                hwcr_complaint_guid: hwcrId,
                attractant_code: attractant,
                create_user_id: idir,
                update_user_id: idir,
              } as any;

              this._attractantService.create(queryRunner, record);
            });
          }

          break;
        }
      }

      await queryRunner.commitTransaction();

      return (await this.findById(complaintId, complaintType)) as WildlifeComplaintDto | AllegationComplaintDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `An Error occured trying to update ${complaintType} complaint: ${complaintId}, update details: ${JSON.stringify(
          model,
        )}`,
      );
      this.logger.error(error.response);
      throw new HttpException(`Unable to update complaint: ${complaintId}`, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  };

  getZoneAtAGlanceStatistics = async (complaintType: COMPLAINT_TYPE, zone: string): Promise<ZoneAtAGlanceStats> => {
    let results: ZoneAtAGlanceStats = { total: 0, assigned: 0, unassigned: 0 };

    const total = await this._getTotalComplaintsByZone(complaintType, zone);
    const assigned = await this._getTotalAssignedComplaintsByZone(complaintType, zone);
    const unassigned = total - assigned;

    const offices = (await this._getComplaintsByOffice(complaintType, zone)).filter((office) => {
      return office.name !== "COS HQ";
    });

    results = { ...results, total, assigned, unassigned, offices };
    return results;
  };

  getReportData = async (id: string, complaintType: COMPLAINT_TYPE, tz: string, token: string) => {
    let data;
    mapWildlifeReport(this.mapper, tz);
    mapAllegationReport(this.mapper, tz);
    let builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>;

    const _getUpdates = async (id: string) => {
      const builder = this._complaintUpdateRepository
        .createQueryBuilder("updates")
        .where({
          complaintIdentifier: {
            complaint_identifier: id,
          },
        })
        .orderBy({
          update_seq_number: "DESC",
        });

      const result = await builder.getMany();

      const updates = result?.map((item) => {
        const utcDate = toDate(item.createUtcTimestamp, { timeZone: "UTC" });
        const zonedDate = toZonedTime(utcDate, tz);
        let updatedOn = format(zonedDate, "yyyy-MM-dd", { timeZone: tz });
        let updatedAt = format(zonedDate, "HH:mm", { timeZone: tz });

        const latitude = item.updLocationGeometryPoint ? item?.updLocationGeometryPoint?.coordinates[1] : null;
        const longitude = item.updLocationGeometryPoint ? item?.updLocationGeometryPoint?.coordinates[0] : null;

        let record: ComplaintUpdateDto = {
          sequenceId: item.updateSeqNumber,
          description: item.updDetailText,
          updatedOn: updatedOn,
          updatedAt: updatedAt,
          updateOn: `${updatedOn} ${updatedAt}`,
          location: {
            summary: item?.updLocationSummaryText,
            details: item.updLocationDetailedText,
            latitude,
            longitude,
          },
        };
        return record;
      });

      return updates;
    };

    const _applyTimezone = (input: Date, tz: string, output: "date" | "time" | "datetime"): string => {
      const utcDate = toDate(input, { timeZone: "UTC" });
      const zonedDate = toZonedTime(utcDate, tz);

      switch (output) {
        case "date":
          return format(zonedDate, "yyyy-MM-dd", { timeZone: tz });
        case "time":
          return format(zonedDate, "HH:mm", { timeZone: tz });
        case "datetime":
        default:
          return format(zonedDate, "yyyy-MM-dd HH:mm", { timeZone: tz });
      }
    };

    const _getCaseData = async (id: string, token: string) => {
      //-- Get the Outcome Data, this is done via a GQL call to prevent
      //-- a circular dependency between the complaint and case_file modules
      const { data, errors } = await get(token, {
        query: `{getCaseFileByLeadId (leadIdentifier: "${id}")
        ${caseFileQueryFields}
      }`,
      });
      if (errors) {
        this.logger.error("GraphQL errors:", errors);
        throw new Error("GraphQL errors occurred");
      }

      //-- Clean up the data to make it easier for formatting
      let outcomeData = data;
      //-- Add UA to unpermitted sites
      if (
        outcomeData.getCaseFileByLeadId.authorization &&
        outcomeData.getCaseFileByLeadId.authorization.type !== "permit"
      ) {
        outcomeData.getCaseFileByLeadId.authorization.value =
          "UA" + outcomeData.getCaseFileByLeadId.authorization.value;
      }

      //-- Convert Officer Guids to Names
      if (outcomeData.getCaseFileByLeadId.note) {
        const { first_name, last_name } = (
          await this._officerService.findByAuthUserGuid(outcomeData.getCaseFileByLeadId.note.action.actor)
        ).person_guid;

        outcomeData.getCaseFileByLeadId.note.action.actor = last_name + ", " + first_name;
      }

      return outcomeData.getCaseFileByLeadId;
    };

    try {
      if (complaintType) {
        builder = this._generateQueryBuilder(complaintType);
      } else {
        builder = this.complaintsRepository
          .createQueryBuilder("complaint")
          .leftJoin("complaint.complaint_status_code", "complaint_status")
          .addSelect([
            "complaint_status.complaint_status_code",
            "complaint_status.short_description",
            "complaint_status.long_description",
          ])
          .leftJoin("complaint.reported_by_code", "reported_by")
          .addSelect(["reported_by.reported_by_code", "reported_by.short_description", "reported_by.long_description"])
          .leftJoin("complaint.owned_by_agency_code", "owned_by")
          .addSelect(["owned_by.agency_code", "owned_by.short_description", "owned_by.long_description"])
          .leftJoinAndSelect("complaint.cos_geo_org_unit", "cos_organization")
          .leftJoinAndSelect("complaint.person_complaint_xref", "delegate", "delegate.active_ind = true")
          .leftJoinAndSelect("delegate.person_complaint_xref_code", "delegate_code")
          .leftJoinAndSelect("delegate.person_guid", "person", "delegate.active_ind = true")
          .addSelect([
            "person.person_guid",
            "person.first_name",
            "person.middle_name_1",
            "person.middle_name_2",
            "person.last_name",
          ]);
      }

      builder.where("complaint.complaint_identifier = :id", { id });
      const result = await builder.getOne();

      switch (complaintType) {
        case "HWCR": {
          mapWildlifeReport(this.mapper, tz);

          data = this.mapper.map<HwcrComplaint, WildlifeReportData>(
            result as HwcrComplaint,
            "HwcrComplaint",
            "WildlifeReportData",
          );
          break;
        }
        case "GIR": {
          break;
        }
        case "ERS": {
          mapAllegationReport(this.mapper, tz);

          data = this.mapper.map<AllegationComplaint, AllegationReportData>(
            result as AllegationComplaint,
            "AllegationComplaint",
            "AllegationReportData",
          );
          break;
        }
      }

      //-- get case data
      data.outcome = await _getCaseData(id, token);

      //-- get any updates a complaint may have
      data.updates = await _getUpdates(id);

      //-- this is a workaround to hide empty rows in the carbone templates
      //-- It could possibly be removed if the CDOGS version of Carbone is updated
      if (data.privacyRequested) {
        data = { ...data, privacy: [{ value: data.privacyRequested }] };
      }
      if (data.outcome.decision && data.outcome.decision.leadAgencyLongDescription) {
        data = { ...data, agency: [{ value: data.outcome.decision.leadAgencyLongDescription }] };
      }
      if (data.outcome.decision && data.outcome.decision.inspectionNumber) {
        data = { ...data, inspection: [{ value: data.outcome.decision.inspectionNumber }] };
      }

      //-- problems in the automapper mean dates need to be handled
      //-- seperatly
      const current = new Date();
      data.reportDate = _applyTimezone(current, tz, "date");
      data.reportTime = _applyTimezone(current, tz, "time");
      data.generatedOn = `${data.reportDate} at ${data.reportTime}`;

      data.reportedOn = _applyTimezone(data.reportedOn, tz, "datetime");
      data.updatedOn = _applyTimezone(data.updatedOn, tz, "datetime");

      data.outcome.note.action.date = _applyTimezone(data.outcome.note.action.date, tz, "date");
      data.outcome.decision.actionTakenDate = _applyTimezone(data.outcome.decision.actionTakenDate, tz, "date");

      //-- incidentDateTime may not be set, if there's no date
      //-- don't try and apply the incident date
      if (data.incidentDateTime) {
        data.incidentDateTime = _applyTimezone(data.incidentDateTime, tz, "datetime");
      }

      return data;
    } catch (error) {
      this.logger.error(error);
    }
  };
}
