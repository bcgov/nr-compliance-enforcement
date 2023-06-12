import { Module } from '@nestjs/common';
import { PersonComplaintXrefService } from './person_complaint_xref.service';
import { PersonComplaintXrefController } from './person_complaint_xref.controller';

@Module({
  controllers: [PersonComplaintXrefController],
  providers: [PersonComplaintXrefService]
})
export class PersonComplaintXrefModule {}
