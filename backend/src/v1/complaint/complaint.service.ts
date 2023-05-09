import { Injectable } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Complaint } from './entities/complaint.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>
  ) {}

  async create(complaint: CreateComplaintDto): Promise<Complaint> {
    const newComplaint = this.complaintsRepository.create(complaint);
    await this.complaintsRepository.save(newComplaint);
    return newComplaint;
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintsRepository.find();
  }

  async findOne(id: any): Promise<Complaint> {
    return this.complaintsRepository.findOneOrFail(id);
  }

  async update(complaint_identifier: string, updateComplaintDto: UpdateComplaintDto): Promise<Complaint> {
    await this.complaintsRepository.update({ complaint_identifier }, updateComplaintDto);
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
}
