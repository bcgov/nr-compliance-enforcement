import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { CreateAllegationComplaintDto } from "./dto/create-allegation_complaint.dto";
import { UpdateAllegationComplaintDto } from "./dto/update-allegation_complaint.dto";
import { AllegationComplaint } from "./entities/allegation_complaint.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UUID } from "crypto";
import { ComplaintService } from "../complaint/complaint.service";
import { CreateComplaintDto } from "../complaint/dto/create-complaint.dto";

@Injectable()
export class AllegationComplaintService {

  private readonly logger = new Logger(AllegationComplaintService.name);

  constructor(private dataSource: DataSource) {}
  @InjectRepository(AllegationComplaint)
  private allegationComplaintsRepository: Repository<AllegationComplaint>;
  @Inject(ComplaintService)
  protected readonly complaintService: ComplaintService;

  async create(allegationComplaint: any): Promise<AllegationComplaint> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newAllegationComplaint;
    try {
      await this.complaintService.create(
        <CreateComplaintDto>allegationComplaint,
        queryRunner
      );
      newAllegationComplaint = await this.allegationComplaintsRepository.create(
        <CreateAllegationComplaintDto>allegationComplaint
      );
      await queryRunner.manager.save(newAllegationComplaint);
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newAllegationComplaint;
  }

  async findAll(
    sortColumn: string,
    sortOrder: string
  ): Promise<AllegationComplaint[]> {
    //compiler complains if you don't explicitly set the sort order to 'DESC' or 'ASC' in the function
    const sortOrderString = sortOrder === "DESC" ? "DESC" : "ASC";
    const sortTable = (sortColumn === 'complaint_identifier' || sortColumn === 'violation_code' || sortColumn === 'in_progress_ind') ? 'allegation_complaint.' : 'complaint_identifier.';
    const sortString =  sortColumn !== 'update_timestamp' ? sortTable + sortColumn : 'GREATEST(complaint_identifier.update_timestamp, allegation_complaint.update_timestamp)';
    return this.allegationComplaintsRepository.createQueryBuilder('allegation_complaint')
      .leftJoinAndSelect('allegation_complaint.complaint_identifier', 'complaint_identifier')
      .leftJoinAndSelect('allegation_complaint.violation_code','violation_code')
      .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
      .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
      .leftJoinAndSelect(
        'complaint_identifier.cos_geo_org_unit',
        'area_code'
      )      
      .leftJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref', 'person_complaint_xref.active_ind = true')
      .leftJoinAndSelect('person_complaint_xref.person_guid', 'person', 'person_complaint_xref.active_ind = true')

      .orderBy(sortString, sortOrderString)
      .addOrderBy(
        "complaint_identifier.incident_reported_datetime",
        sortColumn === "incident_reported_datetime" ? sortOrderString : "DESC"
      )
      .getMany();
  }

  async search(sortColumn: string, sortOrder: string, community?: string, zone?: string, region?: string, officerAssigned?: string, violationCode?: string, 
    incidentReportedStart?: string, incidentReportedEnd?: string, status?: string): Promise<AllegationComplaint[]> {

    //compiler complains if you don't explicitly set the sort order to 'DESC' or 'ASC' in the function
    const sortOrderString = sortOrder === "DESC" ? "DESC" : "ASC";
    const sortTable = (sortColumn === 'complaint_identifier' || sortColumn === 'violation_code' || sortColumn === 'in_progress_ind') ? 'allegation_complaint.' : 'complaint_identifier.';
    const sortString =  sortColumn !== 'update_timestamp' ? sortTable + sortColumn : 'GREATEST(complaint_identifier.update_timestamp, allegation_complaint.update_timestamp)';

    const queryBuilder = this.allegationComplaintsRepository.createQueryBuilder('allegation_complaint')
    .leftJoinAndSelect('allegation_complaint.complaint_identifier', 'complaint_identifier')
    .leftJoinAndSelect('allegation_complaint.violation_code','violation_code')
    .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
    .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
    .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
    .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'cos_geo_org_unit')
    .leftJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref', 'person_complaint_xref.active_ind = true')
    .leftJoinAndSelect('person_complaint_xref.person_guid', 'person', 'person_complaint_xref.active_ind = true')
    .orderBy(sortString, sortOrderString)
    .addOrderBy('complaint_identifier.incident_reported_datetime', sortColumn === 'incident_reported_datetime' ? sortOrderString : "DESC");
    if(community !== null && community !== undefined && community !== '')
      {
        queryBuilder.andWhere('cos_geo_org_unit.area_code = :Community', { Community: community });
      }
      if(zone !== null && zone !== undefined && zone !== '')
      {
        queryBuilder.andWhere('cos_geo_org_unit.zone_code = :Zone', { Zone: zone });
      }
      if(region !== null && region !== undefined && region !== '')
      {
        queryBuilder.andWhere('cos_geo_org_unit.region_code = :Region', { Region: region });
      }
      if(officerAssigned !== null && officerAssigned !== undefined && officerAssigned !== '' && officerAssigned !== 'null')
      {
        queryBuilder.andWhere('person_complaint_xref.person_complaint_xref_code = :Assignee', { Assignee: 'ASSIGNEE' });
        queryBuilder.andWhere('person_complaint_xref.person_guid = :PersonGuid', { PersonGuid: officerAssigned });
      }
      else if(officerAssigned === 'null')
      {
        queryBuilder.andWhere('person_complaint_xref.person_guid IS NULL');
      }
    if(violationCode !== null && violationCode !== undefined && violationCode !== "")
    {
      queryBuilder.andWhere('allegation_complaint.violation_code = :ViolationCode', { ViolationCode:violationCode });
    }
    if(incidentReportedStart !== null && incidentReportedStart !== undefined && incidentReportedStart !== "")
    {
      queryBuilder.andWhere('complaint_identifier.incident_reported_datetime >= :IncidentReportedStart', { IncidentReportedStart:incidentReportedStart });
    }
    if(incidentReportedEnd !== null && incidentReportedEnd !== undefined && incidentReportedEnd !== "")
    {
      queryBuilder.andWhere('complaint_identifier.incident_reported_datetime <= :IncidentReportedEnd', { IncidentReportedEnd:incidentReportedEnd });
    }
    if(status !== null && status !== undefined && status !== "")
    {
      queryBuilder.andWhere('complaint_identifier.complaint_status_code = :Status', { Status:status });
    }
    process.stdout.write(queryBuilder.getQueryAndParameters().toLocaleString() + '\n');
    return queryBuilder.getMany();
  }

  async findOne(id: any): Promise<AllegationComplaint> {
    return this.allegationComplaintsRepository.createQueryBuilder('allegation_complaint')
    .leftJoinAndSelect('allegation_complaint.complaint_identifier', 'complaint_identifier')
    .leftJoinAndSelect('allegation_complaint.violation_code','violation_code')
    .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
    .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
    .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
    .leftJoinAndSelect(
      "complaint_identifier.cos_geo_org_unit",
      "area_code"
    )      
    .leftJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref', 'person_complaint_xref.active_ind = true')
    .leftJoinAndSelect('person_complaint_xref.person_guid', 'person', 'person_complaint_xref.active_ind = true')
    .where("allegation_complaint_guid = :id", {id})
    .getOne();
  }

  async update(
    allegation_complaint_guid: UUID,
    updateAllegationComplaint: UpdateAllegationComplaintDto
  ): Promise<AllegationComplaint> {
    await this.allegationComplaintsRepository.update(
      { allegation_complaint_guid },
      updateAllegationComplaint
    );
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
    return this.allegationComplaintsRepository.createQueryBuilder('allegation_complaint')
    .leftJoinAndSelect('allegation_complaint.complaint_identifier', 'complaint_identifier')
    .leftJoinAndSelect('allegation_complaint.violation_code','violation_code')
    .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
    .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
    .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
    .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'geo_organization_unit_code')
    .leftJoinAndSelect(
      "complaint_identifier.cos_geo_org_unit",
      "area_code"
    )      
    .leftJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref', 'person_complaint_xref.active_ind = true')
    .leftJoinAndSelect('person_complaint_xref.person_guid', 'person', 'person_complaint_xref.active_ind = true')
    .where("complaint_identifier.complaint_identifier = :id", {id})
    .getOne();

  }
}
