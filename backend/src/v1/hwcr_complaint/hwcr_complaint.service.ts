import { Inject, Injectable } from '@nestjs/common';
import { CreateHwcrComplaintDto } from './dto/create-hwcr_complaint.dto';
import { UpdateHwcrComplaintDto } from './dto/update-hwcr_complaint.dto';
import { HwcrComplaint } from './entities/hwcr_complaint.entity';
import { ComplaintService } from '../complaint/complaint.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';
import { AttractantHwcrXref } from '../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity';
import { AttractantHwcrXrefService } from '../attractant_hwcr_xref/attractant_hwcr_xref.service';

@Injectable()
export class HwcrComplaintService {
  constructor(
    ) {
    }
    @InjectRepository(HwcrComplaint)
    private hwcrComplaintsRepository: Repository<HwcrComplaint>;
    @Inject(ComplaintService)
    protected readonly complaintService: ComplaintService;
    @Inject(AttractantHwcrXrefService)
    protected readonly attractantHwcrXrefService: AttractantHwcrXrefService;
  
    async create(hwcrComplaint: any): Promise<HwcrComplaint> {
      await this.complaintService.create(<CreateComplaintDto>hwcrComplaint);
      const newHwcrComplaint = this.hwcrComplaintsRepository.create(<CreateHwcrComplaintDto>hwcrComplaint);
      await this.hwcrComplaintsRepository.save(newHwcrComplaint);
      console.log(newHwcrComplaint);
      await newHwcrComplaint.attractant_hwcr_xref.forEach((attractant_hwcr_xref) => {
        const blankHwcrComplaint = new HwcrComplaint();
        blankHwcrComplaint.hwcr_complaint_guid = newHwcrComplaint.hwcr_complaint_guid;
        attractant_hwcr_xref.hwcr_complaint = blankHwcrComplaint;
        console.log(attractant_hwcr_xref);
        this.attractantHwcrXrefService.create(attractant_hwcr_xref);
      }
      );
      return newHwcrComplaint;
    }
  
    async findAll(): Promise<HwcrComplaint[]> {
      return this.hwcrComplaintsRepository.find({
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
