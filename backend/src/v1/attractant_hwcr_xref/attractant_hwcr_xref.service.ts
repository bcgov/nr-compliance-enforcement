import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateAttractantHwcrXrefDto } from './dto/create-attractant_hwcr_xref.dto';
import { UpdateAttractantHwcrXrefDto } from './dto/update-attractant_hwcr_xref.dto';
import { AttractantHwcrXref } from './entities/attractant_hwcr_xref.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HwcrComplaint } from '../hwcr_complaint/entities/hwcr_complaint.entity';

@Injectable()

export class AttractantHwcrXrefService {
    constructor(private dataSource: DataSource) {}
    private readonly logger = new Logger(AttractantHwcrXrefService.name);
    @InjectRepository(AttractantHwcrXref)
    private attractantHwcrXrefRepository: Repository<AttractantHwcrXref>;

  async create(createAttractantHwcrXrefDto: CreateAttractantHwcrXrefDto) {
      const newAttratantHwcrXref = await this.attractantHwcrXrefRepository.create(createAttractantHwcrXrefDto);
      //await queryRunner.manager.save(newAttratantHwcrXref);
      return newAttratantHwcrXref;
  }

  async findAll(): Promise<AttractantHwcrXref[]> {
    return this.attractantHwcrXrefRepository.find({
      where: {active_ind: true},
      relations: { 
        attractant_code: true,
        hwcr_complaint_guid: true
      },
    });
  }

  async findOne(id: any): Promise<AttractantHwcrXref> {
    return this.attractantHwcrXrefRepository.findOneOrFail({
      where: {attractant_hwcr_xref_guid: id},
      relations: { 
        attractant_code: true,
        hwcr_complaint_guid: true
      },
    });
  }

  update(id: number, updateAttractantHwcrXrefDto: UpdateAttractantHwcrXrefDto) {
    return `This action updates a #${id} attractantHwcrXref`;
  }

  async updateComplaintAttractants(
    //queryRunner: QueryRunner, 
    hwcr_complaint_guid: HwcrComplaint, 
    updateAttractantCodes: AttractantHwcrXref[]) {
    
      /*
    await this.attractantHwcrXrefRepository.createQueryBuilder('attractant_hwcr_xref')
    .delete()
    .from(AttractantHwcrXref)
    .where("hwcr_complaint_guid = :hwcr_complaint_guid", { hwcr_complaint_guid: hwcr_complaint_guid.hwcr_complaint_guid }).execute();*/
    //queryRunner.manager.save(updatedValue);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try
    {
      for(var i = 0; i < updateAttractantCodes.length; i++)
      {
        if(updateAttractantCodes[i].attractant_hwcr_xref_guid === undefined)
        {
          let createAttractantHwcrXrefDto: CreateAttractantHwcrXrefDto = new CreateAttractantHwcrXrefDto();

          createAttractantHwcrXrefDto.attractant_code = updateAttractantCodes[i].attractant_code;
          createAttractantHwcrXrefDto.hwcr_complaint_guid = hwcr_complaint_guid;
          createAttractantHwcrXrefDto.update_user_id = createAttractantHwcrXrefDto.create_user_id = updateAttractantCodes[i].create_user_id;
          createAttractantHwcrXrefDto.create_utc_timestamp = createAttractantHwcrXrefDto.update_utc_timestamp = new Date();
          createAttractantHwcrXrefDto.active_ind = updateAttractantCodes[i].active_ind;

          const updatedValue = await this.attractantHwcrXrefRepository.create(createAttractantHwcrXrefDto);
          queryRunner.manager.save(updatedValue);
        }
        else
        {
          let updateAttractantHwcrXrefDto: UpdateAttractantHwcrXrefDto = new UpdateAttractantHwcrXrefDto();

          updateAttractantHwcrXrefDto.attractant_hwcr_xref_guid = updateAttractantCodes[i].attractant_hwcr_xref_guid;
          updateAttractantHwcrXrefDto.attractant_code = updateAttractantCodes[i].attractant_code;
          updateAttractantHwcrXrefDto.hwcr_complaint_guid = hwcr_complaint_guid;
          updateAttractantHwcrXrefDto.update_user_id = updateAttractantHwcrXrefDto.create_user_id = updateAttractantCodes[i].create_user_id;
          updateAttractantHwcrXrefDto.create_utc_timestamp = updateAttractantHwcrXrefDto.update_utc_timestamp = new Date();
          updateAttractantHwcrXrefDto.active_ind = updateAttractantCodes[i].active_ind;

          const updatedValue = await this.attractantHwcrXrefRepository.update(updateAttractantCodes[i].attractant_hwcr_xref_guid, updateAttractantHwcrXrefDto);
          queryRunner.manager.update(AttractantHwcrXref, updateAttractantHwcrXrefDto.attractant_hwcr_xref_guid, updateAttractantHwcrXrefDto);
        }
      }
      await queryRunner.commitTransaction();
    } 
    catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } 
    finally
    {
      await queryRunner.release();
    }
    return ;
  }

  remove(id: number) {
    return `This action removes a #${id} attractantHwcrXref`;
  }
}
