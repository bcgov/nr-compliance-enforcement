import { Module } from '@nestjs/common';
import { StagingActivityCodeService } from './staging_activity_code.service';
import { StagingActivityCodeController } from './staging_activity_code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagingActivityCode } from './entities/staging_activity_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StagingActivityCode])],
  controllers: [StagingActivityCodeController],
  providers: [StagingActivityCodeService]
})
export class StagingActivityCodeModule {}
