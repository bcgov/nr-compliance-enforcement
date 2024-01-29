import { Injectable } from '@nestjs/common';
import { CreateStagingStatusCodeDto } from './dto/create-staging_status_code.dto';
import { UpdateStagingStatusCodeDto } from './dto/update-staging_status_code.dto';

@Injectable()
export class StagingStatusCodeService {
  create(createStagingStatusCodeDto: CreateStagingStatusCodeDto) {
    return 'This action adds a new stagingStatusCode';
  }

  findAll() {
    return `This action returns all stagingStatusCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stagingStatusCode`;
  }

  update(id: number, updateStagingStatusCodeDto: UpdateStagingStatusCodeDto) {
    return `This action updates a #${id} stagingStatusCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} stagingStatusCode`;
  }
}
