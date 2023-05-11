import { Inject, Injectable } from '@nestjs/common';
import { CreateAllegationComplaintDto } from './dto/create-allegation_complaint.dto';
import { UpdateAllegationComplaintDto } from './dto/update-allegation_complaint.dto';
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { ComplaintService } from '../complaint/complaint.service';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';

@Injectable()
export class AllegationComplaintService {
  constructor(
    @InjectRepository(AllegationComplaint)
    private allegationComplaintsRepository: Repository<AllegationComplaint>
  ) {
  }
  @Inject(ComplaintService)
  protected readonly complaintService: ComplaintService;

  async create(allegationComplaint: any): Promise<AllegationComplaint> {
    await this.complaintService.create(<CreateComplaintDto>allegationComplaint);
    const newAllegationComplaint = this.allegationComplaintsRepository.create(<CreateAllegationComplaintDto>allegationComplaint);
    await this.allegationComplaintsRepository.save(newAllegationComplaint);
    return newAllegationComplaint;
  }

  async findAll(): Promise<AllegationComplaint[]> {
    return this.allegationComplaintsRepository.find({
      relations: { 
        complaint_identifier: {
          owned_by_agency_code: true,
          referred_by_agency_code: true,
          complaint_status_code: true,
          geo_organization_unit_code: true,
        } ,
        violation_code: false,
      },
    });
  }

  async findOne(id: any): Promise<AllegationComplaint> {
    return this.allegationComplaintsRepository.findOneOrFail({
      where: {allegation_complaint_guid: id},
      relations: { 
        complaint_identifier: {
          owned_by_agency_code: true,
          referred_by_agency_code: true,
          complaint_status_code: true,
          geo_organization_unit_code: true,
        } ,
        violation_code: false,
      },
    });
  }

  async update(allegation_complaint_guid: UUID, updateAllegationComplaint: UpdateAllegationComplaintDto): Promise<AllegationComplaint> {
    await this.allegationComplaintsRepository.update({ allegation_complaint_guid }, updateAllegationComplaint);
    return this.findOne(allegation_complaint_guid);
  }

  async remove(id: UUID): Promise<{ deleted: boolean; message?: string }> {
    try {
      var complaint_identifier = (await this.allegationComplaintsRepository.findOneOrFail({
        where: {allegation_complaint_guid: id},
        relations: { 
          complaint_identifier: true,
        },
      })).complaint_identifier.complaint_identifier;
      await this.allegationComplaintsRepository.delete(id);
      await this.complaintService.remove(complaint_identifier);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
