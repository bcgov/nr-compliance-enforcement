import { Module } from '@nestjs/common';
import { StagingStatusCode } from './entities/staging_status_code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StagingStatusCode])],
})
export class StagingStatusCodeModule {}
