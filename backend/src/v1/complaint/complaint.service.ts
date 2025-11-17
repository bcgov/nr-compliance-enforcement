import { map } from "lodash";
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import Supercluster, { PointFeature } from "supercluster";
import { GeoJsonProperties } from "geojson";

import {
  applyAllegationComplaintMap,
  applyGeneralInfomationComplaintMap,
  applyWildlifeComplaintMap,
  applySectorComplaintMap,
  complaintToComplaintDtoMap,
  mapAllegationReport,
  mapGeneralIncidentReport,
  mapWildlifeReport,
} from "../../middleware/maps/automapper-entity-to-dto-maps";

import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { WildlifeComplaintDto } from "../../types/models/complaints/dtos/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/dtos/allegation-complaint";
///
import { Complaint } from "./entities/complaint.entity";
import { UpdateComplaintDto } from "../../types/models/complaints/dtos/update-complaint";

import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";

import { ComplaintDto } from "../../types/models/complaints/dtos/complaint";
import { CodeTableService } from "../code-table/code-table.service";
import { ComplaintUpdatesService } from "../complaint_updates/complaint_updates.service";
import {
  mapAllegationComplaintDtoToAllegationComplaint,
  mapAttractantXrefDtoToAttractantHwcrXref,
  mapComplaintDtoToComplaint,
  mapWildlifeComplaintDtoToHwcrComplaint,
  mapGirComplaintDtoToGirComplaint,
  mapSectorComplaintDtoToSectorComplaint,
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
  mapDelegateDtoToAppUserComplaintXrefTable,
} from "../../middleware/maps/dto-to-table-map";
import { DelegateDto } from "../../types/models/app_user/delegate";
import { AppUserComplaintXrefService } from "../app_user_complaint_xref/app_user_complaint_xref.service";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { AppUserComplaintXrefTable } from "../../types/tables/app-user-complaint-xref.table";
import { OfficeStats, OfficerStats, ZoneAtAGlanceStats } from "../../types/zone_at_a_glance/zone_at_a_glance_stats";
import { UUID, randomUUID } from "crypto";

import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { toDate, toZonedTime, format } from "date-fns-tz";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/dtos/gir-complaint";
import { SectorComplaintDto } from "../../types/models/complaints/dtos/sector-complaint";
import { ComplaintUpdateDto, ComplaintUpdateType } from "../../types/models/complaint-updates/complaint-update-dto";
import { WildlifeReportData } from "src/types/models/reports/complaints/wildlife-report-data";
import { AllegationReportData } from "src/types/models/reports/complaints/allegation-report-data";
import { RelatedDataDto } from "src/types/models/complaints/dtos/related-data";
import { CompMthdRecvCdAgcyCdXrefService } from "../comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.service";
import { AppUserService } from "../app_user/app_user.service";
import {
  caseFileQueryFields,
  get,
  getCosGeoOrgUnits,
  searchCosGeoOrgUnitsByNames,
  getAppUsers,
  getAppUserByUserId,
  getOfficeByGuid,
  getOfficeByGeoCode,
  searchAppUsers,
} from "../../external_api/shared_data";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";
import { Attachment, AttachmentType } from "../../types/models/general/attachment";
import { formatPhonenumber, getFileType } from "../../common/methods";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { GeneralIncidentReportData } from "src/types/models/reports/complaints/general-incident-report-data";
import { Role } from "../../enum/role.enum";
import { ComplaintDtoAlias } from "src/types/models/complaints/dtos/complaint-dto-alias";
import { ParkDto } from "../shared_data/dto/park.dto";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";
import { EventPublisherService } from "../event_publisher/event_publisher.service";

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
  @InjectRepository(SpeciesCode)
  private readonly _speciesRepository: Repository<SpeciesCode>;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectMapper() mapper,
    private readonly _codeTableService: CodeTableService,
    private readonly _compliantUpdatesService: ComplaintUpdatesService,
    private readonly _appUserComplaintXrefService: AppUserComplaintXrefService,
    private readonly _attractantService: AttractantHwcrXrefService,
    private readonly _compMthdRecvCdAgcyCdXrefService: CompMthdRecvCdAgcyCdXrefService,
    private readonly _appUserService: AppUserService,
    private readonly _linkedComplaintsXrefService: LinkedComplaintXrefService,
    private readonly dataSource: DataSource,
    private readonly eventPublisherService: EventPublisherService,
  ) {
    this.mapper = mapper;

    //-- ENTITY -> DTO
    complaintToComplaintDtoMap(mapper);
    applyWildlifeComplaintMap(mapper);
    applyAllegationComplaintMap(mapper);
    applyGeneralInfomationComplaintMap(mapper);
    applySectorComplaintMap(mapper);

    //-- DTO -> ENTITY
    mapComplaintDtoToComplaint(mapper);
    mapWildlifeComplaintDtoToHwcrComplaint(mapper);
    mapGirComplaintDtoToGirComplaint(mapper);
    mapAllegationComplaintDtoToAllegationComplaint(mapper);
    mapSectorComplaintDtoToSectorComplaint(mapper);
    mapComplaintDtoToComplaintTable(mapper);
    mapDelegateDtoToAppUserComplaintXrefTable(mapper);
    mapAttractantXrefDtoToAttractantHwcrXref(mapper);
  }

  private readonly _getAgencyByUser = async (token: string): Promise<string> => {
    const idir = getIdirFromRequest(this.request);

    const appUser = await getAppUserByUserId(token, idir);

    if (!appUser) {
      return null;
    }

    if (appUser.officeGuid) {
      const office = await getOfficeByGuid(token, appUser.officeGuid);
      if (office?.agencyCode) {
        return office.agencyCode;
      }
    }

    return null;
  };

  private _getSortTable = (column: string): string => {
    switch (column) {
      case "species_code":
      case "hwcr_complaint_nature_code":
        return "wildlife";
      case "last_name":
        // last_name sorting is handled via GraphQL API in applyLastNameSort method
        return "complaint";
      case "gir_type_code":
        return "general";
      case "violation_code":
      case "in_progress_ind":
        return "allegation";
      case "area_name":
        // Since this column exists in the shared schema, sort is handled in the search method.
        return "complaint";
      case "complaint_identifier":
      default:
        return "complaint";
    }
  };

  // Fetches geo org units from GraphQL and returns a map of areaCode sorted by area_name
  private async getAreaNameSortMap(token: string): Promise<Map<string, number>> {
    try {
      const cosGeoOrgUnits = await getCosGeoOrgUnits(token);

      const sorted = [...cosGeoOrgUnits].sort((a, b) => {
        const areaA = (a.areaName || "").toLowerCase();
        const areaB = (b.areaName || "").toLowerCase();
        return areaA.localeCompare(areaB);
      });

      const sortMap = new Map<string, number>();
      for (const [index, unit] of sorted.entries()) {
        if (unit.areaCode) {
          sortMap.set(unit.areaCode, index);
        }
      }

      return sortMap;
    } catch (error) {
      this.logger.error(`Error building area name sort map: ${error}`);
      return new Map();
    }
  }

  // Applies area_name sorting to a query builder using a CASE statement
  private applyAreaNameSort(
    builder: SelectQueryBuilder<any>,
    sortMap: Map<string, number>,
    orderBy: "ASC" | "DESC",
  ): void {
    if (sortMap.size === 0) {
      builder.orderBy("complaint.complaint_identifier", orderBy);
      return;
    }

    let caseStatement = "(CASE complaint.geo_organization_unit_code ";

    for (const [areaCode, position] of sortMap) {
      caseStatement += `WHEN '${areaCode.replaceAll("'", "''")}' THEN ${position} `;
    }
    caseStatement += "ELSE 9999 END)";

    builder.addSelect(caseStatement, "area_sort_order");
    builder.orderBy("area_sort_order", orderBy);
    builder.addOrderBy("complaint.incident_reported_utc_timestmp", "DESC");
  }

  // Fetches app users from GraphQL and returns a map of app_user_guid sorted by last_name
  private async getLastNameSortMap(token: string): Promise<Map<string, number>> {
    try {
      const appUsers = await getAppUsers(token);

      const sorted = [...appUsers].sort((a, b) => {
        const lastNameA = (a.lastName || "").toLowerCase();
        const lastNameB = (b.lastName || "").toLowerCase();
        return lastNameA.localeCompare(lastNameB);
      });

      const sortMap = new Map<string, number>();
      for (const [index, user] of sorted.entries()) {
        if (user.appUserGuid) {
          sortMap.set(user.appUserGuid, index);
        }
      }

      return sortMap;
    } catch (error) {
      this.logger.error(`Error building last name sort map: ${error}`);
      return new Map();
    }
  }

  // Applies last_name sorting to a query builder using a CASE statement
  private applyLastNameSort(
    builder: SelectQueryBuilder<any>,
    sortMap: Map<string, number>,
    orderBy: "ASC" | "DESC",
  ): void {
    if (sortMap.size === 0) {
      builder.orderBy("complaint.complaint_identifier", orderBy);
      return;
    }

    let caseStatement = "(CASE delegate.app_user_guid_ref ";

    for (const [appUserGuid, position] of sortMap) {
      caseStatement += `WHEN '${appUserGuid.replaceAll("'", "''")}' THEN ${position} `;
    }
    caseStatement += "ELSE 9999 END)";

    builder.addSelect(caseStatement, "last_name_sort_order");
    builder.orderBy("last_name_sort_order", orderBy);
    builder.addOrderBy("complaint.incident_reported_utc_timestmp", "DESC");
  }

  private readonly _generateMapQueryBuilder = (
    type: COMPLAINT_TYPE,
    includeCosOrganization: boolean,
    count: boolean,
    excludeCOSEnforcement?: boolean,
    agencies?: string[],
    showReferrals?: boolean,
  ): SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint> => {
    let builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>;

    switch (type) {
      case "ERS":
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoin("allegation.complaint_identifier", "complaint")
          .leftJoin("allegation.violation_code", "violation_code")
          .leftJoin("complaint.complaint_referral", "complaint_referral");

        if (excludeCOSEnforcement) {
          builder.andWhere(
            `(complaint.owned_by_agency_code_ref != 'COS'
              OR (:showReferrals = true AND complaint_referral.referred_by_agency_code_ref IN (:...agency_codes)))`,
            { showReferrals, agency_codes: agencies },
          );
        }
        break;
      case "GIR":
        builder = this._girComplaintRepository
          .createQueryBuilder("general")
          .leftJoin("general.complaint_identifier", "complaint")
          .leftJoin("general.gir_type_code", "gir")
          .leftJoin("complaint.complaint_referral", "complaint_referral");
        break;
      case "HWCR":
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife")
          .leftJoin("wildlife.complaint_identifier", "complaint")
          .leftJoin("wildlife.species_code", "species_code")
          .leftJoin("wildlife.hwcr_complaint_nature_code", "complaint_nature_code")
          .leftJoin("wildlife.attractant_hwcr_xref", "attractants", "attractants.active_ind = true")
          .leftJoin("attractants.attractant_code", "attractant_code")
          .leftJoin("complaint.complaint_referral", "complaint_referral");
        break;
      case "SECTOR":
      default:
        if (excludeCOSEnforcement) {
          builder = this.complaintsRepository
            .createQueryBuilder("complaint")
            .leftJoin("complaint.complaint_referral", "complaint_referral")
            .andWhere(
              "NOT (complaint.owned_by_agency_code_ref = :agency AND complaint.complaint_type_code = :complaintType)",
              { agency: "COS", complaintType: "ERS" },
            );
        } else builder = this.complaintsRepository.createQueryBuilder("complaint");
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
      .leftJoin("complaint.complaint_type_code", "complaint_type")
      .leftJoin("complaint.reported_by_code", "reported_by")
      .leftJoin("complaint.complaint_update", "complaint_update")
      .leftJoin("complaint.action_taken", "action_taken")
      .leftJoin("complaint.linked_complaint_xref", "linked_complaint")
      .leftJoin("complaint.app_user_complaint_xref", "delegate", "delegate.active_ind = true")
      .leftJoin("delegate.app_user_complaint_xref_code", "delegate_code")
      .leftJoin("complaint.comp_mthd_recv_cd_agcy_cd_xref", "method_xref")
      .leftJoin("method_xref.complaint_method_received_code", "method_code");
    return builder;
  };

  private readonly _generateQueryBuilder = (
    type: COMPLAINT_TYPE,
    excludeCOSEnforcement?: boolean,
    agencies?: string[],
    showReferrals?: boolean,
  ): SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint> => {
    let builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>;
    switch (type) {
      case "ERS":
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint")
          .leftJoin("allegation.violation_code", "violation_code")
          .leftJoin("violation_code.violationAgencyXrefs", "violation_agency_xref")
          .leftJoin("complaint.complaint_referral", "complaint_referral")
          .addSelect([
            "violation_code.violation_code",
            "violation_code.short_description",
            "violation_code.long_description",
            "violation_agency_xref.agency_code_ref",
          ]);
        if (excludeCOSEnforcement) {
          builder.andWhere(
            `(complaint.owned_by_agency_code_ref != 'COS'
              OR (:showReferrals = true AND complaint_referral.referred_by_agency_code_ref IN (:...agency_codes)))`,
            { showReferrals, agency_codes: agencies },
          );
        }
        break;
      case "GIR":
        builder = this._girComplaintRepository
          .createQueryBuilder("general")
          .leftJoinAndSelect("general.complaint_identifier", "complaint")
          .leftJoin("general.gir_type_code", "gir")
          .leftJoin("complaint.complaint_referral", "complaint_referral")
          .addSelect(["gir.gir_type_code", "gir.short_description", "gir.long_description"]);
        break;
      case "HWCR":
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
          .leftJoinAndSelect("wildlife.complaint_identifier", "complaint")
          .leftJoin("wildlife.species_code", "species_code")
          .leftJoin("complaint.complaint_referral", "complaint_referral")
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
      case "SECTOR":
      default:
        if (excludeCOSEnforcement) {
          builder = this.complaintsRepository
            .createQueryBuilder("complaint")
            .andWhere(
              "NOT (complaint.owned_by_agency_code_ref = :agency AND complaint.complaint_type_code = :complaintType)",
              { agency: "COS", complaintType: "ERS" },
            );
        } else builder = this.complaintsRepository.createQueryBuilder("complaint");
        break;
    }

    builder
      .leftJoin("complaint.complaint_status_code", "complaint_status")
      .addSelect([
        "complaint_status.complaint_status_code",
        "complaint_status.short_description",
        "complaint_status.long_description",
      ])
      .leftJoin("complaint.complaint_type_code", "complaint_type")
      .addSelect([
        "complaint_type.complaint_type_code",
        "complaint_type.short_description",
        "complaint_type.long_description",
      ])
      .leftJoin("complaint.reported_by_code", "reported_by")
      .addSelect(["reported_by.reported_by_code", "reported_by.short_description", "reported_by.long_description"])

      .leftJoin("complaint.complaint_update", "complaint_update")
      .addSelect(["complaint_update.upd_detail_text", "complaint_update.complaint_identifier"])

      .leftJoin("complaint.action_taken", "action_taken")
      .addSelect(["action_taken.action_details_txt", "action_taken.complaint_identifier"])
      .leftJoinAndSelect("complaint.linked_complaint_xref", "linked_complaint")
      .leftJoinAndSelect("complaint.app_user_complaint_xref", "delegate", "delegate.active_ind = true")
      .leftJoinAndSelect("delegate.app_user_complaint_xref_code", "delegate_code")
      .leftJoinAndSelect("complaint.comp_mthd_recv_cd_agcy_cd_xref", "method_xref")
      .leftJoinAndSelect("method_xref.complaint_method_received_code", "method_code");
    return builder;
  };

  private async _applyFilters(
    builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>,
    {
      agency,
      complaintTypeFilter,
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
    token: string,
  ): Promise<SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>> {
    if (agency) {
      builder.andWhere("complaint.owned_by_agency_code_ref = :Agency", {
        Agency: agency,
      });
    }

    if (complaintTypeFilter) {
      builder.andWhere("complaint_type.complaint_type_code = :ComplaintTypeFilter", {
        ComplaintTypeFilter: complaintTypeFilter,
      });
    }

    if (community || zone || region) {
      try {
        // Fetch geo organization unit codes for zone/region/community filtering from GraphQL
        const cosGeoOrgUnits = await getCosGeoOrgUnits(token, zone, region);

        if (cosGeoOrgUnits && cosGeoOrgUnits.length > 0) {
          let filteredUnits = cosGeoOrgUnits;

          if (community) {
            filteredUnits = filteredUnits.filter((unit) => unit.areaCode === community);
          }

          if (zone) {
            filteredUnits = filteredUnits.filter((unit) => unit.zoneCode === zone);
          }

          if (region) {
            filteredUnits = filteredUnits.filter((unit) => unit.regionCode === region);
          }

          const geoCodes = [...new Set(filteredUnits.map((unit) => unit.areaCode))];
          builder.andWhere("complaint.geo_organization_unit_code IN (:...geoCodes)", { geoCodes });
        } else {
          this.logger.error(`No geo organization units found for filtering ${zone} ${region} ${community}`);
          builder.andWhere("1 = 0"); // no results
        }
      } catch (error) {
        this.logger.error(`Error fetching geo organization units for filtering: ${error}`);
      }
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
        .andWhere("delegate.app_user_complaint_xref_code = :Assignee", {
          Assignee: "ASSIGNEE",
        })
        .andWhere("delegate.app_user_guid = :AppUserGuid", {
          AppUserGuid: officerAssigned,
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
      case "HWCR": {
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
      default:
        // Sector complaints do not have specific fields to filter, so we skip this case
        break;
    }

    return builder;
  }

  private async _applySearch(
    builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>,
    complaintType: COMPLAINT_TYPE,
    query: string,
    token?: string,
  ): Promise<SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>> {
    let caseSearchData = [];
    let orgGeoCodes: string[] = [];
    let appUserGuids: string[] = [];

    // Search for organizations via GraphQL
    if (token) {
      try {
        const orgUnits = await searchCosGeoOrgUnitsByNames(
          token,
          query, // zone
          query, // region
          query, // area
          query, // office
          true,
        );

        if (orgUnits && orgUnits.length > 0) {
          orgGeoCodes = [...new Set(orgUnits.map((unit: any) => unit.areaCode))].filter(
            (code): code is string => typeof code === "string",
          );
        }
      } catch (error) {
        this.logger.error(`Error searching organization names: ${error}`);
      }

      // Search GraphQL for app users by name
      try {
        const matchingUsers = await searchAppUsers(token, query);
        if (matchingUsers && matchingUsers.length > 0) {
          appUserGuids = matchingUsers.map((user: any) => user.appUserGuid);
        }
      } catch (error) {
        this.logger.error(`Error searching app_users by name: ${error}`);
      }

      // Search CM for any case files that may match based on authorization id
      if (complaintType === "ERS" || complaintType === "HWCR") {
        const { data, errors } = await get(token, {
          query: `{getComplaintOutcomesBySearchString (complaintType: "${complaintType}" ,searchString: "${query}")
          {
            complaintId,
            complaintOutcomeGuid
          }
        }`,
        });

        if (errors) {
          this.logger.error("GraphQL errors:", errors);
          throw new Error("GraphQL errors occurred");
        }

        caseSearchData = data.getComplaintOutcomesBySearchString;
      }
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

        qb.orWhere("complaint.owned_by_agency_code_ref ILIKE :query", {
          query: `%${query}%`,
        });

        // Filter by organization codes from search results
        if (orgGeoCodes.length > 0) {
          qb.orWhere("complaint.geo_organization_unit_code IN (:...orgGeoCodes)", { orgGeoCodes });
        }

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
          case "HWCR": {
            //consider to remove? because other_attractants_text is not displayed in frontend
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
          case "SECTOR":
          default: {
            // Sector complaints do not have specific fields to search, so we skip this case
            break;
          }
        }

        if (caseSearchData.length > 0) {
          qb.orWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
            complaint_identifiers: caseSearchData.map((caseData) => caseData.complaintId),
          });
        }

        // Filter complaints by app_users found in name search
        if (appUserGuids.length > 0) {
          qb.orWhere("delegate.app_user_guid_ref IN (:...appUserGuids)", { appUserGuids });
        }

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

  private readonly _getTotalComplaintsByZone = async (
    complaintType: COMPLAINT_TYPE,
    zone: string,
    token: string,
  ): Promise<number> => {
    const agency = await this._getAgencyByUser(token);
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>;

    switch (complaintType) {
      case "ERS": {
        builder = this._allegationComplaintRepository
          .createQueryBuilder("allegation")
          .leftJoinAndSelect("allegation.complaint_identifier", "complaint");
        break;
      }
      case "HWCR": {
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
          .leftJoinAndSelect("wildlife.complaint_identifier", "complaint");
        break;
      }
    }

    // Get area codes for the zone from GraphQL
    try {
      const cosGeoOrgUnits = await getCosGeoOrgUnits(token, zone);
      const geoCodes = [...new Set(cosGeoOrgUnits.map((unit: any) => unit.areaCode))];

      builder
        .where("complaint.geo_organization_unit_code IN (:...geoCodes)", { geoCodes })
        .andWhere("complaint.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("complaint.owned_by_agency_code_ref = :agency", { agency: agency });
    } catch (error) {
      this.logger.error(`Error fetching area codes for zone ${zone}: ${error}`);
      throw error;
    }

    const result = await builder.getCount();

    return result;
  };

  private readonly _getTotalComplaintsByOffice = async (
    complaintType: COMPLAINT_TYPE,
    office: string,
    token: string,
  ): Promise<number> => {
    const agency = await this._getAgencyByUser(token);
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

    // Get area codes for the office location from GraphQL
    try {
      const cosGeoOrgUnits = await getCosGeoOrgUnits(token);
      const matchingUnits = cosGeoOrgUnits.filter((unit: any) => unit.officeLocationCode === office);

      const geoCodes = [...new Set(matchingUnits.map((unit: any) => unit.areaCode))];

      builder
        .where("complaint.geo_organization_unit_code IN (:...geoCodes)", { geoCodes })
        .andWhere("complaint.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("complaint.owned_by_agency_code_ref = :agency", { agency: agency });
    } catch (error) {
      this.logger.error(`Error fetching area codes for office ${office}: ${error}`);
      throw error;
    }

    return await builder.getCount();
  };

  private readonly _getTotalAssignedComplaintsByZone = async (
    complaintType: COMPLAINT_TYPE,
    zone: string,
    token: string,
  ): Promise<number> => {
    const agency = await this._getAgencyByUser(token);
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

    // Get area codes for the zone from GraphQL
    try {
      const cosGeoOrgUnits = await getCosGeoOrgUnits(token, zone);
      const geoCodes = [...new Set(cosGeoOrgUnits.map((unit: any) => unit.areaCode))];

      builder
        .innerJoinAndSelect(
          "complaint.app_user_complaint_xref",
          "app_user_complaint_xref",
          "app_user_complaint_xref.active_ind = true",
        )
        .where("complaint.geo_organization_unit_code IN (:...geoCodes)", { geoCodes })
        .andWhere("complaint.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("complaint.owned_by_agency_code_ref = :agency", { agency: agency });
    } catch (error) {
      this.logger.error(`Error fetching area codes for zone ${zone}: ${error}`);
      throw error;
    }

    const result = await builder.getCount();

    return result;
  };

  private readonly _getTotalAssignedComplaintsByOffice = async (
    complaintType: COMPLAINT_TYPE,
    office: string,
    token: string,
  ): Promise<number> => {
    const agency = await this._getAgencyByUser(token);
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

    // Get area codes for the office location from GraphQL
    try {
      const cosGeoOrgUnits = await getCosGeoOrgUnits(token);
      const matchingUnits = cosGeoOrgUnits.filter((unit: any) => unit.officeLocationCode === office);

      const geoCodes = [...new Set(matchingUnits.map((unit: any) => unit.areaCode))];

      builder
        .innerJoinAndSelect("complaint.app_user_complaint_xref", "app_user_xref")
        .where("complaint.geo_organization_unit_code IN (:...geoCodes)", { geoCodes })
        .andWhere("complaint.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("app_user_xref.active_ind = true")
        .andWhere("app_user_xref.app_user_complaint_xref_code = :assignee", { assignee: "ASSIGNEE" })
        .andWhere("complaint.owned_by_agency_code_ref = :agency", { agency: agency });
    } catch (error) {
      this.logger.error(`Error fetching area codes for office ${office}: ${error}`);
      throw error;
    }

    const result = await builder.getCount();

    return result;
  };

  private readonly _getOfficeIdByOrganizationUnitCode = async (code: string, token: string): Promise<UUID> => {
    try {
      const agency = await this._getAgencyByUser(token);
      const office = await getOfficeByGeoCode(token, code, agency);

      if (office) {
        return office.officeGuid as UUID;
      }
    } catch (error) {}
  };

  private readonly _getAppUsersByOffice = async (
    complaintType: COMPLAINT_TYPE,
    officeGuid: string,
    token: string,
  ): Promise<OfficerStats[]> => {
    let results: Array<OfficerStats> = [];

    try {
      const usersInOffice = await getAppUsers(token, [officeGuid]);

      for (const appUser of usersInOffice) {
        const assigned = await this._getTotalAssignedComplaintsByAppUser(complaintType, appUser.appUserGuid, token);

        let record = {
          name: `${appUser.lastName}, ${appUser.firstName}`,
          hwcrAssigned: complaintType === "HWCR" ? assigned : 0,
          allegationAssigned: complaintType === "ERS" ? assigned : 0,
          appUserGuid: appUser.appUserGuid,
        };

        results = [...results, record];
      }

      return results;
    } catch (error) {
      this.logger.error(`Error fetching app users by office ${officeGuid}: ${error}`);
      throw error;
    }
  };

  private readonly _getTotalAssignedComplaintsByAppUser = async (
    complaintType: string,
    appUserGuid: string,
    token: string,
  ): Promise<number> => {
    const agency = await this._getAgencyByUser(token);
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
        .leftJoinAndSelect("complaint.app_user_complaint_xref", "app_user_complaint_xref")
        .where("app_user_complaint_xref.active_ind = true")
        .andWhere("app_user_complaint_xref.app_user_complaint_xref_code = :assignee", { assignee: "ASSIGNEE" })
        .andWhere("app_user_complaint_xref.app_user_guid_ref = :appUserGuid", { appUserGuid })
        .andWhere("complaint.complaint_status_code = :status", {
          status: "OPEN",
        })
        .andWhere("complaint.owned_by_agency_code_ref = :agency", { agency: agency });

      return builder.getCount();
    } catch (error) {
      this.logger.error(`Error getting total assigned complaints for app user ${appUserGuid}: ${error}`);
      throw error;
    }
  };

  private readonly _getComplaintsByOffice = async (
    complaintType: COMPLAINT_TYPE,
    zone: string,
    token: string,
  ): Promise<OfficeStats[]> => {
    let results: OfficeStats[] = [];

    const cosGeoOrgUnits = await getCosGeoOrgUnits(token, zone, undefined, true);

    const officeLocationsInZone = cosGeoOrgUnits.map((unit) => ({
      code: unit.officeLocationCode,
      name: unit.officeLocationName,
    }));

    for (const officeLocation of officeLocationsInZone) {
      const { code, name } = officeLocation;

      const total = await this._getTotalComplaintsByOffice(complaintType, code, token);
      const assigned = await this._getTotalAssignedComplaintsByOffice(complaintType, code, token);
      const unassigned = total - assigned;

      const officeGuid = await this._getOfficeIdByOrganizationUnitCode(code, token);
      const appUsers = await this._getAppUsersByOffice(complaintType, officeGuid, token);

      const record: OfficeStats = {
        name,
        assigned,
        unassigned,
        officeGuid,
        appUsers,
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

  canViewComplaint = async (id: string, req?: any): Promise<boolean> => {
    return true; // Temporarily allow COS Enforcement complaints to be viewed by all agencies
    // Comment out the logic below until we have a requirement to restrict access again

    // let builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>;

    // try {
    //   builder = this.complaintsRepository
    //     .createQueryBuilder("complaint")
    //     .leftJoin("complaint.complaint_type_code", "complaint_type")
    //     .addSelect([
    //       "complaint_type.complaint_type_code",
    //       "complaint_type.short_description",
    //       "complaint_type.long_description",
    //     ]);

    //   builder.where("complaint.complaint_identifier = :id", { id });

    //   const res = await builder.getOne();
    //   const { owned_by_agency_code_ref, complaint_type_code } = res as Complaint;

    //   if (complaint_type_code.complaint_type_code === "ERS") {
    //     const hasCOSRole = hasRole(req, Role.COS);
    //     const collaborators = await this._personService.getCollaborators(id);
    //     const isCollab = collaborators.some(
    //       (collab: any) => collab.authUserGuid.split("-").join("") === req.user.idir_user_guid.toLowerCase(),
    //     );
    //     const isCOSComplaint = owned_by_agency_code_ref === "COS";
    //     if (isCOSComplaint) {
    //       if (!hasCOSRole && !isCollab) {
    //         return false;
    //       }
    //     }
    //   }
    //   return true;
    // } catch (e) {
    //   this.logger.error(e);
    // }
  };

  findById = async (
    id: string,
    complaintType?: COMPLAINT_TYPE,
    req?: any,
    token?: string,
  ): Promise<
    ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto | SectorComplaintDto
  > => {
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
          .leftJoin("complaint.complaint_type_code", "complaint_type")
          .addSelect([
            "complaint_type.complaint_type_code",
            "complaint_type.short_description",
            "complaint_type.long_description",
          ])
          .leftJoin("complaint.reported_by_code", "reported_by")
          .addSelect(["reported_by.reported_by_code", "reported_by.short_description", "reported_by.long_description"])
          .leftJoinAndSelect("complaint.app_user_complaint_xref", "delegate", "delegate.active_ind = true")
          .leftJoinAndSelect("delegate.app_user_complaint_xref_code", "delegate_code")
          .addSelect(["delegate.app_user_guid"])
          .leftJoinAndSelect("complaint.comp_mthd_recv_cd_agcy_cd_xref", "method_xref")
          .leftJoinAndSelect("method_xref.complaint_method_received_code", "method_code");
      }

      builder.where("complaint.complaint_identifier = :id", { id });
      const result = await builder.getOne();

      switch (complaintType) {
        case "ERS": {
          if (req) {
            const canViewComplaint = await this.canViewComplaint(id, req);
            if (!canViewComplaint) {
              throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
          }
          const complaint = this.mapper.map<AllegationComplaint, AllegationComplaintDto>(
            result as AllegationComplaint,
            "AllegationComplaint",
            "AllegationComplaintDto",
          );
          await this.setOrganization([complaint], token);
          return complaint;
        }
        case "GIR": {
          const complaint = this.mapper.map<GirComplaint, GeneralIncidentComplaintDto>(
            result as GirComplaint,
            "GirComplaint",
            "GeneralIncidentComplaintDto",
          );
          await this.setOrganization([complaint], token);
          return complaint;
        }
        case "HWCR": {
          const hwcr = this.mapper.map<HwcrComplaint, WildlifeComplaintDto>(
            result as HwcrComplaint,
            "HwcrComplaint",
            "WildlifeComplaintDto",
          );
          await this.setOrganization([hwcr], token);
          return hwcr;
        }
        case "SECTOR": {
          const sector = this.mapper.map<Complaint, SectorComplaintDto>(
            result as Complaint,
            "Complaint",
            "SectorComplaintDto",
          );
          await this.setSectorComplaintIssueType([sector]);
          await this.setOrganization([sector], token);
          return sector;
        }
        default: {
          const complaint = this.mapper.map<Complaint, ComplaintDto>(result as Complaint, "Complaint", "ComplaintDto");
          await this.setOrganization([complaint], token);
          return complaint;
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  };

  getSectorComplaintsByIds = async (ids: string[], token: string): Promise<SectorComplaintDto[]> => {
    let builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>;

    try {
      builder = this._generateQueryBuilder("SECTOR");

      builder.where({ complaint_identifier: In(ids) });
      const complaints = await builder.getMany();
      const sectorComplaints = this.mapper.mapArray<Complaint, SectorComplaintDto>(
        complaints as Array<Complaint>,
        "Complaint",
        "SectorComplaintDto",
      );
      await this.setSectorComplaintIssueType(sectorComplaints);
      await this.setOrganization(sectorComplaints, token);
      return sectorComplaints;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException("Unable to Perform Search", HttpStatus.BAD_REQUEST);
    }
  };

  private readonly _applyReferralFilters = (
    builder: SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>,
    status?: string,
    agencies?: string[],
    complaintType?: COMPLAINT_TYPE,
  ): SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint> => {
    // search for complaints based on the user's role
    // No agencies, no results
    if (!agencies?.length) {
      builder.andWhere("1 = 0");
      return builder;
    }

    // Handle referral status
    if (status === "REFERRED") {
      builder.andWhere(
        `complaint_referral.complaint_identifier IS NOT NULL
        AND complaint.owned_by_agency_code_ref NOT IN (:...agency_codes)
       AND complaint_referral.referred_by_agency_code_ref IS NOT NULL
       AND complaint_referral.referred_by_agency_code_ref IN (:...agency_codes)`,
        { agency_codes: agencies },
      );
      return builder;
    }

    // Handle non-sector complaints
    if (complaintType !== "SECTOR") {
      if (!status) {
        builder.andWhere(
          `(complaint.owned_by_agency_code_ref IN (:...agency_codes)
        OR (
          complaint_referral.referred_by_agency_code_ref IS NOT NULL
          AND complaint_referral.referred_by_agency_code_ref IN (:...agency_codes)
        )
        )`,
          { agency_codes: agencies },
        );
      } else {
        builder.andWhere("complaint.owned_by_agency_code_ref IN (:...agency_codes)", {
          agency_codes: agencies,
        });
      }
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

      const { showReferrals, orderBy, sortBy, page, pageSize, query, ...filters } = model;

      const skip = page && pageSize ? (page - 1) * pageSize : 0;
      const sortTable = this._getSortTable(sortBy);

      const sortString =
        sortBy !== "update_utc_timestamp" ? `${sortTable}.${sortBy}` : "complaint.comp_last_upd_utc_timestamp";

      //-- generate initial query
      // For SECTOR with compaint type based filters, use the filtered complaint type to generate the query builder
      let filterComplaintType: COMPLAINT_TYPE =
        complaintType === "SECTOR" && filters.complaintTypeFilter
          ? (filters.complaintTypeFilter as COMPLAINT_TYPE)
          : complaintType;

      //-- exclude COS's enforcement complaints in Sector view if the user does not have COS role
      const excludeCosEnforcement: boolean = !agencies.includes(Role.COS);

      let builder = this._generateQueryBuilder(filterComplaintType, excludeCosEnforcement, agencies, showReferrals);

      //-- apply filters if used
      if (Object.keys(filters).length !== 0) {
        builder = await this._applyFilters(builder, filters as ComplaintFilterParameters, filterComplaintType, token);
      }
      builder = this._applyReferralFilters(builder, filters?.status, agencies, complaintType);

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
        builder = await this._applySearch(builder, filterComplaintType, query, token);
      }

      //-- apply sort if provided
      if (sortBy && orderBy) {
        // Special handling for area_name sort since it's source is the GraphQL API
        if (sortBy === "area_name") {
          const areaSortMap = await this.getAreaNameSortMap(token);
          this.applyAreaNameSort(builder, areaSortMap, orderBy);
        } else if (sortBy === "last_name") {
          // Special handling for last_name sort since it's source is the GraphQL API
          const lastNameSortMap = await this.getLastNameSortMap(token);
          this.applyLastNameSort(builder, lastNameSortMap, orderBy);
        } else {
          builder
            .orderBy(sortString, orderBy, "NULLS LAST")
            .addOrderBy(
              "complaint.incident_reported_utc_timestmp",
              sortBy === "incident_reported_utc_timestmp" ? orderBy : "DESC",
            );
        }
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
            query: `{getComplaintOutcomesByComplaintId (complaintIds: [${ids.map((id) => '"' + id + '"').join(", ")}])
            ${caseFileQueryFields}
          }`,
          });
          if (errors) {
            this.logger.error("GraphQL errors:", errors);
            throw new Error("GraphQL errors occurred");
          }

          // inject the authorization id onto each complaint
          for (const item of items) {
            const complaintOutcome = data.getComplaintOutcomesByComplaintId.find(
              (file) => file.complaintId === item.id,
            );
            if (complaintOutcome?.authorization) {
              item.authorization =
                complaintOutcome.authorization.type !== "permit"
                  ? "UA" + complaintOutcome.authorization.value
                  : complaintOutcome.authorization.value;
            }
          }

          await this.setOrganization(items, token);
          results.complaints = items;
          break;
        }
        case "GIR": {
          const items = this.mapper.mapArray<GirComplaint, GeneralIncidentComplaintDto>(
            complaints as Array<GirComplaint>,
            "GirComplaint",
            "GeneralIncidentComplaintDto",
          );
          await this.setOrganization(items, token);
          results.complaints = items;
          break;
        }
        case "HWCR": {
          const items = this.mapper.mapArray<HwcrComplaint, WildlifeComplaintDto>(
            complaints as Array<HwcrComplaint>,
            "HwcrComplaint",
            "WildlifeComplaintDto",
          );

          await this.setOrganization(items, token);
          results.complaints = items;
          break;
        }
        case "SECTOR":
        default: {
          let baseComplaints: Array<Complaint>;

          if (filterComplaintType === "SECTOR") {
            baseComplaints = complaints as Array<Complaint>;
          } else {
            // Extract base complaint from specialized entities
            switch (filterComplaintType) {
              case "HWCR":
                baseComplaints = (complaints as Array<HwcrComplaint>).map((hwcr) => hwcr.complaint_identifier);
                break;
              case "ERS":
                baseComplaints = (complaints as Array<AllegationComplaint>).map((ers) => ers.complaint_identifier);
                break;
              case "GIR":
                baseComplaints = (complaints as Array<GirComplaint>).map((gir) => gir.complaint_identifier);
                break;
              default:
                baseComplaints = complaints as Array<Complaint>;
            }
          }

          const items = this.mapper.mapArray<Complaint, SectorComplaintDto>(
            baseComplaints,
            "Complaint",
            "SectorComplaintDto",
          );
          await this.setSectorComplaintIssueType(items);
          await this.setOrganization(items, token);
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

  setSectorComplaintIssueType = async (items: SectorComplaintDto[]): Promise<void> => {
    // This function gets all of the complaints that are in the items array for a given type
    const getComplaintsByType = (type: string) => {
      const builder = this._generateQueryBuilder(type as COMPLAINT_TYPE);
      const complaintIds: string[] = items.filter((item) => item.type === type).map((item) => item.id);
      builder.andWhere("complaint.complaint_identifier IN(:...complaint_identifiers)", {
        complaint_identifiers: complaintIds,
      });
      return (complaintIds.length > 0 && builder.getMany()) || Promise.resolve([]);
    };

    const getReferralsByIds = async () =>
      this._complaintReferralRepository.find({
        where: {
          complaint_identifier: In(items.map((item) => item.id)),
        },
        select: {
          referred_by_agency_code_ref: true,
        },
      });

    // Fetch all complaints by type concurrently
    const [referralComplaints, wildlifeComplaints, allegationComplaints, generalIncidentComplaints] = await Promise.all(
      [
        getReferralsByIds(),
        getComplaintsByType("HWCR") as Promise<HwcrComplaint[]>,
        getComplaintsByType("ERS") as Promise<AllegationComplaint[]>,
        getComplaintsByType("GIR") as Promise<GirComplaint[]>,
      ],
    );

    // Set the issueType for each item based on its type and the fetched complaints
    for (const item of items) {
      // Set referral agency codes
      const referrals = referralComplaints.filter((referral) => referral.complaint_identifier === item.id);
      if (referrals.length > 0) {
        item.referralAgency = referrals.map((referral) => referral.referred_by_agency_code_ref);
      }

      // Set issueType based on the complaint type
      if (item.type === "HWCR") {
        item.issueType = wildlifeComplaints.find(
          (c) => c.complaint_identifier.complaint_identifier === item.id,
        )?.hwcr_complaint_nature_code.hwcr_complaint_nature_code;
      } else if (item.type === "ERS") {
        item.issueType = allegationComplaints.find(
          (c) => c.complaint_identifier.complaint_identifier === item.id,
        )?.violation_code.violation_code;
      } else if (item.type === "GIR") {
        item.issueType = generalIncidentComplaints.find(
          (c) => c.complaint_identifier.complaint_identifier === item.id,
        )?.gir_type_code.gir_type_code;
      }
    }
  };

  setOrganization = async <
    T extends {
      organization?: { area: string; areaName: string; zone: string; region: string; officeLocation?: string };
    },
  >(
    complaints: T[],
    token: string,
  ): Promise<void> => {
    try {
      const areaCodes = [
        ...new Set(complaints.map((c) => c.organization?.area).filter((area) => area && area.trim() !== "")),
      ];

      // Get org data from GraphQL
      const orgUnits = await getCosGeoOrgUnits(token);

      // Create a map of area code to org data
      const orgDataMap = new Map();

      for (const areaCode of areaCodes) {
        const orgUnit = orgUnits.find((unit: any) => unit.areaCode === areaCode);
        if (orgUnit) {
          orgDataMap.set(areaCode, {
            region: orgUnit.regionCode || "",
            area: orgUnit.areaCode || "",
            areaName: orgUnit.areaName || "",
            officeLocation: orgUnit.officeLocationCode || "",
            zone: orgUnit.zoneCode || "",
          });
        }
      }

      // Add organization data to each complaint based on area code
      for (const complaint of complaints) {
        if (complaint.organization?.area) {
          const orgData = orgDataMap.get(complaint.organization.area);
          if (orgData) {
            complaint.organization.area = orgData.area;
            complaint.organization.areaName = orgData.areaName;
            complaint.organization.zone = orgData.zone;
            complaint.organization.region = orgData.region;
            complaint.organization.officeLocation = orgData.officeLocation;
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error adding organization data to complaints: ${error}`);
    }
  };

  findRelatedDataById = async (id: string): Promise<RelatedDataDto> => {
    try {
      const updates = await this._compliantUpdatesService.findByComplaintId(id);
      const actions = await this._compliantUpdatesService.findActionsByComplaintId(id);

      let fullResults: RelatedDataDto = { updates: updates, actions: actions };
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
  ): Promise<SelectQueryBuilder<complaintAlias> | SelectQueryBuilder<Complaint>> => {
    const { query, ...filters } = model;

    try {
      //-- search for complaints
      // Only these options require the cos_geo_org_unit_flat_mvw view (cos_organization), which is very slow.
      const includeCosOrganization: boolean = Boolean(query || filters.community || filters.zone || filters.region);

      // For SECTOR with compaint type based filters, use the filtered complaint type to generate the query builder
      const filterComplaintType: COMPLAINT_TYPE = filters.complaintTypeFilter
        ? (filters.complaintTypeFilter as COMPLAINT_TYPE)
        : complaintType;

      const excludeCosEnforcement: boolean = !agencies.includes(Role.COS);
      let builder = this._generateMapQueryBuilder(
        filterComplaintType,
        includeCosOrganization,
        count,
        excludeCosEnforcement,
        agencies,
        model.showReferrals,
      );

      //HERE 1

      //-- apply filters if used
      if (Object.keys(filters).length !== 0) {
        builder = await this._applyFilters(builder, filters as ComplaintFilterParameters, filterComplaintType, token);
      }

      //-- apply search
      if (query) {
        builder = await this._applySearch(builder, filterComplaintType, query, token);
      }
      builder = this._applyReferralFilters(builder, filters?.status, agencies, complaintType);

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

        for (const cluster of clusters) {
          cluster.properties.zoom = index.getClusterExpansionZoom(cluster.properties.cluster_id);
        }

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

  updateComplaintStatusById = async (id: string, status: string, token: string): Promise<ComplaintDto> => {
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
        this.eventPublisherService.publishComplaintStatusChangeEvents(id, status, complaint.type, token);
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
    model: ComplaintDtoAlias,
  ): Promise<ComplaintDtoAlias> => {
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
            const converted = this.mapper.map<DelegateDto, AppUserComplaintXrefTable>(
              assignee,
              "DelegateDto",
              "AppUserComplaintXrefTable",
            );
            converted.create_user_id = idir;
            converted.complaint_identifier = id;

            await this._appUserComplaintXrefService.assignNewAppUser(id, converted as any);
          } else {
            //-- the complaint has no assigned officer
            const unassigned = delegates.filter(({ isActive }) => !isActive);
            for (const officer of unassigned) {
              const converted = this.mapper.map<DelegateDto, AppUserComplaintXrefTable>(
                officer,
                "DelegateDto",
                "AppUserComplaintXrefTable",
              );

              converted.create_user_id = idir;
              converted.update_user_id = idir;
              converted.complaint_identifier = id;

              this._appUserComplaintXrefService.assignNewAppUser(id, converted as any);
            }
          }
        } else {
          await this._appUserComplaintXrefService.unAssignAppUser(id);
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

  create = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintDtoAlias,
    webeocInd?: boolean,
  ): Promise<ComplaintDtoAlias> => {
    this.logger.debug("Creating new complaint");
    const generateComplaintId = async (queryRunner: QueryRunner): Promise<string> => {
      let sequence;
      await queryRunner.manager.query("SELECT nextval('complaint.complaint_sequence')").then(function (returnData) {
        sequence = map(returnData, "nextval");
      });
      const prefix = format(new Date(), "yy");

      const complaintId = `${prefix}-${sequence}`;
      this.logger.debug(`Created new complaint ${complaintId}`);
      return complaintId;
    };

    const idir = webeocInd ? "webeoc" : getIdirFromRequest(this.request);

    const queryRunner = this.dataSource.createQueryRunner();
    let complaintId = "";

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      complaintId = await generateComplaintId(queryRunner);
      //-- convert the the dto from the client back into an entity
      //-- so that it can be used to create the comaplaint
      model.type = complaintType;
      let entity: Complaint = this.mapper.map<ComplaintDto, Complaint>(
        model as ComplaintDto,
        "ComplaintDto",
        "Complaint",
      );

      //-- apply audit user data
      entity.create_user_id = idir;
      entity.update_user_id = idir;
      entity.complaint_identifier = complaintId;
      entity.owned_by_agency_code_ref = model.ownedBy;
      entity.comp_last_upd_utc_timestamp = null; // do not want to set this value on a create

      const xref = await this._compMthdRecvCdAgcyCdXrefService.findByComplaintMethodReceivedCodeAndAgencyCode(
        model.complaintMethodReceivedCode,
        model.ownedBy,
      );

      entity.comp_mthd_recv_cd_agcy_cd_xref = xref;

      const complaint = await this.complaintsRepository.create(entity);
      await this.complaintsRepository.save(complaint);

      //-- if there are any asignees apply them to the complaint
      if (entity.app_user_complaint_xref) {
        const { app_user_complaint_xref } = entity;

        const selectedAssignee = app_user_complaint_xref.find(
          ({ app_user_complaint_xref_code: { app_user_complaint_xref_code }, active_ind }) =>
            app_user_complaint_xref_code === "ASSIGNEE" && active_ind,
        );

        if (selectedAssignee) {
          const { app_user_guid: id } = selectedAssignee;

          const assignee = {
            active_ind: true,
            app_user_guid: id,
            complaint_identifier: complaintId,
            app_user_complaint_xref_code: "ASSIGNEE",
            create_user_id: idir,
          } as any;

          await this._appUserComplaintXrefService.assignNewAppUser(complaintId, assignee);
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
            for (const { attractant } of attractants) {
              const record = {
                hwcr_complaint_guid: hwcrId,
                attractant_code: attractant,
                create_user_id: idir,
                update_user_id: idir,
              } as any;

              await this._attractantService.create(queryRunner, record);
            }
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

  getZoneAtAGlanceStatistics = async (
    complaintType: COMPLAINT_TYPE,
    zone: string,
    token: string,
  ): Promise<ZoneAtAGlanceStats> => {
    let results: ZoneAtAGlanceStats = { total: 0, assigned: 0, unassigned: 0 };

    const total = await this._getTotalComplaintsByZone(complaintType, zone, token);
    const assigned = await this._getTotalAssignedComplaintsByZone(complaintType, zone, token);
    const unassigned = total - assigned;

    const offices = (await this._getComplaintsByOffice(complaintType, zone, token)).filter((office) => {
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
          updatedAt: updatedAt,
          updateTime: zonedDate,
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
        select: {
          referred_by_agency_code_ref: true,
          referred_to_agency_code_ref: true,
          app_user_guid_ref: true,
          referral_date: true,
          referral_reason: true,
        },
      });

      const referrals = await Promise.all(
        referralsResult?.map(async (item) => {
          const standardTz = "America/Vancouver";
          const zonedReferralDate = toZonedTime(item.referral_date, standardTz);
          const updateOn = format(zonedReferralDate, "yyyy-MM-dd HH:mm");

          let lastName = "";
          let firstName = "";
          try {
            const appUser = await this._appUserService.findOne(item.app_user_guid_ref, token);
            if (appUser) {
              lastName = appUser.lastName || "";
              firstName = appUser.firstName || "";
            }
          } catch (error) {
            this.logger.error(`Failed to fetch app user ${item.app_user_guid_ref} for referral: ${error}`);
          }

          const record: ComplaintUpdateDto = {
            sequenceId: null,
            updateOn,
            updateTime: zonedReferralDate,
            updateType: ComplaintUpdateType.REFERRAL,
            referral: {
              previousAgency: item.referred_by_agency_code_ref,
              newAgency: item.referred_to_agency_code_ref,
              referredBy: {
                appUserGuid: item.app_user_guid_ref,
                lastName,
                firstName,
              },
              referralReason: item.referral_reason,
            },
          };
          return record;
        }) || [],
      );

      const actionTakenresult = await this._actionTakenRepository.find({
        where: {
          complaintIdentifier: {
            complaint_identifier: id,
          },
        },
        order: {
          actionUtcTimestamp: "DESC",
        },
      });

      const actions = actionTakenresult?.map((item) => {
        const utcDate = toDate(item.actionUtcTimestamp, { timeZone: "UTC" });
        const zonedDate = toZonedTime(utcDate, tz);
        const updatedOn = format(zonedDate, "yyyy-MM-dd", { timeZone: tz });
        const updatedAt = format(zonedDate, "HH:mm", { timeZone: tz });
        const record: ComplaintUpdateDto = {
          sequenceId: null,
          updateTime: zonedDate,
          updateOn: `${updatedOn} ${updatedAt}`,
          updateType: ComplaintUpdateType.ACTIONTAKEN,
          actionTaken: {
            actionDetailsTxt: item.actionDetailsTxt,
            loggedByTxt: item.loggedByTxt,
            actionLogged: `${updatedOn} ${updatedAt}`,
          },
        };
        return record;
      });

      const result = [...updates, ...referrals, ...actions].sort((left, right) => {
        return new Date(right.updateTime).valueOf() - new Date(left.updateTime).valueOf();
      });

      for (let index: number = 0; index < result.length; index++) {
        result[index].sequenceId = result.length - index;
      }

      return result;
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

    const _applyAssessmentData = async (assessment, assessmentActions, index) => {
      assessment.order = index + 1;
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

        const appUser = await this._appUserService.findByAuthUserGuid(assessment.assessmentActor, token);
        const { first_name, last_name, agency_code_ref } = appUser;
        const agencyTable = await this._codeTableService.getCodeTableByName("agency", token);
        const agency_code = agencyTable?.find((agency: any) => agency.agency === agency_code_ref)?.shortDescription;

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

          const { first_name, last_name } = await this._appUserService.findByAuthUserGuid(
            prevention.preventionActor,
            token,
          );

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
            this._appUserService.findByAuthUserGuid(setByAction.actor, token).then((result) => {
              const { first_name, last_name } = result;
              equip.setByActor = `${last_name}, ${first_name}`;
              equip.setByDate = setByAction.date;
            }),
          );
        }

        if (removedByAction?.actor) {
          officerPromises.push(
            this._appUserService.findByAuthUserGuid(removedByAction?.actor, token).then((result) => {
              const { first_name, last_name } = result;
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
            this._appUserService.findByAuthUserGuid(animal.officer, token).then((result) => {
              const { first_name, last_name } = result;
              animal.officer = `${last_name}, ${first_name}`;
            }),
          );
        }

        if (drugActor) {
          officerPromises.push(
            this._appUserService.findByAuthUserGuid(drugActor, token).then((result) => {
              const { first_name, last_name } = result;
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
        if (animal.drugs) {
          for (const drug of animal.drugs) {
            drug.officer = drugActor;
            drug.date = drugDate;
          }
        }

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
        const { first_name, last_name } = await this._appUserService.findByAuthUserGuid(note.actions[0].actor, token);

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
        const { first_name, last_name } = await this._appUserService.findByAuthUserGuid(
          caseFile.reviewComplete.actor,
          token,
        );
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
        query: `{getComplaintOutcomeByComplaintId (complaintId: "${id}")
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
        outcomeData.getComplaintOutcomeByComplaintId.authorization &&
        outcomeData.getComplaintOutcomeByComplaintId.authorization.type !== "permit"
      ) {
        outcomeData.getComplaintOutcomeByComplaintId.authorization.value =
          "UA" + outcomeData.getComplaintOutcomeByComplaintId.authorization.value;
      }

      const prevention = outcomeData.getComplaintOutcomeByComplaintId.prevention;
      const equipment = outcomeData.getComplaintOutcomeByComplaintId.equipment;
      const wildlife = outcomeData.getComplaintOutcomeByComplaintId.subject;
      const notes = outcomeData.getComplaintOutcomeByComplaintId.notes;

      let hasOutcome = false;

      if (outcomeData.getComplaintOutcomeByComplaintId?.assessment?.length > 0) {
        hasOutcome = true;
        for (const [index, assessment] of outcomeData.getComplaintOutcomeByComplaintId.assessment.entries()) {
          const assessmentActions = [
            ...(Array.isArray(assessment?.actions) ? assessment.actions : []),
            ...(Array.isArray(assessment?.cat1Actions) ? assessment.cat1Actions : []),
          ];

          await _applyAssessmentData(assessment, assessmentActions, index);
        }
      }

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

      if (outcomeData.getComplaintOutcomeByComplaintId.isReviewRequired) {
        hasOutcome = true;
        await _applyReviewData(outcomeData.getComplaintOutcomeByComplaintId);
      }

      outcomeData.getComplaintOutcomeByComplaintId.hasOutcome = hasOutcome;

      return outcomeData.getComplaintOutcomeByComplaintId;
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
          .leftJoin("complaint.complaint_type_code", "complaint_type")
          .addSelect([
            "complaint_type.complaint_type_code",
            "complaint_type.short_description",
            "complaint_type.long_description",
          ])
          .leftJoin("complaint.reported_by_code", "reported_by")
          .addSelect(["reported_by.reported_by_code", "reported_by.short_description", "reported_by.long_description"])
          .leftJoinAndSelect("complaint.linked_complaint_xref", "linked_complaint")
          .leftJoinAndSelect("complaint.app_user_complaint_xref", "delegate", "delegate.active_ind = true")
          .leftJoinAndSelect("delegate.app_user_complaint_xref_code", "delegate_code")
          .addSelect(["delegate.app_user_guid"]);
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

      //-- get officer assigned and organization data from GraphQL
      if (data.officerAssigned && data.officerAssigned !== "Not Assigned") {
        try {
          const appUser = await this._appUserService.findOne(data.officerAssigned, token);
          if (appUser) {
            data.officerAssigned = `${appUser.last_name}, ${appUser.first_name}`;
          }
        } catch (error) {
          this.logger.error(`Failed to fetch app user ${data.officerAssigned} for report: ${error}`);
          data.officerAssigned = "Not Assigned";
        }
      }

      //-- get community, office, zone, and region from GraphQL
      if (data.zone) {
        try {
          const cosGeoOrgUnits = await getCosGeoOrgUnits(token);

          const orgUnit = cosGeoOrgUnits.find((unit: any) => unit.areaCode === data.zone);

          if (orgUnit) {
            data.community = orgUnit.areaName || "";
            data.office = orgUnit.officeLocationName || "";
            data.zone = orgUnit.zoneName || "";
            data.region = orgUnit.regionName || "";
          }
        } catch (error) {
          this.logger.error(`Failed to fetch organization data for report: ${error}`);
        }
      }

      //-- get park data
      data.park = await _getParkData(data.parkGuid, token, tz);
      data.parkAreasFormatted = (data.park.parkAreas ?? []).filter((name) => name && name.trim() !== "").join(", ");

      //-- get any updates a complaint may have
      data.updates = await _getUpdates(id);

      //-- find the linked complaints
      const [parentComplaints, childComplaints] = await Promise.all([
        this._linkedComplaintsXrefService.findParentComplaint(id),
        this._linkedComplaintsXrefService.findChildComplaints(id),
      ]);

      const associatedComplaints = [...parentComplaints, ...childComplaints];

      //-- convert the agency name
      const agencyTable = await this._codeTableService.getCodeTableByName("agency", token);
      for (const complaint of associatedComplaints) {
        const agency_code = agencyTable?.find((agency: any) => agency.agency === complaint.agency)?.longDescription;
        complaint.agency = agency_code;
      }

      data.linkedComplaints = associatedComplaints.filter((item) => item.link_type === "LINK");
      data.duplicateComplaints = associatedComplaints.filter((item) => item.link_type === "DUPLICATE");

      //-- helper flag to easily hide/show linked complaint section
      data.hasLinkedComplaints = data.linkedComplaints?.length > 0;
      data.hasDuplicateComplaints = data.duplicateComplaints?.length > 0;

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
        for (const assessment of data.outcome.assessments) {
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
        }
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
