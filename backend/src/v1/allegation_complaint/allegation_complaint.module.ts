import { Module } from '@nestjs/common';
import { AllegationComplaintService } from './allegation_complaint.service';
import { AllegationComplaintController } from './allegation_complaint.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { ComplaintService } from '../complaint/complaint.service';

@Module({
  imports: [TypeOrmModule.forFeature([AllegationComplaint])],
  controllers: [AllegationComplaintController],
  providers: [
    AllegationComplaintService,
    {
      provide: ComplaintService,
      useClass: AllegationComplaintService,
    }
  ]
})
export class AllegationComplaintModule {}
