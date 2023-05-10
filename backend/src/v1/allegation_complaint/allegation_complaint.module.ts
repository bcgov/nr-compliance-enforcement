import { Module } from '@nestjs/common';
import { AllegationComplaintService } from './allegation_complaint.service';
import { AllegationComplaintController } from './allegation_complaint.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { ComplaintService } from '../complaint/complaint.service';
import { Complaint } from '../complaint/entities/complaint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AllegationComplaint]), TypeOrmModule.forFeature([Complaint])],
  controllers: [AllegationComplaintController],
  providers: [AllegationComplaintService, ComplaintService]
})
export class AllegationComplaintModule {}
