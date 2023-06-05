import { Inject, Injectable } from '@nestjs/common';
import { CreateHwcrComplaintDto } from './dto/create-hwcr_complaint.dto';
import { UpdateHwcrComplaintDto } from './dto/update-hwcr_complaint.dto';
import { HwcrComplaint } from './entities/hwcr_complaint.entity';
import { ComplaintService } from '../complaint/complaint.service';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';
import { AttractantHwcrXrefService } from '../attractant_hwcr_xref/attractant_hwcr_xref.service';

@Injectable()
export class HwcrComplaintService {
  constructor(private dataSource: DataSource) {
    }
    @InjectRepository(HwcrComplaint)
    private hwcrComplaintsRepository: Repository<HwcrComplaint>;
    @Inject(ComplaintService)
    protected readonly complaintService: ComplaintService;
    @Inject(AttractantHwcrXrefService)
    protected readonly attractantHwcrXrefService: AttractantHwcrXrefService;
  
    
    async create(hwcrComplaint: any): Promise<HwcrComplaint> {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      var newHwcrComplaintString;
      try
      {
        await this.complaintService.create(<CreateComplaintDto>hwcrComplaint, queryRunner);
        newHwcrComplaintString = await this.hwcrComplaintsRepository.create(<CreateHwcrComplaintDto>hwcrComplaint);
        var newHwcrComplaint : HwcrComplaint;
        newHwcrComplaint = <HwcrComplaint>await queryRunner.manager.save(newHwcrComplaintString);
        if(newHwcrComplaint.attractant_hwcr_xref != null)
        {
          for (let i=0; i < newHwcrComplaint.attractant_hwcr_xref.length; i++) {
              const blankHwcrComplaint = new HwcrComplaint();
              blankHwcrComplaint.hwcr_complaint_guid = newHwcrComplaint.hwcr_complaint_guid;
              newHwcrComplaint.attractant_hwcr_xref[i].hwcr_complaint = blankHwcrComplaint;
              await this.attractantHwcrXrefService.create(newHwcrComplaint.attractant_hwcr_xref[i], queryRunner);
          }
        }
        await queryRunner.commitTransaction();
      }
      catch (err) {
        console.log(err);
        await queryRunner.rollbackTransaction();
        newHwcrComplaintString = "Error Occured";
      } finally {
        await queryRunner.release();
      }
      return newHwcrComplaintString;
    }
  
    async findAll(sortColumn: string, sortOrder: string): Promise<HwcrComplaint[]> {
      const sortOrderString = sortOrder === "DESC" ? "DESC" : "ASC";
      return this.hwcrComplaintsRepository.createQueryBuilder('hwcr_complaint')
      .leftJoinAndSelect('hwcr_complaint.complaint_identifier', 'complaint_identifier')
      .leftJoinAndSelect('hwcr_complaint.species_code','species_code')
      .leftJoinAndSelect('hwcr_complaint.hwcr_complaint_nature_code', 'hwcr_complaint_nature_code')
      .leftJoinAndSelect('hwcr_complaint.attractant_hwcr_xref', 'attractant_hwcr_xref')
      .leftJoinAndSelect('complaint_identifier.complaint_status_code', 'complaint_status_code')
      .leftJoinAndSelect('complaint_identifier.referred_by_agency_code', 'referred_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.owned_by_agency_code', 'owned_by_agency_code')
      .leftJoinAndSelect('complaint_identifier.geo_organization_unit_code', 'geo_organization_unit_code')
      .leftJoinAndSelect('attractant_hwcr_xref.attractant_code', 'attractant_code')
      .orderBy('complaint_identifier.' + sortColumn, sortOrderString)
      .addOrderBy('complaint_identifier.incident_reported_datetime', 'DESC')
      .getMany();
    }
  
    async findOne(id: any): Promise<HwcrComplaint> {
      return this.hwcrComplaintsRepository.findOneOrFail({
        where: {hwcr_complaint_guid: id},
        relations: { 
          complaint_identifier: {
            owned_by_agency_code: true,
            referred_by_agency_code: true,
            complaint_status_code: true,
            geo_organization_unit_code: true,
          } ,
          species_code: true,
          hwcr_complaint_nature_code: true,
          attractant_hwcr_xref: {
            attractant_code: true,
          },
        },
      });
    }
  
    async update(hwcr_complaint_guid: UUID, updateHwcrComplaint: UpdateHwcrComplaintDto): Promise<HwcrComplaint> {
      await this.hwcrComplaintsRepository.update({ hwcr_complaint_guid }, updateHwcrComplaint);
      return this.findOne(hwcr_complaint_guid);
    }
  
    async remove(id: UUID): Promise<{ deleted: boolean; message?: string }> {
      try {
        var complaint_identifier = (await this.hwcrComplaintsRepository.findOneOrFail({
          where: {hwcr_complaint_guid: id},
          relations: { 
            complaint_identifier: true,
          },
        })).complaint_identifier.complaint_identifier;
        await this.hwcrComplaintsRepository.delete(id);
        await this.complaintService.remove(complaint_identifier);
        return { deleted: true };
      } catch (err) {
        return { deleted: false, message: err.message };
      }
    }
}
