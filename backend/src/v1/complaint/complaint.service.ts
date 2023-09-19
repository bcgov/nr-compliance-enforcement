import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Complaint } from './entities/complaint.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ComplaintService {
  
  constructor(private dataSource: DataSource) {}
  private readonly logger = new Logger(ComplaintService.name);


  @InjectRepository(Complaint)
  private complaintsRepository: Repository<Complaint>;

  async create(complaint: CreateComplaintDto, queryRunner: QueryRunner): Promise<Complaint> {
    const newComplaint = await this.complaintsRepository.create(complaint);
    await queryRunner.manager.save(newComplaint);
    return newComplaint;
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
      where: {complaint_identifier: id},
      relations: { 
        referred_by_agency_code: true,
        owned_by_agency_code: true,
        complaint_status_code: true,
      },
    });
  }

  async update(complaint_identifier: string, updateComplaintDto: UpdateComplaintDto): Promise<Complaint> {
    await this.complaintsRepository.update(complaint_identifier, updateComplaintDto);
    return this.findOne(complaint_identifier);
  }

  async updateComplex(complaint_identifier: string, updateComplaint: string): Promise<Complaint> {
    try
    {
      const updateComplaintDto: UpdateComplaintDto = JSON.parse(updateComplaint);
      let referredByAgencyCode = updateComplaintDto.referred_by_agency_code;
      if(referredByAgencyCode !== null && referredByAgencyCode.agency_code === "")
      {
        referredByAgencyCode = null;
      }
      const updateData = 
        {
          complaint_status_code: updateComplaintDto.complaint_status_code,
          detail_text: updateComplaintDto.detail_text,
          location_detailed_text: updateComplaintDto.location_detailed_text,
          cos_geo_org_unit: updateComplaintDto.cos_geo_org_unit,
          incident_datetime: updateComplaintDto.incident_datetime,
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
    }
    catch (err) {
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
}
