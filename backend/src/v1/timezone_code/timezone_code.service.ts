import { Injectable } from '@nestjs/common';
import { CreateTimezoneCodeDto } from './dto/create-timezone_code.dto';
import { UpdateTimezoneCodeDto } from './dto/update-timezone_code.dto';

@Injectable()
export class TimezoneCodeService {
  create(createTimezoneCodeDto: CreateTimezoneCodeDto) {
    return 'This action adds a new timezoneCode';
  }

  findAll() {
    return `This action returns all timezoneCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timezoneCode`;
  }

  update(id: number, updateTimezoneCodeDto: UpdateTimezoneCodeDto) {
    return `This action updates a #${id} timezoneCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} timezoneCode`;
  }
}
