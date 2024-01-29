import { Module } from '@nestjs/common';
import { StagingStatusCodeService } from './staging_status_code.service';
import { StagingStatusCodeController } from './staging_status_code.controller';
import { StagingStatusCode } from './entities/staging_status_code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StagingStatusCode])],
  controllers: [StagingStatusCodeController],
  providers: [StagingStatusCodeService]
})
export class StagingStatusCodeModule {}
