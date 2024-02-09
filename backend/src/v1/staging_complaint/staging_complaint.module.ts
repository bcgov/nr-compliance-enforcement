import { Module } from '@nestjs/common';
import { StagingComplaintService } from './staging_complaint.service';
import { StagingComplaintController } from './staging_complaint.controller';
import { StagingComplaint } from './entities/staging_complaint.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StagingComplaint])],
  controllers: [StagingComplaintController],
  providers: [StagingComplaintService]
})
export class StagingComplaintModule {}
