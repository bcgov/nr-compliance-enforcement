import { Injectable } from '@nestjs/common';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';
import { Officer } from './entities/officer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OfficerService {
  constructor(
    @InjectRepository(Officer)
    private officeRepository: Repository<Officer>
  ) {
  }
  create(createOfficerDto: CreateOfficerDto) {
    return 'This action adds a new officer';
  }

  findAll() {
    return this.officeRepository.find({
      relations: {
        office_guid: {
          geo_organization_unit_code: true
        },
        person_guid: {

        }
      } ,
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} officer`;
  }

  update(id: number, updateOfficerDto: UpdateOfficerDto) {
    return `This action updates a #${id} officer`;
  }

  remove(id: number) {
    return `This action removes a #${id} officer`;
  }
}
