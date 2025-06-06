import { map } from "lodash";
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { caseFileQueryFields, get } from "../../external_api/shared_data";
import Supercluster, { PointFeature } from "supercluster";
import { GeoJsonProperties } from "geojson";

import {
  applyAllegationComplaintMap,
  applyGeneralInfomationComplaintMap,
  applyWildlifeComplaintMap,
  complaintToComplaintDtoMap,
  mapAllegationReport,
  mapGeneralIncidentReport,
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
import { ComplaintUpdateDto, ComplaintUpdateType } from "../../types/models/complaint-updates/complaint-update-dto";
import { WildlifeReportData } from "src/types/models/reports/complaints/wildlife-report-data";
import { AllegationReportData } from "src/types/models/reports/complaints/allegation-report-data";
import { RelatedDataDto } from "src/types/models/complaints/related-data";
import { CompMthdRecvCdAgcyCdXrefService } from "../comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.service";
import { OfficerService } from "../officer/officer.service";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";
import { Attachment, AttachmentType } from "../../types/models/general/attachment";
import { formatPhonenumber, getFileType } from "../../common/methods";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { GeneralIncidentReportData } from "src/types/models/reports/complaints/general-incident-report-data";
import { Role } from "../../enum/role.enum";
import { dtoAlias } from "src/types/models/complaints/dtoAlias-type";
import { ParkDto } from "../shared_data/dto/park.dto";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";

const WorldBounds: Array<number> = [-180, -90, 180, 90];
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
  @InjectRepository(ComplaintReferral)
  private readonly _complaintReferralRepository: Repository<ComplaintReferral>;
  @InjectRepository(ActionTaken)
  private readonly _actionTakenRepository: Repository<ActionTaken>;
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
    private readonly dataSource: DataSource,
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
    count: boolean,
  ): SelectQueryBuilder<complaintAlias> => {
    let builder: SelectQueryBuilder<complaintAlias>;

    switch (type) {
      case "ERS":
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoin("allegation.complaint_identifier", "complaint")
          .leftJoin("allegation.violation_code", "violation_code");
        break;
      case "GIR":
        builder = this._girComplaintRepository
          .createQueryBuilder("general")
          .leftJoin("general.complaint_identifier", "complaint")
          .leftJoin("general.gir_type_code", "gir");
        break;
      case "HWCR":
      default:
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife")
          .leftJoin("wildlife.complaint_identifier", "complaint")
          .leftJoin("wildlife.species_code", "species_code")
          .leftJoin("wildlife.hwcr_complaint_nature_code", "complaint_nature_code")
          .leftJoin("wildlife.attractant_hwcr_xref", "attractants", "attractants.active_ind = true")
          .leftJoin("attractants.attractant_code", "attractant_code");
        break;
    }

    if (count) {
      builder.select("COUNT(DISTINCT complaint.complaint_identifier)", "count");
    } else {
      builder
        .select("complaint.complaint_identifier", "complaint_identifier")
        .distinctOn(["complaint.complaint_identifier"])
        .groupBy("complaint.complaint_identifier")
        .addSelect("complaint.location_geometry_point", "location_geometry_point");
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
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint")
          .leftJoin("allegation.violation_code", "violation_code")
          .leftJoin("violation_code.violationAgencyXrefs", "violation_agency_xref")
          .leftJoin("violation_agency_xref.agency_code", "agency_code")
          .addSelect([
            "violation_code.violation_code",
            "violation_code.short_description",
            "violation_code.long_description",
            "agency_code.agency_code",
          ]);
        break;
      case "GIR":
        builder = this._girComplaintRepository
          .createQueryBuilder("general")
          .leftJoinAndSelect("general.complaint_identifier", "complaint")
          .leftJoin("general.gir_type_code", "gir")
          .addSelect(["gir.gir_type_code", "gir.short_description", "gir.long_description"]);
        break;
      case "HWCR":
      default:
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
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
      park,
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

    if (park) {
      builder.andWhere("complaint.park_guid = :Park", {
        Park: park,
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

    if (status && status !== "REFERRED") {
      builder.andWhere("complaint.complaint_status_code = :Status", {
        Status: status,
      });
    }

    if (officerAssigned && officerAssigned === "Unassigned") {
      builder.andWhere("delegate.complaint_identifier IS NULL");
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
    let caseSearchData = [];
    if (complaintType === "ERS") {
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

      caseSearchData = data.getCasesFilesBySearchString;
    }

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
    outcomeActionedBy: string,
    startDate: Date | undefined,
    endDate: Date | undefined,
  ): Promise<string[]> => {
    const { data, errors } = await get(token, {
      query: `{getLeadsByOutcomeAnimal (outcomeAnimalCode: "${outcomeAnimalCode}", outcomeActionedByCode: "${outcomeActionedBy}", startDate: "${startDate}" , endDate: "${endDate}")}`,
    });
    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }
    const complaintIdentifiers = data.getLeadsByOutcomeAnimal.length > 0 ? data.getLeadsByOutcomeAnimal : ["-1"];
    return complaintIdentifiers;
  };

  private readonly _getComplaintsByEquipment = async (
    token: string,
    equipmentStatus: string,
    equipmentCodes: string[] | null,
  ): Promise<string[]> => {
    let equipmentCodeParam = "";
    if (equipmentCodes) {
      const formattedCodes = equipmentCodes.map((code) => `"${code}"`).join(", ");
      equipmentCodeParam = `equipmentCodes: [${formattedCodes}]`;
    }

    const { data, errors } = await get(token, {
      query: `{getLeadsByEquipment(equipmentStatus: "${equipmentStatus}"${
        equipmentCodeParam ? ", " + equipmentCodeParam : ""
      })}`,
    });
    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }
    const complaintIdentifiers = data.getLeadsByEquipment.length > 0 ? data.getLeadsByEquipment : ["-1"];
    return complaintIdentifiers;
  };

  private readonly _getComplaintsByParkArea = async (token: string, area: string): Promise<string[]> => {
    const { data, errors } = await get(token, {
      query: `{getParksByArea ( parkAreaGuid: "${area}") { parkGuid, name}}`,
    });
    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }
    const parkGuids = data.getParksByArea.length > 0 ? data.getParksByArea.map((park) => park.parkGuid) : ["-1"];
    return parkGuids;
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

  private readonly _applyReferralFilters = (
    builder: SelectQueryBuilder<complaintAlias>,
    status?: string,
    agencies?: string[],
  ): SelectQueryBuilder<complaintAlias> => {
    // Special handling for referral status
    if (status === "REFERRED") {
      builder.innerJoin("complaint.complaint_referral", "complaint_referral");
    } else {
      builder.leftJoin("complaint.complaint_referral", "complaint_referral");
    }

    // search for complaints based on the user's role
    if (agencies.length > 0) {
      if (!status) {
        builder.andWhere(
          "(complaint.owned_by_agency_code.agency_code IN (:...agency_codes) OR (complaint_referral.referred_by_agency_code.agency_code IS NOT NULL AND complaint_referral.referred_by_agency_code.agency_code IN (:...agency_codes)))",
          {
            agency_codes: agencies,
          },
        );
      } else if (status === "REFERRED") {
        builder.andWhere(
          "(complaint.owned_by_agency_code.agency_code NOT IN (:...agency_codes) AND (complaint_referral.referred_by_agency_code.agency_code IS NOT NULL AND complaint_referral.referred_by_agency_code.agency_code IN (:...agency_codes)))",
          {
            agency_codes: agencies,
          },
        );
      } else {
        builder.andWhere("complaint.owned_by_agency_code.agency_code IN (:...agency_codes)", {
          agency_codes: agencies,
        });
      }
    } else {
      builder.andWhere("1 = 0"); // In case of no agency, no rows will be returned
    }

    return builder;
  };

  search = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintSearchParameters,
    agencies: string[],
    token?: string,
  ): Promise<SearchResults> => {
    try {
      let results: SearchResults = { totalCount: 0, complaints: [] };

      const { orderBy, sortBy, page, pageSize, query, ...filters } = model;

      const skip = page && pageSize ? (page - 1) * pageSize : 0;
      const sortTable = this._getSortTable(sortBy);

      const sortString =
        sortBy !== "update_utc_timestamp" ? `${sortTable}.${sortBy}` : "complaint.comp_last_upd_utc_timestamp";

      //-- generate initial query
      let builder = this._generateQueryBuilder(complaintType);

      //-- apply filters if used
      if (Object.keys(filters).length !== 0) {
        builder = this._applyFilters(builder, filters as ComplaintFilterParameters, complaintType);
      }
      builder = this._applyReferralFilters(builder, filters?.status, agencies);

      // -- filter by complaint identifiers returned by case management if actionTaken filter is present
      if (agencies.includes("EPO") && filters.actionTaken) {
        const complaintIdentifiers = await this._getComplaintsByActionTaken(token, filters.actionTaken);

        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      // -- filter by complaint identifiers returned by case management if outcome animal filter is present
      if (
        (agencies.includes("COS") || agencies.includes(Role.PARKS)) &&
        (filters.outcomeAnimal || filters.outcomeAnimalStartDate)
      ) {
        const complaintIdentifiers = await this._getComplaintsByOutcomeAnimal(
          token,
          filters.outcomeAnimal,
          filters.outcomeActionedBy,
          filters.outcomeAnimalStartDate,
          filters.outcomeAnimalEndDate,
        );
        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }
      // -- filter by complaint identifiers returned by case management if equipment status or equipment type(equipmentCode) filter is present
      if ((agencies.includes("COS") || agencies.includes(Role.PARKS)) && filters.equipmentStatus) {
        const complaintIdentifiers = await this._getComplaintsByEquipment(
          token,
          filters.equipmentStatus,
          filters.equipmentTypes,
        );

        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      if (agencies.includes(Role.PARKS) && filters.area) {
        const parkIdentifiers = await this._getComplaintsByParkArea(token, filters.area);

        builder.andWhere("complaint.park_guid IN(:...park_guids)", {
          park_guids: parkIdentifiers,
        });
      }

      //-- apply search
      if (query) {
        builder = await this._applySearch(builder, complaintType, query, token);
      }

      //-- apply sort if provided
      if (sortBy && orderBy) {
        builder
          .orderBy(sortString, orderBy, "NULLS LAST")
          .addOrderBy(
            "complaint.incident_reported_utc_timestmp",
            sortBy === "incident_reported_utc_timestmp" ? orderBy : "DESC",
          );
      }

      //-- search and count
      const [complaints, total] = await builder.skip(skip).take(pageSize).getManyAndCount();
      results.totalCount = total;

      switch (complaintType) {
        case "ERS": {
          const items = this.mapper.mapArray<AllegationComplaint, AllegationComplaintDto>(
            complaints as Array<AllegationComplaint>,
            "AllegationComplaint",
            "AllegationComplaintDto",
          );

          // Get the authorization id from the case management system
          const ids = items.map((item) => item.id);
          const { data, errors } = await get(token, {
            query: `{getCaseFilesByLeadId (leadIdentifiers: [${ids.map((id) => '"' + id + '"').join(", ")}])
            ${caseFileQueryFields}
          }`,
          });
          if (errors) {
            this.logger.error("GraphQL errors:", errors);
            throw new Error("GraphQL errors occurred");
          }

          // inject the authorization id onto each complaint
          items.forEach((item) => {
            const caseFile = data.getCaseFilesByLeadId.find((file) => file.leadIdentifier === item.id);
            if (caseFile?.authorization) {
              item.authorization =
                caseFile.authorization.type !== "permit"
                  ? "UA" + caseFile.authorization.value
                  : caseFile.authorization.value;
            }
          });

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
      this.logger.error(error);
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
    agencies: string[],
    token?: string,
    count: boolean = false,
  ): Promise<SelectQueryBuilder<complaintAlias>> => {
    const { query, ...filters } = model;

    try {
      //-- search for complaints
      // Only these options require the cos_geo_org_unit_flat_mvw view (cos_organization), which is very slow.
      const includeCosOrganization: boolean = Boolean(query || filters.community || filters.zone || filters.region);
      let builder = this._generateMapQueryBuilder(complaintType, includeCosOrganization, count);

      //-- apply filters if used
      if (Object.keys(filters).length !== 0) {
        builder = this._applyFilters(builder, filters as ComplaintFilterParameters, complaintType);
      }

      //-- apply search
      if (query) {
        builder = await this._applySearch(builder, complaintType, query, token);
      }
      builder = this._applyReferralFilters(builder, filters?.status, agencies);

      // -- filter by complaint identifiers returned by case management if actionTaken filter is present
      if (agencies.includes("EPO") && filters.actionTaken) {
        const complaintIdentifiers = await this._getComplaintsByActionTaken(token, filters.actionTaken);
        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      // -- filter by complaint identifiers returned by case management if outcome animal filter is present
      if (
        (agencies.includes("COS") || agencies.includes("PARKS")) &&
        (filters.outcomeAnimal || filters.outcomeAnimalStartDate)
      ) {
        const complaintIdentifiers = await this._getComplaintsByOutcomeAnimal(
          token,
          filters.outcomeAnimal,
          filters.outcomeActionedBy,
          filters.outcomeAnimalStartDate,
          filters.outcomeAnimalEndDate,
        );
        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      // -- filter by complaint identifiers returned by case management if equipment type filter is present
      if ((agencies.includes("COS") || agencies.includes("PARKS")) && filters.equipmentStatus) {
        const complaintIdentifiers = await this._getComplaintsByEquipment(
          token,
          filters.equipmentStatus,
          filters.equipmentTypes,
        );
        builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
          complaint_identifiers: complaintIdentifiers,
        });
      }

      if (agencies.includes(Role.PARKS) && filters.area) {
        const parkIdentifiers = await this._getComplaintsByParkArea(token, filters.area);

        builder.andWhere("complaint.park_guid IN(:...park_guids)", {
          park_guids: parkIdentifiers,
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
    agencies: string[],
    token?: string,
  ): Promise<number> => {
    try {
      const builder = await this._generateFilteredMapQueryBuilder(complaintType, model, agencies, token, true);

      //-- filter for locations without coordinates
      builder.andWhere("ST_X(complaint.location_geometry_point) = 0");
      builder.andWhere("ST_Y(complaint.location_geometry_point) = 0");

      const results = await builder.getRawOne();
      return results.count ? Number(results.count) : 0;
    } catch (error) {
      this.logger.error(error);
    }
  };

  _getClusteredComplaints = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintMapSearchClusteredParameters,
    agencies: string[],
    token?: string,
  ): Promise<Array<PointFeature<GeoJsonProperties>>> => {
    try {
      const complaintBuilder = await this._generateFilteredMapQueryBuilder(complaintType, model, agencies, token);

      //-- filter locations without coordinates
      complaintBuilder.andWhere("complaint.location_geometry_point is not null");
      complaintBuilder.andWhere("ST_X(complaint.location_geometry_point) <> 0");
      complaintBuilder.andWhere("ST_Y(complaint.location_geometry_point) <> 0");

      //-- filter locations by bounding box if provided, otherwise default to the world
      //   geometry ST_MakeEnvelope(float xmin, float ymin, float xmax, float ymax, integer srid=unknown);
      const bbox = model.bbox ? model.bbox.split(",") : WorldBounds;
      complaintBuilder.andWhere(
        `complaint.location_geometry_point && ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326)`,
      );

      //-- run mapped query
      const mappedComplaints = await complaintBuilder.getRawMany();

      // convert to supercluster PointFeature array
      const points: Array<PointFeature<GeoJsonProperties>> = mappedComplaints.map((item) => {
        return {
          type: "Feature",
          properties: {
            cluster: false,
            id: item.complaint_identifier,
          },
          geometry: item.location_geometry_point,
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
    agencies: string[],
    token?: string,
  ): Promise<MapSearchResults> => {
    try {
      let results: MapSearchResults = {};
      // Get unmappable complaints if requested
      if (model.unmapped) {
        // run query and append to results
        const unmappedCount = await this._getUnmappedComplaintsCount(complaintType, model, agencies, token);
        results = { ...results, unmappedCount };
      }

      if (model.clusters) {
        const points = await this._getClusteredComplaints(complaintType, model, agencies, token);

        results.mappedCount = points.length;

        // load into Supercluster
        const index = new Supercluster({
          log: false,
          radius: 160,
          maxZoom: 16,
        });
        index.load(points);

        // cluster the results
        const bbox = model.bbox ? model.bbox.split(",") : WorldBounds;
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
              expansionZoom + 2, // At least 2 clusters plus an arbitrary 2 steps of zoom
            );
          }
          results.zoom = expansionZoom || 18; // If we can't expand the cluster, fully zoom to the point
          results.center = center;
        } else if (!model.bbox && clusters.length === 0) {
          // If we are doing a global search and there are no clusters, return the center of BC
          if (clusters.length === 0) {
            results.zoom = 5;
            results.center = [55.0, -125.0]; // Center of BC
          }
        }

        clusters.forEach((cluster) => {
          cluster.properties.zoom = index.getClusterExpansionZoom(cluster.properties.cluster_id);
        });

        // set the results
        results.clusters = clusters;
      }
      return results;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException("Unable to Perform Search", HttpStatus.BAD_REQUEST);
    }
  };

  // There is specific business logic around when a complaint is considered to be 'Updated'.
  // This business logic doesn't align with the standard update audit date in a couple of areas
  //     - When a complaint is new it is considered untouched and never updated
  //     - When case data associated with a complaint is modified the complaint is considered updated
  //     - When attachments are uploaded to a complaint or case the complaint is considered updated
  //     - Updates from webEOC are considered Updates, however Actions Taken are not
  // As a result this method can be called whenever you need to set the complaint as 'Updated'
  updateComplaintLastUpdatedDate = async (id: string): Promise<boolean> => {
    try {
      const idir = getIdirFromRequest(this.request);
      const timestamp = new Date();

      const result = await this.complaintsRepository
        .createQueryBuilder("complaint")
        .update()
        .set({ update_user_id: idir, comp_last_upd_utc_timestamp: timestamp })
        .where("complaint_identifier = :id", { id })
        .execute();

      //-- check to make sure that only one record was updated
      if (result.affected === 1) {
        return true;
      } else {
        this.logger.error(`Unable to update complaint: ${id}`);
        throw new HttpException(`Unable to update complaint: ${id}`, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    } catch (error) {
      this.logger.error(`An Error occured trying to update complaint: ${id}`);
      this.logger.error(error.response);

      throw new HttpException(`Unable to update complaint: ${id}}`, HttpStatus.BAD_REQUEST);
    }
  };

  updateComplaintStatusById = async (id: string, status: string): Promise<ComplaintDto> => {
    try {
      const idir = getIdirFromRequest(this.request);
      const timestamp = new Date();

      const statusCode = await this._codeTableService.getComplaintStatusCodeByStatus(status);
      const result = await this.complaintsRepository
        .createQueryBuilder("complaint")
        .update()
        .set({ complaint_status_code: statusCode, update_user_id: idir, comp_last_upd_utc_timestamp: timestamp })
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
    model: ComplaintDto | dtoAlias,
  ): Promise<dtoAlias> => {
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

      if (!model.parkGuid) {
        complaintTable.park_guid = null;
      }

      const xref = await this._compMthdRecvCdAgcyCdXrefService.findByComplaintMethodReceivedCodeAndAgencyCode(
        model.complaintMethodReceivedCode,
        agencyCode,
      );

      complaintTable.comp_mthd_recv_cd_agcy_cd_xref = xref;

      //set the audit fields
      complaintTable.update_user_id = idir;
      complaintTable.comp_last_upd_utc_timestamp = new Date();

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

            await this._personService.assignNewOfficer(id, converted as any);
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
        } else {
          await this._personService.unAssignOfficer(id);
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

            await this._attractantService.updateComplaintAttractants(entity as HwcrComplaint, attractants);

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

  create = async (complaintType: COMPLAINT_TYPE, model: dtoAlias, webeocInd?: boolean): Promise<dtoAlias> => {
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
      entity.comp_last_upd_utc_timestamp = null; // do not want to set this value on a create

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
        case "GIR": {
          const { girType } = model as GeneralIncidentComplaintDto;
          const girId = randomUUID();

          const gir = {
            gir_complaint_guid: girId,
            complaint_identifier: complaintId,
            gir_type_code: girType,
            create_user_id: idir,
            update_user_id: idir,
          } as any;

          const newGir = await this._girComplaintRepository.create(gir);
          await this._girComplaintRepository.save(newGir);
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

  getReportData = async (
    id: string,
    complaintType: COMPLAINT_TYPE,
    tz: string,
    token: string,
    attachments: Attachment[],
  ) => {
    let data;
    mapWildlifeReport(this.mapper, tz);
    mapAllegationReport(this.mapper, tz);
    mapGeneralIncidentReport(this.mapper, tz);
    let builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>;

    const _getUpdates = async (id: string) => {
      const builder = this._complaintUpdateRepository
        .createQueryBuilder("updates")
        .where({
          complaintIdentifier: {
            complaint_identifier: id,
          },
        })
        .leftJoin("updates.reported_by_code", "reported_by")
        .addSelect("reported_by.long_description")
        .orderBy({
          update_seq_number: "DESC",
        });

      const updatesResult = await builder.getMany();

      const updates = updatesResult?.map((item) => {
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
          caller: {
            name: item.updCallerName,
            primaryPhone: formatPhonenumber(item.updCallerPhone1),
            alternativePhone1: formatPhonenumber(item.updCallerPhone2),
            alternativePhone2: formatPhonenumber(item.updCallerPhone3),
            address: item.updCallerAddress,
            email: item.updCallerEmail,
            organizationReportingComplaint: item.reported_by_code?.long_description,
          },
          updateType: ComplaintUpdateType.UPDATE,
        };
        return record;
      });

      const referralsResult = await this._complaintReferralRepository.find({
        where: {
          complaint_identifier: id,
        },
        relations: {
          referred_by_agency_code: true,
          referred_to_agency_code: true,
          officer_guid: {
            person_guid: true,
          },
        },
        select: {
          referred_by_agency_code: {
            long_description: true,
          },
          referred_to_agency_code: {
            long_description: true,
          },
          officer_guid: {
            officer_guid: true,
            person_guid: {
              last_name: true,
              first_name: true,
            },
          },
          referral_date: true,
          referral_reason: true,
        },
      });

      const referrals = referralsResult?.map((item) => {
        const standardTz = "America/Vancouver";
        const zonedReferralDate = toZonedTime(item.referral_date, standardTz);
        const updateOn = format(zonedReferralDate, "yyyy-MM-dd HH:mm");
        const record: ComplaintUpdateDto = {
          sequenceId: null,
          updateOn,
          updateType: ComplaintUpdateType.REFERRAL,
          referral: {
            previousAgency: item.referred_by_agency_code.long_description,
            newAgency: item.referred_to_agency_code.long_description,
            referredBy: {
              officerGuid: item.officer_guid.officer_guid,
              lastName: item.officer_guid.person_guid.last_name,
              firstName: item.officer_guid.person_guid.first_name,
            },
            referralReason: item.referral_reason,
          },
        };
        return record;
      });

      const result = [...updates, ...referrals].sort((left, right) => {
        return new Date(right.updateOn).valueOf() - new Date(left.updateOn).valueOf();
      });

      for (let index: number = 0; index < result.length; index++) {
        result[index].sequenceId = result.length - index;
      }

      return result;
    };

    const _getActions = async (id: string) => {
      const result = await this._actionTakenRepository.find({
        where: {
          complaintIdentifier: {
            complaint_identifier: id,
          },
        },
        order: {
          actionUtcTimestamp: "DESC",
        },
      });

      const actions = result?.map((item) => {
        const utcDate = toDate(item.actionUtcTimestamp, { timeZone: "UTC" });
        const zonedDate = toZonedTime(utcDate, tz);
        let updatedOn = format(zonedDate, "yyyy-MM-dd", { timeZone: tz });
        let updatedAt = format(zonedDate, "HH:mm", { timeZone: tz });
        let record = {
          actionDetailsTxt: item.actionDetailsTxt,
          loggedByTxt: item.loggedByTxt,
          actionLogged: `${updatedOn} ${updatedAt}`,
        };
        return record;
      });

      return actions;
    };

    const _applyTimezone = (input: Date, tz: string, output: "date" | "time" | "datetime"): string => {
      if (!input) {
        return "N/A"; // No date, so just return a placeholder string for the report
      }

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

    const _applyAssessmentData = async (assessment, assessmentActions) => {
      //-- Convert booleans to Yes/No

      //Note this one is backwards since the variable is action NOT required but the report is action required
      assessment.actionNotRequired = assessment.actionNotRequired ? "No" : "Yes";

      assessment.contactedComplainant = assessment.contactedComplainant ? "Yes" : "No";

      assessment.attended = assessment.attended ? "Yes" : "No";

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

      assessment.actions = actions;
      assessment.legacyActions = legacyActions;

      //-- Convert Officer Guids to Names
      if (assessmentActions?.[0]?.actor) {
        assessment.assessmentActor = assessmentActions[0].actor;
        assessment.assessmentDate = assessmentActions[0].date;

        const officer = await this._officerService.findByAuthUserGuid(assessment.assessmentActor);
        const { first_name, last_name } = officer.person_guid;
        const agency_code = officer.agency_code?.short_description;

        assessment.assessmentActor = `${last_name}, ${first_name} (${agency_code})`;

        //Apply timezone and format date
        assessment.assessmentDate = _applyTimezone(assessment.assessmentDate, tz, "date");
      }
    };

    const _applyPreventionData = async (preventions) => {
      let preventionCount = 1;
      for (const prevention of preventions) {
        //-- Remove all inactive assessment and prevention actions
        let filteredActions = prevention.actions.filter((item) => item.activeIndicator === true);
        prevention.actions = filteredActions;

        //-- Convert Officer Guid to Names
        if (prevention?.actions[0]?.actor) {
          prevention.preventionActor = prevention.actions[0].actor;
          prevention.preventionDate = prevention.actions[0].date;

          const { first_name, last_name } = (await this._officerService.findByAuthUserGuid(prevention.preventionActor))
            .person_guid;

          prevention.preventionActor = `${last_name}, ${first_name}`;

          //Apply timezone and format date
          prevention.preventionDate = _applyTimezone(prevention.preventionDate, tz, "date");
          //give it a nice friendly number as nothing comes back from the GQL
          prevention.order = preventionCount;
          preventionCount++;
        }
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

        //-- Same for quantity
        equip.quantity = equip.quantity ? [{ value: equip.quantity }] : []; // Ensure quantity is an array

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

        if (animal.tags?.length > 0) {
          animal.tags = animal.tags
            .map((item) => {
              return `ID: ${item.identifier} (${item.earDescription} side)`;
            })
            .join("\n");
        } else {
          animal.tags = "";
        }
      }
      return wildlife;
    };

    const _applyNoteData = async (notes) => {
      let noteCount = 1;
      for (const note of notes) {
        //-- Convert Officer Guid to Name
        const { first_name, last_name } = (await this._officerService.findByAuthUserGuid(note.actions[0].actor))
          .person_guid;

        note.actions[0].actor = last_name + ", " + first_name;
        note.actions[0].date = _applyTimezone(note.actions[0].date, tz, "datetime");
        //give it a nice friendly number as nothing comes back from the GQL
        note.order = noteCount;
        noteCount++;
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

    const _getParkData = async (id: string, token: string, tz: string): Promise<ParkDto> => {
      if (!id) {
        return {
          parkGuid: null,
          externalId: "",
          name: "",
          legalName: "",
          parkAreas: [],
        };
      }

      const { data, errors } = await get(token, {
        query: `{park (parkGuid: "${id}")
        {
          parkGuid,
          externalId,
          name,
          legalName,
          parkAreas {
            parkAreaGuid
            name
            regionName
          }
        }
      }`,
      });

      if (errors) {
        this.logger.error("GraphQL errors:", errors);
        throw new Error("GraphQL errors occurred");
      }

      if (data?.park?.parkGuid) {
        return {
          parkGuid: data.park.parkGuid,
          externalId: data.park.externalId,
          name: data.park.name,
          legalName: data.park.legalName,
          parkAreas: data.park.parkAreas?.map((area) => area.name) ?? [],
        };
      } else {
        this.logger.debug(`No park found for id: ${id}.`);
        return {
          parkGuid: null,
          externalId: "",
          name: "",
          legalName: "",
          parkAreas: [],
        };
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

      const prevention = outcomeData.getCaseFileByLeadId.prevention;
      const equipment = outcomeData.getCaseFileByLeadId.equipment;
      const wildlife = outcomeData.getCaseFileByLeadId.subject;
      const notes = outcomeData.getCaseFileByLeadId.notes;

      let hasOutcome = false;

      if (outcomeData.getCaseFileByLeadId?.assessment?.length > 0) {
        hasOutcome = true;
        await outcomeData.getCaseFileByLeadId.assessment.forEach(async (assessment) => {
          const assessmentActions = [
            ...(Array.isArray(assessment?.actions) ? assessment.actions : []),
            ...(Array.isArray(assessment?.cat1Actions) ? assessment.cat1Actions : []),
          ];

          await _applyAssessmentData(assessment, assessmentActions);
        });
      }

      this.logger.debug("Prevention data", prevention);
      if (prevention) {
        hasOutcome = true;
        await _applyPreventionData(prevention);
      }

      if (equipment) {
        hasOutcome = true;
        await _applyEquipmentData(equipment);
      }

      if (wildlife) {
        hasOutcome = true;
        await _applyWildlifeData(wildlife);
      }

      if (notes) {
        hasOutcome = true;
        await _applyNoteData(notes);
      }

      if (outcomeData.getCaseFileByLeadId.isReviewRequired) {
        hasOutcome = true;
        await _applyReviewData(outcomeData.getCaseFileByLeadId);
      }

      outcomeData.getCaseFileByLeadId.hasOutcome = hasOutcome;

      return outcomeData.getCaseFileByLeadId;
    };

    const _multiFieldCompare = (first: any, second: any, compareInfo: { field: string; sort: string }[]): number => {
      for (const item of compareInfo) {
        if (item.sort === "asc") {
          if (first[item.field] < second[item.field]) {
            return -1;
          }
          if (first[item.field] > second[item.field]) {
            return 1;
          }
        } else if (item.sort === "desc") {
          if (first[item.field] > second[item.field]) {
            return -1;
          }
          if (first[item.field] < second[item.field]) {
            return 1;
          }
        }
      }
      return 0;
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
          mapGeneralIncidentReport(this.mapper, tz);

          data = this.mapper.map<GirComplaint, GeneralIncidentReportData>(
            result as GirComplaint,
            "GirComplaint",
            "GeneralIncidentReportData",
          );
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

      //-- get park data
      data.park = await _getParkData(data.parkGuid, token, tz);
      data.parkAreasFormatted = (data.park.parkAreas ?? []).filter((name) => name && name.trim() !== "").join(", ");

      //-- get any updates a complaint may have
      data.updates = await _getUpdates(id);

      // -- get any webeoc callce tner actions on the complaint
      data.actions = await _getActions(id);

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
      if (data.outcome.assessments) {
        data.outcome.assessments.forEach((assessment) => {
          if (assessment.locationType?.key) {
            data.assessmentLocation.push({ value: assessment.locationType.key });
          }
          if (assessment.conflictHistory?.key) {
            data.conflict.push({ value: assessment.conflictHistory.key });
          }
          if (assessment.categoryLevel?.key) {
            data.category.push({ value: assessment.categoryLevel.key });
          }
          if (assessment.legacyActions) {
            data.legacy.push({ actions: assessment.legacyActions });
          }
        });
      }
      if (data.outcome.decision?.ipmAuthCategoryLongDescription) {
        data = { ...data, authCat: [{ value: data.outcome.decision.ipmAuthCategoryLongDescription }] };
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
      // Using short names like "cAtts" and "oAtts" to fit them in CDOGS template table cells
      data.cAtts = attachments
        .filter((item) => item.type === AttachmentType.COMPLAINT_ATTACHMENT)
        .map((item) => {
          return {
            name: item.name,
            date: item.date,
            fileType: getFileType(item.name),
          };
        })
        .sort((first, second) =>
          _multiFieldCompare(first, second, [
            { field: "fileType", sort: "asc" },
            { field: "date", sort: "asc" },
          ]),
        );
      data.hasComplaintAttachments = data.cAtts?.length > 0;

      data.oAtts = attachments
        .filter((item) => item.type === AttachmentType.OUTCOME_ATTACHMENT)
        .map((item) => {
          return {
            name: item.name,
            date: item.date,
            fileType: getFileType(item.name),
          };
        })
        .sort((first, second) =>
          _multiFieldCompare(first, second, [
            { field: "fileType", sort: "asc" },
            { field: "date", sort: "asc" },
          ]),
        );

      data.hasOutcomeAttachments = data.oAtts?.length > 0;

      return data;
    } catch (error) {
      this.logger.error(error);
    }
  };
}
