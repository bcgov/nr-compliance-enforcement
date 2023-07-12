import { Injectable, Logger } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryResult, Repository } from 'typeorm';
import { Office } from './entities/office.entity';

@Injectable()
export class OfficeService {

  private readonly logger = new Logger(OfficeService.name);

  constructor(private dataSource: DataSource) {
  }
  @InjectRepository(Office)
  private officeRepository: Repository<Office>;

  async create(office: any): Promise<Office> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newOfficeString;
    try
    {
      newOfficeString = await this.officeRepository.create(<CreateOfficeDto>office);
      await queryRunner.manager.save(newOfficeString);
      await queryRunner.commitTransaction();
    }
    catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      newOfficeString = "Error Occured";
    } finally {
      await queryRunner.release();
    }
    return newOfficeString;
  }

  findByGeoOrgCode (geo_org_code: any) {
    return this.officeRepository.find({
      where: {cos_geo_org_unit: geo_org_code},
      relations: {

      } ,
      });
  }

  findOne(office_guid: any) {
    return this.officeRepository.findOneOrFail({
      where: {office_guid: office_guid},
    })
  }

  findOfficesByZone (zone_code: string)
  {
    const queryBuilder = this.officeRepository.createQueryBuilder('office')
    .leftJoinAndSelect('office.cos_geo_org_unit', 'cos_geo_org_unit')
    .leftJoinAndSelect('office.officers', 'officer')
    .leftJoinAndSelect('officer.person_guid','person')
    .where('cos_geo_org_unit.zone_code = :Zone', { Zone: zone_code }).distinctOn(['cos_geo_org_unit.offloc_code', 'officer.officer_guid']);
    process.stdout.write("backend call" + queryBuilder.getQueryAndParameters().toLocaleString());
    return queryBuilder.getMany();
  }

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return `This action updates a #${id} office`;
  }

  remove(id: number) {
    return `This action removes a #${id} office`;
  }
}
