import { map } from "lodash";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

import {
  applyAllegationComplaintMap,
  applyWildlifeComplaintMap,
} from "../../middleware/maps/automapper-maps";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { WildlifeComplaintDto } from "../../types/models/complaints/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/allegation-complaint";
///
import { Complaint } from "./entities/complaint.entity";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";

import { COMPLAINT_TYPE } from "../../types/complaints/complaint-type";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";
import { ComplaintSearchParameters } from "src/types/models/complaints/complaint-search-parameters";
import { SearchResults } from "./models/search-results";
import { SearchParameters } from "src/types/models/general/search-parameters";
import { ComplaintFilterParameters } from "src/types/models/complaints/complaint-filter-parameters";

@Injectable()
export class ComplaintService {
  private readonly logger = new Logger(ComplaintService.name);
  private mapper: Mapper;

  @InjectRepository(HwcrComplaint)
  private _wildlifeComplaintRepository: Repository<HwcrComplaint>;
  @InjectRepository(AllegationComplaint)
  private _allegationComplaintRepository: Repository<AllegationComplaint>;

  @InjectRepository(AgencyCode)
  private _agencyRepository: Repository<AgencyCode>;
  @InjectRepository(Officer)
  private _officertRepository: Repository<Officer>;
  @InjectRepository(Office)
  private _officeRepository: Repository<Office>;

  @InjectRepository(Complaint)
  private complaintsRepository: Repository<Complaint>;

  constructor(@InjectMapper() mapper) {
    this.mapper = mapper;

    applyWildlifeComplaintMap(mapper);
    applyAllegationComplaintMap(mapper);
  }

  async create(
    complaint: string,
    queryRunner: QueryRunner
  ): Promise<Complaint> {
    try {
      const createComplaintDto: CreateComplaintDto = JSON.parse(complaint);

      const agencyCode = await this._getAgencyByUser(
        createComplaintDto.create_user_id
      );

      let referredByAgencyCode = createComplaintDto.referred_by_agency_code;
      let sequenceNumber;
      await queryRunner.manager
        .query("SELECT nextval('complaint_sequence')")
        .then(function (returnData) {
          sequenceNumber = map(returnData, "nextval");
        });
      const complaintId =
        new Date().getFullYear().toString().substring(2) + "-" + sequenceNumber;
      createComplaintDto.incident_reported_utc_timestmp = new Date();
      if (!createComplaintDto.incident_utc_datetime) {
        createComplaintDto.incident_utc_datetime = null;
      }
      createComplaintDto.complaint_identifier = complaintId;
      if (
        referredByAgencyCode !== null &&
        referredByAgencyCode.agency_code === ""
      ) {
        referredByAgencyCode = null;
      }
      const createData = {
        complaint_status_code: createComplaintDto.complaint_status_code,
        detail_text: createComplaintDto.detail_text,
        location_detailed_text: createComplaintDto.location_detailed_text,
        cos_geo_org_unit: createComplaintDto.cos_geo_org_unit,
        incident_utc_datetime: createComplaintDto.incident_utc_datetime,
        incident_reported_utc_timestmp:
          createComplaintDto.incident_reported_utc_timestmp,
        location_geometry_point: createComplaintDto.location_geometry_point,
        location_summary_text: createComplaintDto.location_summary_text,
        caller_name: createComplaintDto.caller_name,
        caller_email: createComplaintDto.caller_email,
        caller_address: createComplaintDto.caller_address,
        caller_phone_1: createComplaintDto.caller_phone_1,
        caller_phone_2: createComplaintDto.caller_phone_2,
        caller_phone_3: createComplaintDto.caller_phone_3,
        referred_by_agency_code: referredByAgencyCode,
        complaint_identifier: createComplaintDto.complaint_identifier,
        create_utc_timestamp: createComplaintDto.create_utc_timestamp,
        update_utc_timestamp: createComplaintDto.update_utc_timestamp,
        create_user_id: createComplaintDto.create_user_id,
        update_user_id: createComplaintDto.update_user_id,
        owned_by_agency_code: agencyCode,
      };

      const createdValue = await this.complaintsRepository.create(createData);
      return await queryRunner.manager.save(createdValue);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintsRepository.find({
      relations: {
        referred_by_agency_code: true,
        owned_by_agency_code: true,
        complaint_status_code: true,
      },
    });
  }

  async findOne(id: any): Promise<Complaint> {
    return this.complaintsRepository.findOneOrFail({
      where: { complaint_identifier: id },
      relations: {
        referred_by_agency_code: true,
        owned_by_agency_code: true,
        complaint_status_code: true,
      },
    });
  }

  async update(
    complaint_identifier: string,
    updateComplaintDto: UpdateComplaintDto
  ): Promise<Complaint> {
    await this.complaintsRepository.update(
      complaint_identifier,
      updateComplaintDto
    );
    return this.findOne(complaint_identifier);
  }

  async updateComplex(
    complaint_identifier: string,
    updateComplaint: string
  ): Promise<Complaint> {
    try {
      const updateComplaintDto: UpdateComplaintDto =
        JSON.parse(updateComplaint);
      let referredByAgencyCode = updateComplaintDto.referred_by_agency_code;
      if (
        referredByAgencyCode !== null &&
        referredByAgencyCode.agency_code === ""
      ) {
        referredByAgencyCode = null;
      }
      const updateData = {
        complaint_status_code: updateComplaintDto.complaint_status_code,
        detail_text: updateComplaintDto.detail_text,
        location_detailed_text: updateComplaintDto.location_detailed_text,
        cos_geo_org_unit: updateComplaintDto.cos_geo_org_unit,
        incident_utc_datetime: updateComplaintDto.incident_utc_datetime,
        location_geometry_point: updateComplaintDto.location_geometry_point,
        location_summary_text: updateComplaintDto.location_summary_text,
        caller_name: updateComplaintDto.caller_name,
        caller_email: updateComplaintDto.caller_email,
        caller_address: updateComplaintDto.caller_address,
        caller_phone_1: updateComplaintDto.caller_phone_1,
        caller_phone_2: updateComplaintDto.caller_phone_2,
        caller_phone_3: updateComplaintDto.caller_phone_3,
        referred_by_agency_code: referredByAgencyCode,
      };
      const updatedValue = await this.complaintsRepository.update(
        { complaint_identifier },
        updateData
      );
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    }
    return this.findOne(complaint_identifier);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.complaintsRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  private _getAgencyByUser = async (username: string): Promise<AgencyCode> => {
    const builder = this._officertRepository
      .createQueryBuilder("officer")
      .leftJoinAndSelect("officer.office_guid", "office")
      .leftJoinAndSelect("office.agency_code", "agency")
      .where("officer.user_id = :username", { username });

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

  private _generateQueryBuilder = (
    type: COMPLAINT_TYPE
  ): SelectQueryBuilder<HwcrComplaint | AllegationComplaint> => {
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
          .addSelect([
            "species_code.species_code",
            "species_code.short_description",
            "species_code.long_description",
          ])

          .leftJoin(
            "wildlife.hwcr_complaint_nature_code",
            "complaint_nature_code"
          )
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
        "delegate",
        "delegate.active_ind = true"
      )
      .leftJoinAndSelect("delegate.person_complaint_xref_code", "delegate_code")
      .leftJoinAndSelect(
        "delegate.person_guid",
        "person",
        "delegate.active_ind = true"
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

    switch (complaintType) {
      case "ERS": {
        if (violationCode) {
          builder.andWhere("allegation.violation_code = :ViolationCode", {
            ViolationCode: violationCode,
          });
        }
      }
      case "HWCR":
      default: {
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
      }
    }

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
          return this.mapper.mapArray<
            AllegationComplaint,
            AllegationComplaintDto
          >(
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

      throw NotFoundException;
    }
  };

  search = async (
    complaintType: COMPLAINT_TYPE,
    model: ComplaintSearchParameters
  ): Promise<SearchResults> => {
    try {
      const { orderBy, sortBy, page, pageSize, query, ...filters } = model;

      const skip = page && pageSize ? (page - 1) * pageSize : 0;
      const sortTable = this._getSortTable(sortBy);

      const sortString =
        sortBy !== "update_utc_timestamp"
          ? `${sortTable}.${sortBy}`
          : "_update_utc_timestamp";

      //-- generate initial query
      let builder = this._generateQueryBuilder(complaintType);

      //-- apply filters if used
      if (Object.keys(filters).length !== 0) {
        builder = this._applyFilters(
          builder,
          filters as ComplaintFilterParameters,
          complaintType
        );
      }

      //-- restrict complaints to the user assigned agency 
      
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
        page && pageSize
          ? await builder.skip(skip).take(pageSize).getManyAndCount()
          : await builder.getManyAndCount();

      let results: SearchResults = { totalCount: total, complaints: [] };

      switch (complaintType) {
        case "ERS": {
          const items = this.mapper.mapArray<
            AllegationComplaint,
            AllegationComplaintDto
          >(
            complaints as Array<AllegationComplaint>,
            "AllegationComplaint",
            "AllegationComplaintDto"
          );
          // results.complaints = items;
        }
        case "HWCR":
        default: {
          const items = this.mapper.mapArray<
            HwcrComplaint,
            WildlifeComplaintDto
          >(
            complaints as Array<HwcrComplaint>,
            "WildlifeComplaint",
            "WildlifeComplaintDto"
          );

          // results.complaints = items;
        }
      }

      return results;
    } catch (error) {
      throw NotFoundException;
    }
  };
}
