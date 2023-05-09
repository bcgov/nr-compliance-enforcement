import { Injectable } from '@nestjs/common';
import { CreateViolationCodeDto } from './dto/create-violation_code.dto';
import { UpdateViolationCodeDto } from './dto/update-violation_code.dto';

@Injectable()
export class ViolationCodeService {
  create(createViolationCodeDto: CreateViolationCodeDto) {
    return 'This action adds a new violationCode';
  }

  findAll() {
    return `This action returns all violationCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} violationCode`;
  }

  update(id: number, updateViolationCodeDto: UpdateViolationCodeDto) {
    return `This action updates a #${id} violationCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} violationCode`;
  }
}
