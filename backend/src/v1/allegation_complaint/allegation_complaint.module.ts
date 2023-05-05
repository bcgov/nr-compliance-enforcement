import { Module } from '@nestjs/common';
import { AllegationComplaintService } from './allegation_complaint.service';
import { AllegationComplaintController } from './allegation_complaint.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AllegationComplaint } from './entities/allegation_complaint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AllegationComplaint])],
  controllers: [AllegationComplaintController],
  providers: [AllegationComplaintService]
})
export class AllegationComplaintModule {}
