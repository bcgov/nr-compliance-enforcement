import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateAttractantHwcrXrefDto } from './dto/create-attractant_hwcr_xref.dto';
import { UpdateAttractantHwcrXrefDto } from './dto/update-attractant_hwcr_xref.dto';
import { AttractantHwcrXref } from './entities/attractant_hwcr_xref.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';

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
    hwcr_complaint_guid: string, 
    updateAttractantCodes: AttractantHwcrXref[]) {
    const updatedValue = this.attractantHwcrXrefRepository.createQueryBuilder('attractant_hwcr_xref')
    .delete()
    .from(AttractantHwcrXref)
    .where("hwcr_complaint_guid = :hwcr_complaint_guid", { hwcr_complaint_guid: hwcr_complaint_guid });
    //queryRunner.manager.save(updatedValue);
    //const queryRunner = this.dataSource.createQueryRunner();

    //await queryRunner.connect();
    //await queryRunner.startTransaction();
    try
    {
      for(var i = 0; i < updateAttractantCodes.length; i++)
      {
        console.log("updateAttractantCodes[i]: " + JSON.stringify(updateAttractantCodes[i]));
        let createAttractantHwcrXrefDto: CreateAttractantHwcrXrefDto = new CreateAttractantHwcrXrefDto();
        createAttractantHwcrXrefDto.attractant_code = updateAttractantCodes[i].attractant_code;
        createAttractantHwcrXrefDto.hwcr_complaint_guid = updateAttractantCodes[i].hwcr_complaint_guid;
        createAttractantHwcrXrefDto.update_user_id = createAttractantHwcrXrefDto.create_user_id = updateAttractantCodes[i].create_user_id;
        createAttractantHwcrXrefDto.create_timestamp = createAttractantHwcrXrefDto.update_timestamp = new Date();

        console.log("updateAttractantHwcrXrefDto: " + JSON.stringify(createAttractantHwcrXrefDto));
        const updatedValue = await this.attractantHwcrXrefRepository.create(createAttractantHwcrXrefDto);
        //queryRunner.manager.save(updatedValue);
        console.log("test1");
      }
      console.log("test2");
      //queryRunner.commitTransaction();
      console.log("test3");
    } 
    catch (err) {
      this.logger.error(err);
      //await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } 
    finally
    {
      console.log("test4");
      //await queryRunner.release();
      console.log("test5");
    }
    return ;
  }

  remove(id: number) {
    return `This action removes a #${id} attractantHwcrXref`;
  }
}
