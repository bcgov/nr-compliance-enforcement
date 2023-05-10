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

  console.log(complaint.location_geometry_point);
    /*const newComplaint = await this.complaintsRepository.createQueryBuilder().insert().values(
    {
      location_geometry_point: () => "ST_GeomFromText('${complaint.location_geometry_point}', 4326)",
    }).execute() as any;*/
    const newComplaint = this.complaintsRepository.create(complaint);
    console.log(complaint.location_geometry_point);
    await this.complaintsRepository.save(newComplaint);
    console.log(newComplaint.location_geometry_point);
    return newComplaint;
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintsRepository.find({
      relations: { 
        referred_by_agency_code: true,
        owned_by_agency_code: true,
        complaint_status_code: true,
        geo_organization_unit_code: true,
      },
    });
  }

  async findOne(id: any): Promise<Complaint> {
    return this.complaintsRepository.findOneOrFail({
      where: {complaint_identifier: id},
      relations: { 
        referred_by_agency_code: true,
        owned_by_agency_code: true,
        complaint_status_code: true,
        geo_organization_unit_code: true,
      },
    });
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
