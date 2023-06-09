import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Office } from './entities/office.entity';

@Injectable()
export class OfficeService {
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
      console.log(err);
      await queryRunner.rollbackTransaction();
      newOfficeString = "Error Occured";
    } finally {
      await queryRunner.release();
    }
    return newOfficeString;
  }

  findAll() {
    return this.officeRepository.find({
      relations: {
          geo_organization_unit_code: {},
          agency_code: {}
        } ,
      });
  }

  findOne(geo_organization_unit_cd: any) {
    return this.officeRepository.findOneOrFail({
      where: {geo_organization_unit_code: geo_organization_unit_cd},
    })
  }

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return `This action updates a #${id} office`;
  }

  remove(id: number) {
    return `This action removes a #${id} office`;
  }
}
