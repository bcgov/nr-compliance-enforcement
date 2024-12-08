import { map } from "lodash";
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { caseFileQueryFields, get } from "../../external_api/case_management";
import Supercluster, { PointFeature } from "supercluster";
import { GeoJsonProperties } from "geojson";

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

import {
  ComplaintSearchParameters,
  ComplaintMapSearchClusteredParameters,
} from "../../types/models/complaints/complaint-search-parameters";
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
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";

type complaintAlias = HwcrComplaint | AllegationComplaint | GirComplaint;
@Injectable({ scope: Scope.REQUEST })
export class ComplaintService {
  private readonly logger = new Logger(ComplaintService.name);
  private readonly mapper: Mapper;

  @InjectRepository(Complaint)
  private readonly complaintsRepository: Repository<Complaint>;
  @InjectRepository(HwcrComplaint)
  private readonly _wildlifeComplaintRepository: Repository<HwcrComplaint>;
  @InjectRepository(AllegationComplaint)
  private readonly _allegationComplaintRepository: Repository<AllegationComplaint>;
  @InjectRepository(GirComplaint)
  private readonly _girComplaintRepository: Repository<GirComplaint>;
  @InjectRepository(ComplaintUpdate)
  private readonly _complaintUpdateRepository: Repository<ComplaintUpdate>;
  @InjectRepository(Officer)
  private readonly _officertRepository: Repository<Officer>;
  @InjectRepository(Office)
  private readonly _officeRepository: Repository<Office>;
  @InjectRepository(SpeciesCode)
  private readonly _speciesRepository: Repository<SpeciesCode>;
  @InjectRepository(CosGeoOrgUnit)
  private readonly _cosOrganizationUnitRepository: Repository<CosGeoOrgUnit>;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectMapper() mapper,
    private readonly _codeTableService: CodeTableService,
    private readonly _compliantUpdatesService: ComplaintUpdatesService,
    private readonly _personService: PersonComplaintXrefService,
    private readonly _attractantService: AttractantHwcrXrefService,
    private readonly _compMthdRecvCdAgcyCdXrefService: CompMthdRecvCdAgcyCdXrefService,
    private readonly _officerService: OfficerService,
    private readonly _linkedComplaintsXrefService: LinkedComplaintXrefService,
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
    if (result.office_guid?.agency_code) {
      const {
        office_guid: { agency_code },
      } = result;
      return agency_code;
    } else {
      return null;
    }
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

  private readonly _generateMapQueryBuilder = (
    type: COMPLAINT_TYPE,
    includeCosOrganization: boolean,
  ): SelectQueryBuilder<complaintAlias> => {
    let builder: SelectQueryBuilder<complaintAlias>;

    switch (type) {
      case "ERS":
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoin("allegation.complaint_identifier", "complaint")
          .addSelect(["complaint.complaint_identifier", "complaint.location_geometry_point"])
          .leftJoin("allegation.violation_code", "violation_code");
        break;
      case "GIR":
        builder = this._girComplaintRepository
          .createQueryBuilder("general")
          .leftJoin("general.complaint_identifier", "complaint")
          .addSelect(["complaint.complaint_identifier", "complaint.location_geometry_point"])
          .leftJoin("general.gir_type_code", "gir");
        break;
      case "HWCR":
      default:
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife")
          .leftJoin("wildlife.complaint_identifier", "complaint")
          .addSelect(["complaint.complaint_identifier", "complaint.location_geometry_point"])
          .leftJoin("wildlife.species_code", "species_code")
          .leftJoin("wildlife.hwcr_complaint_nature_code", "complaint_nature_code")
          .leftJoin("wildlife.attractant_hwcr_xref", "attractants", "attractants.active_ind = true")
          .leftJoin("attractants.attractant_code", "attractant_code");
        break;
    }
    builder
      .leftJoin("complaint.complaint_status_code", "complaint_status")
      .leftJoin("complaint.reported_by_code", "reported_by")
      .leftJoin("complaint.complaint_update", "complaint_update")
      .leftJoin("complaint.action_taken", "action_taken")
      .leftJoin("complaint.owned_by_agency_code", "owned_by")
      .leftJoin("complaint.linked_complaint_xref", "linked_complaint")
      .leftJoin("complaint.person_complaint_xref", "delegate", "delegate.active_ind = true")
      .leftJoin("delegate.person_complaint_xref_code", "delegate_code")
      .leftJoin("delegate.person_guid", "person", "delegate.active_ind = true")
      .leftJoin("complaint.comp_mthd_recv_cd_agcy_cd_xref", "method_xref")
      .leftJoin("method_xref.complaint_method_received_code", "method_code")
      .leftJoin("method_xref.agency_code", "method_agency");
    if (includeCosOrganization) {
      builder.leftJoin("complaint.cos_geo_org_unit", "cos_organization");
    }
    return builder;
  };

  private readonly _generateQueryBuilder = (type: COMPLAINT_TYPE): SelectQueryBuilder<complaintAlias> => {
    let builder: SelectQueryBuilder<complaintAlias>;
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
          .addSelect([
            "species_code.species_code",
            "species_code.short_description",
            "species_code.long_description",
            "species_code.large_carnivore_ind",
          ])

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

      .leftJoin("complaint.complaint_update", "complaint_update")
      .addSelect(["complaint_update.upd_detail_text", "complaint_update.complaint_identifier"])

      .leftJoin("complaint.action_taken", "action_taken")
      .addSelect(["action_taken.action_details_txt", "action_taken.complaint_identifier"])

      .leftJoin("complaint.owned_by_agency_code", "owned_by")
      .addSelect(["owned_by.agency_code", "owned_by.short_description", "owned_by.long_description"])
      .leftJoinAndSelect("complaint.linked_complaint_xref", "linked_complaint")
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

  private async _applySearch(
    builder: SelectQueryBuilder<complaintAlias>,
    complaintType: COMPLAINT_TYPE,
    query: string,
    token: string,
  ): Promise<SelectQueryBuilder<complaintAlias>> {
    builder.andWhere(
      new Brackets(async (qb) => {
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
            // Search CM for any case files that may match based on authorization id
            const { data, errors } = await get(token, {
              query: `{getCasesFilesBySearchString (searchString: "${query}")
              {
                leadIdentifier,
                caseIdentifier
              }
            }`,
            });

            if (errors) {
              this.logger.error("GraphQL errors:", errors);
              throw new Error("GraphQL errors occurred");
            }

            const caseSearchData = data.getCasesFilesBySearchString;

            if (caseSearchData.length > 0) {
              qb.orWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
                complaint_identifiers: caseSearchData.map((caseData) => caseData.leadIdentifier),
              });
            }

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
        qb.orWhere("complaint_update.upd_detail_text ILIKE :query", {
          query: `%${query}%`,
        });
        qb.orWhere("action_taken.action_details_txt ILIKE :query", {
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

  private readonly _getComplaintsByOutcomeAnimal = async (
    token: string,
    outcomeAnimalCode: string,
  ): Promise<string[]> => {
    const { data, errors } = await get(token, {
      query: `{getLeadsByOutcomeAnimal (outcomeAnimalCode: "${outcomeAnimalCode}")}`,
    });
    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }
    const complaintIdentifiers = data.getLeadsByOutcomeAnimal.length > 0 ? data.getLeadsByOutcomeAnimal : ["-1"];
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
      this.logger.error("Searching for complaints");
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

      // -- filter by complaint identifiers returned by case management if outcome animal filter is present
      if (agency === "COS" && filters.outcomeAnimal) {
        const complaintIdentifiers = await this._getComplaintsByOutcomeAnimal(token, filters.outcomeAnimal);

        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      //-- apply search
      if (query) {
        builder = await this._applySearch(builder, complaintType, query, token);
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
      // Workaround for the issue with getManyAndCount() returning the wrong count and results in complex queries
      // introduced by adding an IN clause in a OrWhere statement: https://github.com/typeorm/typeorm/issues/320
      const [, total] = await builder.take(0).getManyAndCount(); // returns 0 results but the total count is correct
      results.totalCount = total;
      const complaints = page && pageSize ? await builder.skip(skip).take(pageSize).getMany() : await builder.getMany();

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

  _generateFilteredMapQueryBuilder = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintMapSearchClusteredParameters,
    hasCEEBRole: boolean,
    token?: string,
  ): Promise<SelectQueryBuilder<complaintAlias>> => {
    const { query, ...filters } = model;

    try {
      //-- search for complaints
      // Only these options require the cos_geo_org_unit_flat_vw view (cos_organization), which is very slow.
      const includeCosOrganization: boolean = Boolean(query || filters.community || filters.zone || filters.region);
      let builder = this._generateMapQueryBuilder(complaintType, includeCosOrganization);

      //-- apply search
      if (query) {
        builder = await this._applySearch(builder, complaintType, query, token);
      }

      //-- apply filters if used
      if (Object.keys(filters).length !== 0) {
        builder = this._applyFilters(builder, filters as ComplaintFilterParameters, complaintType);
      }

      //-- only return complaints for the agency the user is associated with
      const agency = hasCEEBRole ? "EPO" : (await this._getAgencyByUser()).agency_code;
      agency && builder.andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency });

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

      // -- filter by complaint identifiers returned by case management if outcome animal filter is present
      if (agency === "COS" && filters.outcomeAnimal) {
        const complaintIdentifiers = await this._getComplaintsByOutcomeAnimal(token, filters.outcomeAnimal);
        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      return builder;
    } catch (error) {
      this.logger.error(error);
    }
  };

  _getUnmappedComplaintsCount = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintMapSearchClusteredParameters,
    hasCEEBRole: boolean,
    token?: string,
  ): Promise<number> => {
    try {
      const builder = await this._generateFilteredMapQueryBuilder(complaintType, model, hasCEEBRole, token);

      //-- filter for locations without coordinates
      builder.andWhere("ST_X(complaint.location_geometry_point) = 0");
      builder.andWhere("ST_Y(complaint.location_geometry_point) = 0");

      return builder.getCount();
    } catch (error) {
      this.logger.error(error);
    }
  };

  _getClusteredComplaints = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintMapSearchClusteredParameters,
    hasCEEBRole: boolean,
    token?: string,
  ): Promise<Array<PointFeature<GeoJsonProperties>>> => {
    try {
      const complaintBuilder = await this._generateFilteredMapQueryBuilder(complaintType, model, hasCEEBRole, token);

      //-- filter locations without coordinates
      complaintBuilder.andWhere("complaint.location_geometry_point is not null");
      complaintBuilder.andWhere("ST_X(complaint.location_geometry_point) <> 0");
      complaintBuilder.andWhere("ST_Y(complaint.location_geometry_point) <> 0");

      //-- filter locations by bounding box if provided, otherwise default to the world
      //   geometry ST_MakeEnvelope(float xmin, float ymin, float xmax, float ymax, integer srid=unknown);
      const bbox = model.bbox ? model.bbox.split(",") : ["-180", "-90", "180", "90"];
      complaintBuilder.andWhere(
        `complaint.location_geometry_point && ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326)`,
      );

      //-- run mapped query
      let start = new Date().getTime();
      const mappedComplaints = await complaintBuilder.getMany();
      let elapsed = new Date().getTime() - start;
      this.logger.debug("mapped complaints query ran in " + elapsed + "ms");

      // convert to supercluster PointFeature array
      const points: Array<PointFeature<GeoJsonProperties>> = mappedComplaints.map((item) => {
        return {
          type: "Feature",
          properties: {
            cluster: false,
            id: item.complaint_identifier.complaint_identifier,
          },
          geometry: item.complaint_identifier.location_geometry_point,
        } as PointFeature<GeoJsonProperties>;
      });

      return points;
    } catch (error) {
      this.logger.error(error);
    }
  };

  mapSearchClustered = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintMapSearchClusteredParameters,
    hasCEEBRole: boolean,
    token?: string,
  ): Promise<MapSearchResults> => {
    try {
      let results: MapSearchResults = {};
      let debugLog = "";
      // Get unmappable complaints if requested
      if (model.unmapped) {
        debugLog += "Getting unmapped complaints count\n";
        this.logger.debug("Getting unmapped complaints count");
        // run query and append to results
        let start = new Date().getTime();
        const unmappedComplaints = await this._getUnmappedComplaintsCount(complaintType, model, hasCEEBRole, token);
        let elapsed = new Date().getTime() - start;
        debugLog += "unmapped query ran in " + elapsed + "ms\n";
        this.logger.debug("unmapped query ran in " + elapsed + "ms");
        results = { ...results, unmappedComplaints };
      }

      if (model.clusters) {
        let start = new Date().getTime();
        const points = await this._getClusteredComplaints(complaintType, model, hasCEEBRole, token);
        let elapsed = new Date().getTime() - start;
        debugLog += "mapped complaints query ran in " + elapsed + "ms\n";
        this.logger.debug("map query ran in " + elapsed + "ms");

        start = new Date().getTime();
        // load into Supercluster
        const index = new Supercluster({
          log: false,
          radius: 160,
          maxZoom: 18,
          minPoints: model.zoom == 18 ? 9999999 : 2, // If at max zoom, don't cluster?
        });
        index.load(points);

        // cluster the results
        const bbox = model.bbox ? model.bbox.split(",") : ["-180", "-90", "180", "90"];
        let clusters = index.getClusters(
          [Number(bbox[0]), Number(bbox[1]), Number(bbox[2]), Number(bbox[3])],
          model.zoom,
        );

        // If we are doing a global search and there is only one cluster, try to explode it to at least 2 clusters
        // then return the center and zoom level so the client can then zoom to the clusters at an appropriate zoom level
        if (!model.bbox && clusters.length === 1) {
          const center = [clusters[0].geometry.coordinates[1], clusters[0].geometry.coordinates[0]];
          const expansionZoom = index.getClusterExpansionZoom(clusters[0].properties.cluster_id);
          // If we can expand the cluster, do so. If not, it's a single point and we don't need to do anything
          if (expansionZoom) {
            clusters = index.getClusters(
              [Number(bbox[0]), Number(bbox[1]), Number(bbox[2]), Number(bbox[3])],
              expansionZoom,
            );
          }
          results.zoom = expansionZoom || 18; // If we can't expand the cluster, fully zoom to the point
          results.center = center;
        }
        elapsed = new Date().getTime() - start;
        debugLog += "cluster results in " + elapsed + "ms\n";
        this.logger.debug("cluster results in " + elapsed + "ms");

        start = new Date().getTime();
        clusters.forEach((cluster) => {
          cluster.properties.zoom = index.getClusterExpansionZoom(cluster.properties.cluster_id);
        });
        elapsed = new Date().getTime() - start;
        debugLog += "set cluster expansion zoom in " + elapsed + "ms\n";
        this.logger.debug("set cluster expansion zoom in " + elapsed + "ms");

        // set the results
        results.clusters = clusters;
        results.debugLog = debugLog;
      }
      return results;
    } catch (error) {
      this.logger.error(error);
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

    const _applyAssessmentData = async (assessmentDetails, assessmentActions) => {
      //-- Convert booleans to Yes/No

      //Note this one is backwards since the variable is action NOT required but the report is action required
      assessmentDetails.actionNotRequired = assessmentDetails.actionNotRequired ? "No" : "Yes";

      assessmentDetails.contactedComplainant = assessmentDetails.contactedComplainant ? "Yes" : "No";

      assessmentDetails.attended = assessmentDetails.attended ? "Yes" : "No";

      //-- Remove all inactive assessment and prevention actions
      let filteredActions = assessmentActions.filter((item) => item.activeIndicator === true);

      //Split between legecy and regular actions
      const { legacyActions, actions } = filteredActions.reduce(
        (acc, obj) => {
          if (obj.isLegacy) {
            acc.legacyActions.push(obj); // Add to legacy array if isLegacy is true
          } else {
            acc.actions.push(obj); // Add to nonLegacy array if isLegacy is false
          }
          return acc; // Return the accumulator
        },
        { legacyActions: [], actions: [] },
      ); // Initial value with two empty arrays

      assessmentDetails.actions = actions;
      assessmentDetails.legacyActions = legacyActions;

      //-- Convert Officer Guids to Names
      if (assessmentActions?.[0]?.actor) {
        assessmentDetails.assessmentActor = assessmentActions[0].actor;
        assessmentDetails.assessmentDate = assessmentActions[0].date;

        const { first_name, last_name } = (
          await this._officerService.findByAuthUserGuid(assessmentDetails.assessmentActor)
        ).person_guid;
        assessmentDetails.assessmentActor = `${last_name}, ${first_name}`;

        //Apply timezone and format date
        assessmentDetails.assessmentDate = _applyTimezone(assessmentDetails.assessmentDate, tz, "date");
      }
    };

    const _applyPreventionData = async (preventionDetails, preventionActions) => {
      //-- Remove all inactive assessment and prevention actions
      let filteredActions = preventionActions.filter((item) => item.activeIndicator === true);
      preventionDetails.actions = filteredActions;

      //-- Convert Officer Guid to Names
      if (preventionDetails?.actions[0]?.actor) {
        preventionDetails.preventionActor = preventionActions[0].actor;
        preventionDetails.preventionDate = preventionActions[0].date;

        const { first_name, last_name } = (
          await this._officerService.findByAuthUserGuid(preventionDetails.preventionActor)
        ).person_guid;

        preventionDetails.preventionActor = `${last_name}, ${first_name}`;

        //Apply timezone and format date
        preventionDetails.preventionDate = _applyTimezone(preventionDetails.preventionDate, tz, "date");
      }
    };

    const _applyEquipmentData = async (equipment) => {
      let equipmentCount = 1;
      for (const equip of equipment) {
        const equipmentActions = equip.actions;

        //-- Convert booleans to Yes/No
        const indicatorEnum = { Y: "Yes", N: "No" };
        equip.wasAnimalCaptured = indicatorEnum[equip.wasAnimalCaptured] || "Unknown";

        //-- Pull out the SetBy and Removed By Users / Dates
        const setByAction = equipmentActions.find((item) => item.actionCode === "SETEQUIPMT");
        const removedByAction = equipmentActions.find((item) => item.actionCode === "REMEQUIPMT");

        //-- Convert Officer Guids to Names in parallel
        const officerPromises = [];

        if (setByAction?.actor) {
          officerPromises.push(
            this._officerService.findByAuthUserGuid(setByAction.actor).then((result) => {
              const { first_name, last_name } = result.person_guid;
              equip.setByActor = `${last_name}, ${first_name}`;
              equip.setByDate = setByAction.date;
            }),
          );
        }

        if (removedByAction?.actor) {
          officerPromises.push(
            this._officerService.findByAuthUserGuid(removedByAction?.actor).then((result) => {
              const { first_name, last_name } = result.person_guid;
              removedByAction.actor = `${last_name}, ${first_name}`;
            }),
          );
        }

        // Wait for both officer name resolutions
        await Promise.all(officerPromises);

        //-- Apply timezone and format dates
        if (equip.setByDate) {
          equip.setByDate = _applyTimezone(equip.setByDate, tz, "date");
        }

        if (removedByAction?.date) {
          removedByAction.date = _applyTimezone(removedByAction.date, tz, "date");
        }

        //-- Removed By should only display if it exists... so it needs to go into an array until carbone is updated :(
        equip.removedBy = [...(equip.removedBy || []), ...(removedByAction ? [removedByAction] : [])];

        //-- Same for the Was Animal Captured... as this is mandatory, just ignore it if the value is "Unknown"
        if (equip.wasAnimalCaptured !== "Unknown") {
          equip.animalCaptured = equip.animalCaptured || []; // Ensure animalCaptured is an array
          equip.animalCaptured.push({ value: equip.wasAnimalCaptured }); // Add the object with the 'value' property
        }

        //give it a nice friendly number as nothing comes back from the GQL
        equip.order = equipmentCount;
        equipmentCount++;
      }
      return equipment;
    };

    const _applyWildlifeData = async (wildlife) => {
      for (const animal of wildlife) {
        const wildlifeActions = animal.actions;

        const drugAction = wildlifeActions?.find((item) => item.actionCode === "ADMNSTRDRG");
        const outcomeAction = wildlifeActions?.find((item) => item.actionCode === "RECOUTCOME");
        let drugActor = drugAction?.actor;
        let drugDate = drugAction?.date;

        //-- Case Management doesn't keep the species codes as we are source of truth

        const builder = this._speciesRepository.createQueryBuilder("species").where({ species_code: animal.species });
        const result = await builder.getOne();
        animal.species = result.short_description;

        //-- Convert Officer Guids to Names in parallel
        animal.officer = outcomeAction?.actor;
        animal.date = outcomeAction?.date;

        const officerPromises = [];

        if (animal.officer) {
          officerPromises.push(
            this._officerService.findByAuthUserGuid(animal.officer).then((result) => {
              const { first_name, last_name } = result.person_guid;
              animal.officer = `${last_name}, ${first_name}`;
            }),
          );
        }

        if (drugActor) {
          officerPromises.push(
            this._officerService.findByAuthUserGuid(drugActor).then((result) => {
              const { first_name, last_name } = result.person_guid;
              drugActor = `${last_name}, ${first_name}`;
            }),
          );
        }

        // Wait for both officer name resolutions
        await Promise.all(officerPromises);

        //-- Apply timezone and format dates
        if (animal.date) {
          animal.date = _applyTimezone(animal.date, tz, "date");
        }
        if (drugDate) {
          drugDate = _applyTimezone(drugDate, tz, "date");
        }

        //add the officer/drug onto each drug row
        animal.drugs?.forEach((drug) => {
          drug.officer = drugActor;
          drug.date = drugDate;
        });
      }
      return wildlife;
    };

    const _applyNoteData = async (caseFile) => {
      //-- Convert Officer Guid to Name
      if (caseFile.note) {
        const { first_name, last_name } = (await this._officerService.findByAuthUserGuid(caseFile.note.action.actor))
          .person_guid;

        caseFile.note.action.actor = last_name + ", " + first_name;
        caseFile.note.action.date = _applyTimezone(caseFile.note.action.date, tz, "date");
      }
    };

    const _applyReviewData = async (caseFile) => {
      //-- Convert booleans to Yes/No

      caseFile.isReviewRequired = caseFile.isReviewRequired ? "Yes" : "No";

      if (caseFile.reviewComplete) {
        caseFile.reviewComplete.activeIndicator = caseFile.reviewComplete.activeIndicator ? "Yes" : "No";

        //-- Convert Officer Guid to Name
        const { first_name, last_name } = (await this._officerService.findByAuthUserGuid(caseFile.reviewComplete.actor))
          .person_guid;
        caseFile.reviewComplete.actor = last_name + ", " + first_name;
        //File Review Date - No Action Array
        caseFile.reviewComplete.date = _applyTimezone(caseFile.reviewComplete.date, tz, "date");
      }
    };

    const _getCaseData = async (id: string, token: string, tz: string) => {
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

      // Take advantage of value by reference to make the rest of the code a bit more readable
      const assessmentDetails = outcomeData.getCaseFileByLeadId.assessmentDetails;
      const assessmentActions = [
        ...(Array.isArray(assessmentDetails?.actions) ? assessmentDetails.actions : []),
        ...(Array.isArray(assessmentDetails?.cat1Actions) ? assessmentDetails.cat1Actions : []),
      ];
      const preventionDetails = outcomeData.getCaseFileByLeadId.preventionDetails;
      const preventionActions = preventionDetails?.actions;
      const equipment = outcomeData.getCaseFileByLeadId.equipment;
      const wildlife = outcomeData.getCaseFileByLeadId.subject;
      let hasOutcome = false;

      if (assessmentDetails?.actionNotRequired !== null && assessmentDetails?.actionNotRequired !== undefined) {
        hasOutcome = true;
        await _applyAssessmentData(assessmentDetails, assessmentActions);
      }

      if (preventionDetails) {
        hasOutcome = true;
        await _applyPreventionData(preventionDetails, preventionActions);
      }

      if (equipment) {
        hasOutcome = true;
        await _applyEquipmentData(equipment);
      }

      if (wildlife) {
        hasOutcome = true;
        await _applyWildlifeData(wildlife);
      }

      if (outcomeData.getCaseFileByLeadId.note) {
        hasOutcome = true;
        await _applyNoteData(outcomeData.getCaseFileByLeadId);
      }

      if (outcomeData.getCaseFileByLeadId.isReviewRequired) {
        hasOutcome = true;
        await _applyReviewData(outcomeData.getCaseFileByLeadId);
      }

      outcomeData.getCaseFileByLeadId.hasOutcome = hasOutcome;

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
          .leftJoinAndSelect("complaint.linked_complaint_xref", "linked_complaint")
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
      data.outcome = await _getCaseData(id, token, tz);

      //-- get any updates a complaint may have
      data.updates = await _getUpdates(id);

      //-- find the linked complaints
      data.linkedComplaints = data.linkedComplaintIdentifier
        ? await this._linkedComplaintsXrefService.findParentComplaint(id) //if there is a linkedComplaintIdentifer it's parent
        : await this._linkedComplaintsXrefService.findChildComplaints(id); //otherwise there may or may not be children

      //-- helper flag to easily hide/show linked complaint section
      data.hasLinkedComplaints = data.linkedComplaints?.length > 0;

      //-- this is a workaround to hide empty rows in the carbone templates
      //-- It could possibly be removed if the CDOGS version of Carbone is updated
      if (data.privacyRequested) {
        data = { ...data, privacy: [{ value: data.privacyRequested }] };
      }
      if (data.outcome.decision?.leadAgencyLongDescription) {
        data = { ...data, agency: [{ value: data.outcome.decision.leadAgencyLongDescription }] };
      }
      if (data.outcome.decision?.inspectionNumber) {
        data = { ...data, inspection: [{ value: data.outcome.decision.inspectionNumber }] };
      }
      if (data.outcome.assessmentDetails?.locationType?.key) {
        data = { ...data, assessmentLocation: [{ value: data.outcome.assessmentDetails.locationType.key }] };
      }
      if (data.outcome.assessmentDetails?.conflictHistory?.key) {
        data = { ...data, conflict: [{ value: data.outcome.assessmentDetails.conflictHistory.key }] };
      }
      if (data.outcome.assessmentDetails?.categoryLevel?.key) {
        data = { ...data, category: [{ value: data.outcome.assessmentDetails.categoryLevel.key }] };
      }
      if (data.outcome.assessmentDetails?.legacyActions) {
        data = { ...data, legacy: [{ actions: data.outcome.assessmentDetails.legacyActions }] };
      }

      //-- problems in the automapper mean dates need to be handled
      //-- seperatly
      const current = new Date();
      data.reportDate = _applyTimezone(current, tz, "date");
      data.reportTime = _applyTimezone(current, tz, "time");
      data.generatedOn = `${data.reportDate} at ${data.reportTime}`;

      data.reportedOn = _applyTimezone(data.reportedOn, tz, "datetime");
      data.updatedOn = _applyTimezone(data.updatedOn, tz, "datetime");

      //CEEB Decision - No Action Array
      if (data.outcome.decision?.actionTakenDate) {
        data.outcome.decision.actionTakenDate = _applyTimezone(data.outcome.decision.actionTakenDate, tz, "date");
      }

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
