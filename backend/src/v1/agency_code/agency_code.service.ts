import { Injectable } from '@nestjs/common';
import { CreateAgencyCodeDto } from './dto/create-agency_code.dto';
import { UpdateAgencyCodeDto } from './dto/update-agency_code.dto';

@Injectable()
export class AgencyCodeService {
  create(createAgencyCodeDto: CreateAgencyCodeDto) {
    return 'This action adds a new agencyCode';
  }

  findAll() {
    return `This action returns all agencyCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agencyCode`;
  }

  update(id: number, updateAgencyCodeDto: UpdateAgencyCodeDto) {
    return `This action updates a #${id} agencyCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} agencyCode`;
  }
}
