import { Injectable } from '@nestjs/common';
import { CreateEntityCodeDto } from './dto/create-entity_code.dto';
import { UpdateEntityCodeDto } from './dto/update-entity_code.dto';

@Injectable()
export class EntityCodeService {
  create(createEntityCodeDto: CreateEntityCodeDto) {
    return 'This action adds a new entityCode';
  }

  findAll() {
    return `This action returns all entityCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entityCode`;
  }

  update(id: number, updateEntityCodeDto: UpdateEntityCodeDto) {
    return `This action updates a #${id} entityCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} entityCode`;
  }
}
