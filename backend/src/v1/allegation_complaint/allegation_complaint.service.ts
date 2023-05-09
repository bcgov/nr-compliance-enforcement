import { Injectable } from '@nestjs/common';
import { CreateAllegationComplaintDto } from './dto/create-allegation_complaint.dto';
import { UpdateAllegationComplaintDto } from './dto/update-allegation_complaint.dto';
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { ComplaintService } from '../complaint/complaint.service';

@Injectable()
export class AllegationComplaintService {
  constructor(
    @InjectRepository(AllegationComplaint)
    private allegationComplaintsRepository: Repository<AllegationComplaint>
  ) {
  }

  async create(allegationComplaint: CreateAllegationComplaintDto): Promise<AllegationComplaint> {
    const newAllegationComplaint = this.allegationComplaintsRepository.create(allegationComplaint);
    await this.allegationComplaintsRepository.save(newAllegationComplaint);
    return newAllegationComplaint;
  }

  async findAll(): Promise<AllegationComplaint[]> {
    return this.allegationComplaintsRepository.find();
  }

  async findOne(id: any): Promise<AllegationComplaint> {
    return this.allegationComplaintsRepository.findOneOrFail(id);
  }

  async update(allegation_complaint_guid: UUID, updateAllegationComplaint: UpdateAllegationComplaintDto): Promise<AllegationComplaint> {
    await this.allegationComplaintsRepository.update({ allegation_complaint_guid }, updateAllegationComplaint);
    return this.findOne(allegation_complaint_guid);
  }

  async remove(id: UUID): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.allegationComplaintsRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
