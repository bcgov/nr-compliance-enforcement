import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagingActivityCode } from './entities/staging_activity_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StagingActivityCode])],
})
export class StagingActivityCodeModule {}
