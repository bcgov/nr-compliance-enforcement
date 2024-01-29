import { Injectable } from '@nestjs/common';
import { CreateStagingActivityCodeDto } from './dto/create-staging_activity_code.dto';
import { UpdateStagingActivityCodeDto } from './dto/update-staging_activity_code.dto';

@Injectable()
export class StagingActivityCodeService {
  create(createStagingActivityCodeDto: CreateStagingActivityCodeDto) {
    return 'This action adds a new stagingActivityCode';
  }

  findAll() {
    return `This action returns all stagingActivityCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stagingActivityCode`;
  }

  update(id: number, updateStagingActivityCodeDto: UpdateStagingActivityCodeDto) {
    return `This action updates a #${id} stagingActivityCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} stagingActivityCode`;
  }
}
