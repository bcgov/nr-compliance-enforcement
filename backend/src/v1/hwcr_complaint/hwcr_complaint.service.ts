import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateHwcrComplaintDto } from './dto/create-hwcr_complaint.dto';
import { UpdateHwcrComplaintDto } from './dto/update-hwcr_complaint.dto';
import { HwcrComplaint } from './entities/hwcr_complaint.entity';
import { ComplaintService } from '../complaint/complaint.service';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';
import { AttractantHwcrXrefService } from '../attractant_hwcr_xref/attractant_hwcr_xref.service';
import { OfficeStats, ZoneAtAGlanceStats } from 'src/types/zone_at_a_glance/zone_at_a_glance_stats';
import { CosGeoOrgUnit } from '../cos_geo_org_unit/entities/cos_geo_org_unit.entity';

@Injectable()
export class HwcrComplaintService {

  private readonly logger = new Logger(HwcrComplaintService.name);

  constructor(private dataSource: DataSource) {}
  @InjectRepository(HwcrComplaint)
  private hwcrComplaintsRepository: Repository<HwcrComplaint>;
  @InjectRepository(CosGeoOrgUnit)
  private cosGeoOrgUnitRepository: Repository<CosGeoOrgUnit>;
  @Inject(ComplaintService)
  protected readonly complaintService: ComplaintService;
  @Inject(AttractantHwcrXrefService)
  protected readonly attractantHwcrXrefService: AttractantHwcrXrefService;

  async create(hwcrComplaint: any): Promise<HwcrComplaint> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newHwcrComplaintString;
    try {
      await this.complaintService.create(
        <CreateComplaintDto>hwcrComplaint,
        queryRunner
      );
      newHwcrComplaintString = await this.hwcrComplaintsRepository.create(
        <CreateHwcrComplaintDto>hwcrComplaint
      );
      let newHwcrComplaint: HwcrComplaint;
      newHwcrComplaint = <HwcrComplaint>(
        await queryRunner.manager.save(newHwcrComplaintString)
      );
      if (newHwcrComplaint.attractant_hwcr_xref != null) {
        for (let i = 0; i < newHwcrComplaint.attractant_hwcr_xref.length; i++) {
          const blankHwcrComplaint = new HwcrComplaint();
          blankHwcrComplaint.hwcr_complaint_guid =
            newHwcrComplaint.hwcr_complaint_guid;
          newHwcrComplaint.attractant_hwcr_xref[i].hwcr_complaint =
            blankHwcrComplaint;
          await this.attractantHwcrXrefService.create(
            newHwcrComplaint.attractant_hwcr_xref[i],
            queryRunner
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

    async search(sortColumn: string, sortOrder: string, community?: string, zone?: string, region?: string, officerAssigned?: string, natureOfComplaint?: string, 
      speciesCode?: string, incidentReportedStart?: Date, incidentReportedEnd?: Date, status?: string): Promise<HwcrComplaint[]> {
      //compiler complains if you don't explicitly set the sort order to 'DESC' or 'ASC' in the function
      const sortOrderString = sortOrder === "DESC" ? "DESC" : "ASC";
      let sortTable = 'complaint_identifier.';
      if(sortColumn === 'complaint_identifier' || sortColumn === 'species_code' || sortColumn === 'hwcr_complaint_nature_code')
      {
        sortTable = 'hwcr_complaint.';
      }
      else if(sortColumn === 'last_name')
      {
        sortTable ='person.';
      }

      const sortString =  sortColumn !== 'update_timestamp' ? sortTable + sortColumn : 'GREATEST(complaint_identifier.update_timestamp, hwcr_complaint.update_timestamp)';
      

      const queryBuilder = this.hwcrComplaintsRepository.createQueryBuilder('hwcr_complaint')
      .leftJoinAndSelect('hwcr_complaint.complaint_identifier', 'complaint_identifier')
      .leftJoinAndSelect('hwcr_complaint.species_code','species_code')
      .leftJoinAndSelect('hwcr_complaint.hwcr_complaint_nature_code', 'hwcr_complaint_nature_code')
      .leftJoinAndSelect('hwcr_complaint.attractant_hwcr_xref', 'attractant_hwcr_xref')
      .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
      .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'cos_geo_org_unit')
      .leftJoinAndSelect('attractant_hwcr_xref.attractant_code', 'attractant_code')
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
      if(natureOfComplaint !== null && natureOfComplaint !== undefined && natureOfComplaint !== "")
      {
        queryBuilder.andWhere('hwcr_complaint.hwcr_complaint_nature_code = :NatureOfComplaint', { NatureOfComplaint:natureOfComplaint });
      }
      if(speciesCode !== null && speciesCode !== undefined && speciesCode !== "")
      {
        queryBuilder.andWhere('hwcr_complaint.species_code = :SpeciesCode', { SpeciesCode:speciesCode });
      }
      if(incidentReportedStart !== null && incidentReportedStart !== undefined)
      {
        queryBuilder.andWhere('complaint_identifier.incident_reported_datetime >= :IncidentReportedStart', { IncidentReportedStart: incidentReportedStart });
      }
      if(incidentReportedEnd !== null && incidentReportedEnd !== undefined)
      {
        queryBuilder.andWhere('complaint_identifier.incident_reported_datetime <= :IncidentReportedEnd', { IncidentReportedEnd: incidentReportedEnd  });
      }
      if(status !== null && status !== undefined && status !== "")
      {
        queryBuilder.andWhere('complaint_identifier.complaint_status_code = :Status', { Status:status });
      }

      return queryBuilder.getMany();
    }
  
    async findAll(sortColumn: string, sortOrder: string): Promise<HwcrComplaint[]> {
      //compiler complains if you don't explicitly set the sort order to 'DESC' or 'ASC' in the function
      const sortOrderString = sortOrder === "DESC" ? "DESC" : "ASC";
      const sortTable = (sortColumn === 'complaint_identifier' || sortColumn === 'species_code' || sortColumn === 'hwcr_complaint_nature_code') ? 'hwcr_complaint.' : 'complaint_identifier.';
      const sortString =  sortColumn !== 'update_timestamp' ? sortTable + sortColumn : 'GREATEST(complaint_identifier.update_timestamp, hwcr_complaint.update_timestamp)';

      const queryBuilder = this.hwcrComplaintsRepository.createQueryBuilder('hwcr_complaint')
      .leftJoinAndSelect('hwcr_complaint.complaint_identifier', 'complaint_identifier')
      .leftJoinAndSelect('hwcr_complaint.species_code','species_code')
      .leftJoinAndSelect('hwcr_complaint.hwcr_complaint_nature_code', 'hwcr_complaint_nature_code')
      .leftJoinAndSelect('hwcr_complaint.attractant_hwcr_xref', 'attractant_hwcr_xref')
      .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
      .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'area_code')
      .leftJoinAndSelect('attractant_hwcr_xref.attractant_code', 'attractant_code')
      .leftJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref', 'person_complaint_xref.active_ind = true')
      .leftJoinAndSelect('person_complaint_xref.person_guid', 'person', 'person_complaint_xref.active_ind = true')
      .orderBy(sortString, sortOrderString)
      .addOrderBy('complaint_identifier.incident_reported_datetime', sortColumn === 'incident_reported_datetime' ? sortOrderString : "DESC");

      return queryBuilder.getMany();
    }
  
    async findOne(id: any): Promise<HwcrComplaint> {
      return this.hwcrComplaintsRepository.createQueryBuilder('hwcr_complaint')
      .leftJoinAndSelect('hwcr_complaint.complaint_identifier', 'complaint_identifier')
      .leftJoinAndSelect('hwcr_complaint.species_code','species_code')
      .leftJoinAndSelect('hwcr_complaint.hwcr_complaint_nature_code', 'hwcr_complaint_nature_code')
      .leftJoinAndSelect('hwcr_complaint.attractant_hwcr_xref', 'attractant_hwcr_xref')
      .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
      .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'area_code')
      .leftJoinAndSelect('attractant_hwcr_xref.attractant_code', 'attractant_code')
      .leftJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref', 'person_complaint_xref.active_ind = true')
      .leftJoinAndSelect('person_complaint_xref.person_guid', 'person', 'person_complaint_xref.active_ind = true')
      .where('hwcr_complaint.hwcr_complaint_guid = :id', {id})
      .getOne();
    }
  
  async update(
    hwcr_complaint_guid: UUID,
    updateHwcrComplaint: UpdateHwcrComplaintDto
  ): Promise<HwcrComplaint> {
    await this.hwcrComplaintsRepository.update(
      { hwcr_complaint_guid },
      updateHwcrComplaint
    );
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

  async findByComplaintIdentifier(id: any): Promise<HwcrComplaint> {
    return this.hwcrComplaintsRepository.createQueryBuilder('hwcr_complaint')
    .leftJoinAndSelect('hwcr_complaint.complaint_identifier', 'complaint_identifier')
    .leftJoinAndSelect('hwcr_complaint.species_code','species_code')
    .leftJoinAndSelect('hwcr_complaint.hwcr_complaint_nature_code', 'hwcr_complaint_nature_code')
    .leftJoinAndSelect('hwcr_complaint.attractant_hwcr_xref', 'attractant_hwcr_xref')
    .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
    .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
    .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
    .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'area_code')
    .leftJoinAndSelect('attractant_hwcr_xref.attractant_code', 'attractant_code')
    .leftJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref', 'person_complaint_xref.active_ind = true')
    .leftJoinAndSelect('person_complaint_xref.person_guid', 'person', 'person_complaint_xref.active_ind = true')
    .where('complaint_identifier.complaint_identifier = :id', {id})
    .getOne();
  }

  async getZoneAtAGlanceStatistics(zone: string): Promise<ZoneAtAGlanceStats> { 
    let results: ZoneAtAGlanceStats = { total: 0, assigned: 0, unassigned: 0, offices:[] };

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

    const officeQuery = await this.cosGeoOrgUnitRepository.createQueryBuilder('cos_geo_org_unit')
    .where('cos_geo_org_unit.zone_code = :zone', { zone })
    .distinctOn(['cos_geo_org_unit.offloc_code']);

    const zoneOffices = await officeQuery.getMany();

    let offices: OfficeStats[] = [];
 
    for(let i = 0; i < zoneOffices.length; i++)
    {
      offices[i] = { name:  zoneOffices[i].office_location_name,
        assigned: 0,
        unassigned: 0,
        officers: [] };
      const zoneOfficeCode = zoneOffices[i].office_location_code;

      const assignedComplaintsQuery = await this.hwcrComplaintsRepository.createQueryBuilder('assigned_hwcr_complaint')
        .leftJoinAndSelect('assigned_hwcr_complaint.complaint_identifier', 'complaint_identifier')
        .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'area_code')
        .innerJoinAndSelect('complaint_identifier.person_complaint_xref', 'person_complaint_xref',)
        .where('area_code.offloc_code = :zoneOfficeCode', { zoneOfficeCode })
        .andWhere('person_complaint_xref.active_ind = true')
        .andWhere('person_complaint_xref.person_complaint_xref_code = :Assignee', { Assignee: 'ASSIGNEE' });

        offices[i].assigned = await assignedComplaintsQuery.getCount();
      

      const unAssignedComplaintsQuery = await this.hwcrComplaintsRepository.createQueryBuilder('unassigned_hwcr_complaint')
        .leftJoinAndSelect('unassigned_hwcr_complaint.complaint_identifier', 'complaint_identifier')
        .leftJoinAndSelect('complaint_identifier.cos_geo_org_unit', 'area_code')
        .where('area_code.offloc_code = :zoneOfficeCode', { zoneOfficeCode });


      offices[i].unassigned = await unAssignedComplaintsQuery.getCount() - offices[i].assigned;

  
    }

    results = { ...results, total: totalComplaints, assigned: totalAssignedComplaints, unassigned: totalComplaints - totalAssignedComplaints, offices: offices }

    return results;
  }
}
