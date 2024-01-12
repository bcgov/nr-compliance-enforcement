import { map } from "lodash";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

import {
  applyAllegationComplaintMap,
  applyWildlifeComplaintMap,
  complaintToComplaintDtoMap,
} from "../../middleware/maps/automapper-entity-to-dto-maps";

import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { WildlifeComplaintDto } from "../../types/models/complaints/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/allegation-complaint";
///
import { Complaint } from "./entities/complaint.entity";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";

import { COMPLAINT_TYPE } from "../../types/complaints/complaint-type";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";

import { ComplaintDto } from "../../types/models/complaints/complaint";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { CodeTableService } from "../code-table/code-table.service";
import {
  mapAllegationComplaintDtoToAllegationComplaint,
  mapAttractantXrefDtoToAttractantHwcrXref,
  mapComplaintDtoToComplaint,
  mapWildlifeComplaintDtoToHwcrComplaint,
} from "../../middleware/maps/automapper-dto-to-entity-maps";

import { ComplaintSearchParameters } from "../../types/models/complaints/complaint-search-parameters";
import { SearchResults } from "./models/search-results";
import { ComplaintFilterParameters } from "../../types/models/complaints/complaint-filter-parameters";
import { REQUEST } from "@nestjs/core";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { MapSearchResults } from "../../types/complaints/map-search-results";
import {
  mapComplaintDtoToComplaintTable,
  mapDelegateDtoToPersonComplaintXrefTable,
} from "../../middleware/maps/dto-to-table-map";
import { DelegateDto } from "../../types/models/people/delegate";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { PersonComplaintXrefTable } from "../../types/tables/person-complaint-xref.table";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { randomUUID } from "crypto";
import { format } from "date-fns";

@Injectable({ scope: Scope.REQUEST })
export class ComplaintService {
  private readonly logger = new Logger(ComplaintService.name);
  private mapper: Mapper;

  @InjectRepository(HwcrComplaint)
  private _wildlifeComplaintRepository: Repository<HwcrComplaint>;
  @InjectRepository(AllegationComplaint)
  private _allegationComplaintRepository: Repository<AllegationComplaint>;

  @InjectRepository(AgencyCode)
  private _agencyRepository: Repository<AgencyCode>;
  @InjectRepository(ReportedByCode)
  private _reportedByRepository: Repository<ReportedByCode>;
  @InjectRepository(Officer)
  private _officertRepository: Repository<Officer>;
  @InjectRepository(Office)
  private _officeRepository: Repository<Office>;
  @InjectRepository(Office)
  private _complaintStatusCode: Repository<ComplaintStatusCode>;

  @InjectRepository(Complaint)
  private complaintsRepository: Repository<Complaint>;

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectMapper() mapper,
    private readonly _codeTableService: CodeTableService,
    private readonly _personService: PersonComplaintXrefService,
    private readonly _attractantService: AttractantHwcrXrefService,
    private dataSource: DataSource
  ) {
    this.mapper = mapper;

    //-- ENTITY -> DTO
    complaintToComplaintDtoMap(mapper);
    applyWildlifeComplaintMap(mapper);
    applyAllegationComplaintMap(mapper);

    //-- DTO -> ENTITY
    mapComplaintDtoToComplaint(mapper);
    mapWildlifeComplaintDtoToHwcrComplaint(mapper);
    mapAllegationComplaintDtoToAllegationComplaint(mapper);
    mapComplaintDtoToComplaintTable(mapper);
    mapDelegateDtoToPersonComplaintXrefTable(mapper);
    mapAttractantXrefDtoToAttractantHwcrXref(mapper);
  }

  // async create(complaint: string, queryRunner: QueryRunner): Promise<Complaint> {
  //   try {
  //     const createComplaintDto: CreateComplaintDto = JSON.parse(complaint);
  //     const agencyCode = await this._getAgencyByUser();

  //     let reportedByCode = createComplaintDto.reported_by_code;
  //     let sequenceNumber;
  //     await queryRunner.manager.query("SELECT nextval('complaint_sequence')").then(function (returnData) {
  //       sequenceNumber = map(returnData, "nextval");
  //     });
  //     const complaintId = new Date().getFullYear().toString().substring(2) + "-" + sequenceNumber;
  //     createComplaintDto.incident_reported_utc_timestmp = new Date();
  //     if (!createComplaintDto.incident_utc_datetime) {
  //       createComplaintDto.incident_utc_datetime = null;
  //     }
  //     createComplaintDto.complaint_identifier = complaintId;
  //     if (reportedByCode !== null && reportedByCode.reported_by_code === "") {
  //       reportedByCode = null;
  //     }
  //     const createData = {
  //       complaint_status_code: createComplaintDto.complaint_status_code,
  //       detail_text: createComplaintDto.detail_text,
  //       location_detailed_text: createComplaintDto.location_detailed_text,
  //       cos_geo_org_unit: createComplaintDto.cos_geo_org_unit,
  //       incident_utc_datetime: createComplaintDto.incident_utc_datetime,
  //       incident_reported_utc_timestmp: createComplaintDto.incident_reported_utc_timestmp,
  //       location_geometry_point: createComplaintDto.location_geometry_point,
  //       location_summary_text: createComplaintDto.location_summary_text,
  //       caller_name: createComplaintDto.caller_name,
  //       caller_email: createComplaintDto.caller_email,
  //       caller_address: createComplaintDto.caller_address,
  //       caller_phone_1: createComplaintDto.caller_phone_1,
  //       caller_phone_2: createComplaintDto.caller_phone_2,
  //       caller_phone_3: createComplaintDto.caller_phone_3,
  //       reported_by_code: reportedByCode,
  //       complaint_identifier: createComplaintDto.complaint_identifier,
  //       create_utc_timestamp: createComplaintDto.create_utc_timestamp,
  //       update_utc_timestamp: createComplaintDto.update_utc_timestamp,
  //       create_user_id: createComplaintDto.create_user_id,
  //       update_user_id: createComplaintDto.update_user_id,
  //       owned_by_agency_code: agencyCode,
  //     };

  //     const createdValue = await this.complaintsRepository.create(createData);
  //     return await queryRunner.manager.save(createdValue);
  //   } catch (err) {
  //     this.logger.error(err);
  //     throw new BadRequestException(err);
  //   }
  // }

  // async findAll(): Promise<Complaint[]> {
  //   return this.complaintsRepository.find({
  //     relations: {
  //       reported_by_code: true,
  //       owned_by_agency_code: true,
  //       complaint_status_code: true,
  //     },
  //   });
  // }

  // async findOne(id: any): Promise<Complaint> {
  //   return this.complaintsRepository.findOneOrFail({
  //     where: { complaint_identifier: id },
  //     relations: {
  //       reported_by_code: true,
  //       owned_by_agency_code: true,
  //       complaint_status_code: true,
  //     },
  //   });
  // }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.complaintsRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
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

  //-- refactors starts here
  private _getSortTable = (column: string): string => {
    switch (column) {
      case "species_code":
      case "hwcr_complaint_nature_code":
        return "wildlife";
      case "last_name":
        return "person";
      case "violation_code":
      case "in_progress_ind":
        return "allegation";
      case "complaint_identifier":
      default:
        return "complaint";
    }
  };

  private _generateQueryBuilder = (type: COMPLAINT_TYPE): SelectQueryBuilder<HwcrComplaint | AllegationComplaint> => {
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>;
    switch (type) {
      case "ERS":
        builder = this._allegationComplaintRepository
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
          ]);
        break;
      case "HWCR":
      default:
        builder = this._wildlifeComplaintRepository
          .createQueryBuilder("wildlife") //-- alias the hwcr_complaint
          .addSelect(
            "GREATEST(complaint.update_utc_timestamp,  wildlife.update_utc_timestamp)",
            "_update_utc_timestamp"
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
      .leftJoinAndSelect("delegate.person_guid", "person", "delegate.active_ind = true");

    return builder;
  };

  private _applyFilters(
    builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>,
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
    }: ComplaintFilterParameters,
    complaintType: COMPLAINT_TYPE
  ): SelectQueryBuilder<HwcrComplaint | AllegationComplaint> {
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
    builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint>,
    complaintType: COMPLAINT_TYPE,
    query: string
  ): SelectQueryBuilder<HwcrComplaint | AllegationComplaint> {
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
      })
    );

    return builder;
  }

  findAllByType = async (
    complaintType: COMPLAINT_TYPE
  ): Promise<Array<WildlifeComplaintDto> | Array<AllegationComplaintDto>> => {
    const builder = this._generateQueryBuilder(complaintType);
    const results = await builder.getMany();

    try {
      switch (complaintType) {
        case "ERS":
          return this.mapper.mapArray<AllegationComplaint, AllegationComplaintDto>(
            results as Array<AllegationComplaint>,
            "AllegationComplaint",
            "AllegationComplaintDto"
          );
        case "HWCR":
        default:
          return this.mapper.mapArray<HwcrComplaint, WildlifeComplaintDto>(
            results as Array<HwcrComplaint>,
            "WildlifeComplaint",
            "WildlifeComplaintDto"
          );
      }
    } catch (error) {
      this.logger.error(error);

      throw new NotFoundException();
    }
  };

  findById = async (
    id: string,
    complaintType?: COMPLAINT_TYPE
  ): Promise<ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto> => {
    let builder: SelectQueryBuilder<HwcrComplaint | AllegationComplaint> | SelectQueryBuilder<Complaint>;

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
      case "ERS": {
        return this.mapper.map<AllegationComplaint, AllegationComplaintDto>(
          result as AllegationComplaint,
          "AllegationComplaint",
          "AllegationComplaintDto"
        );
      }
      case "HWCR": {
        return this.mapper.map<HwcrComplaint, WildlifeComplaintDto>(
          result as HwcrComplaint,
          "HwcrComplaint",
          "WildlifeComplaintDto"
        );
      }
      default: {
        return this.mapper.map<Complaint, ComplaintDto>(result as Complaint, "Complaint", "ComplaintDto");
      }
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
        this.logger.log(`Unable to update complaint: ${id} complaint status to ${status}`);
        throw new HttpException(
          `Unable to update complaint: ${id} complaint status to ${status}`,
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
    } catch (error) {
      this.logger.log(`An Error occured trying to update complaint: ${id}, update status: ${status}`);
      this.logger.log(error);

      throw new HttpException(
        `Unable to update complaint: ${id} complaint status to ${status}`,
        HttpStatus.BAD_REQUEST
      );
    }
  };

  updateComplaintById = async (
    id: string,
    complaintType: string,
    model: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto> => {
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
      //-- so that it can be used to update the comaplaint
      let entity: Complaint | HwcrComplaint | AllegationComplaint = this.mapper.map<ComplaintDto, Complaint>(
        model as ComplaintDto,
        "ComplaintDto",
        "Complaint"
      );

      switch (complaintType) {
        case "ERS": {
          entity = this.mapper.map<AllegationComplaintDto, AllegationComplaint>(
            model as AllegationComplaintDto,
            "AllegationComplaintDto",
            "AllegationComplaint"
          );
          break;
        }
        case "HWCR":
        default: {
          entity = this.mapper.map<WildlifeComplaintDto, HwcrComplaint>(
            model as WildlifeComplaintDto,
            "WildlifeComplaintDto",
            "HwcrComplaint"
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
        "UpdateComplaintDto"
      );

      //set the audit field
      complaintTable.update_user_id = idir;
      console.log(complaintTable);

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
              "PersonComplaintXrefTable"
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
                "PersonComplaintXrefTable"
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
      this.logger.log(
        `An Error occured trying to update ${complaintType} complaint: ${id}, update details: ${JSON.stringify(model)}`
      );
      this.logger.log(error);

      throw new HttpException(`Unable to update complaint: ${id}`, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  };

  search = async (complaintType: COMPLAINT_TYPE, model: ComplaintSearchParameters): Promise<SearchResults> => {
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

      //-- only return complaints for the agency the user is associated with
      const agency = await this._getAgencyByUser();
      if (agency) {
        builder.andWhere("complaint.owned_by_agency_code.agency_code = :agency", { agency: agency.agency_code });
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
            sortBy === "incident_reported_utc_timestmp" ? orderBy : "DESC"
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
            "AllegationComplaintDto"
          );
          results.complaints = items;
          break;
        }
        case "HWCR":
        default: {
          const items = this.mapper.mapArray<HwcrComplaint, WildlifeComplaintDto>(
            complaints as Array<HwcrComplaint>,
            "HwcrComplaint",
            "WildlifeComplaintDto"
          );

          results.complaints = items;
          break;
        }
      }

      return results;
    } catch (error) {
      this.logger.log(error);
      throw new HttpException("Unable to Perform Search", HttpStatus.BAD_REQUEST);
    }
  };

  mapSearch = async (complaintType: COMPLAINT_TYPE, model: ComplaintSearchParameters): Promise<MapSearchResults> => {
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

      //-- filter locations without coordinates
      complaintBuilder.andWhere("ST_X(complaint.location_geometry_point) <> 0");
      complaintBuilder.andWhere("ST_Y(complaint.location_geometry_point) <> 0");

      //-- run query
      const mappedComplaints = await complaintBuilder.getMany();

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

      //-- filter locations without coordinates
      unMappedBuilder.andWhere("ST_X(complaint.location_geometry_point) = 0");
      unMappedBuilder.andWhere("ST_Y(complaint.location_geometry_point) = 0");

      //-- run query
      const unmappedComplaints = await unMappedBuilder.getCount();
      results = { ...results, unmappedComplaints };

      //-- map results
      switch (complaintType) {
        case "ERS": {
          const items = this.mapper.mapArray<AllegationComplaint, AllegationComplaintDto>(
            mappedComplaints as Array<AllegationComplaint>,
            "AllegationComplaint",
            "AllegationComplaintDto"
          );
          results.complaints = items;
          break;
        }
        case "HWCR":
        default: {
          const items = this.mapper.mapArray<HwcrComplaint, WildlifeComplaintDto>(
            mappedComplaints as Array<HwcrComplaint>,
            "HwcrComplaint",
            "WildlifeComplaintDto"
          );

          results.complaints = items;
          break;
        }
      }
      return results;
    } catch (error) {
      this.logger.log(error);
      throw new HttpException("Unable to Perform Search", HttpStatus.BAD_REQUEST);
    }
  };

  async create(
    complaintType: COMPLAINT_TYPE,
    model: WildlifeComplaintDto | AllegationComplaintDto
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto> {
    const generateComplaintId = async (queryRunner: QueryRunner): Promise<string> => {
      let sequence;
      await queryRunner.manager.query("SELECT nextval('complaint_sequence')").then(function (returnData) {
        sequence = map(returnData, "nextval");
      });
      const prefix = format(new Date(), "yy");

      const complaintId = `${prefix}-${sequence}`;
      return complaintId;
    };

    const idir = getIdirFromRequest(this.request);

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      queryRunner.connect();
      queryRunner.startTransaction();

      const complaintId = await generateComplaintId(queryRunner);

      //-- convert the the dto from the client back into an entity
      //-- so that it can be used to create the comaplaint
      let entity: Complaint = this.mapper.map<ComplaintDto, Complaint>(
        model as ComplaintDto,
        "ComplaintDto",
        "Complaint"
      );

      //-- apply audit user data
      entity.create_user_id = idir;
      entity.update_user_id = idir;
      entity.complaint_identifier = complaintId;

      const complaint = await this.complaintsRepository.create(entity);
      await this.complaintsRepository.save(complaint);

      //-- if there are any asignees apply them to the complaint
      if (entity.person_complaint_xref) {
        const { person_complaint_xref } = entity;

        const selectedAssignee = person_complaint_xref.find(
          ({ person_complaint_xref_code: { person_complaint_xref_code }, active_ind }) =>
            person_complaint_xref_code === "ASSIGNEE" && active_ind
        );
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

      switch (complaintType) {
        case "ERS": {
          const { violation, isInProgress, wasObserved, violationDetails } = model as AllegationComplaintDto;
          const ersId = randomUUID();

          const ers = { 
            allegation_complaint_guid: ersId,
            complaint_identifier: complaintId,
            violation_code: violation,
            in_progress_ind: isInProgress,
            observed_ind: wasObserved,
            suspect_witnesss_dtl_text: violationDetails,
            create_user_id: idir,
            update_user_id: idir,
          } as any

          const newAllegation = await this._allegationComplaintRepository.create(ers)
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

      const derp = await this.findById(complaintId, complaintType);

      return derp as WildlifeComplaintDto | AllegationComplaintDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // this.logger.log(
      //   `An Error occured trying to update ${complaintType} complaint: ${id}, update details: ${JSON.stringify(model)}`
      // );
      // this.logger.log(error);
      //throw new HttpException(`Unable to update complaint: ${id}`, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }

    return Promise.resolve(model);
  }
}
