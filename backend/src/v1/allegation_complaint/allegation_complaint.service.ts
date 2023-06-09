import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAllegationComplaintDto } from './dto/create-allegation_complaint.dto';
import { UpdateAllegationComplaintDto } from './dto/update-allegation_complaint.dto';
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UUID } from 'crypto';
import { ComplaintService } from '../complaint/complaint.service';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';

@Injectable()
export class AllegationComplaintService {
  constructor(private dataSource: DataSource) {
  }
  @InjectRepository(AllegationComplaint)
  private allegationComplaintsRepository: Repository<AllegationComplaint>;
  @Inject(ComplaintService)
  protected readonly complaintService: ComplaintService;

  async create(allegationComplaint: any): Promise<AllegationComplaint> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    var newAllegationComplaint;
    try
    {
      await this.complaintService.create(<CreateComplaintDto>allegationComplaint, queryRunner);
      newAllegationComplaint = await this.allegationComplaintsRepository.create(<CreateAllegationComplaintDto>allegationComplaint);
      await queryRunner.manager.save(newAllegationComplaint);
      await queryRunner.commitTransaction();
    }
    catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newAllegationComplaint;
  }

  async findAll(sortColumn: string, sortOrder: string): Promise<AllegationComplaint[]> {
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
      .leftJoinAndSelect('complaint_identifier.geo_organization_unit_code', 'geo_organization_unit_code')
      .orderBy(sortString, sortOrderString)
      .addOrderBy('complaint_identifier.incident_reported_datetime', sortColumn === 'incident_reported_datetime' ? sortOrderString : "DESC")
      .getMany();
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
