import { Module } from '@nestjs/common';
import { PersonComplaintXrefCodeService } from './person_complaint_xref_code.service';
import { PersonComplaintXrefCodeController } from './person_complaint_xref_code.controller';
import { PersonComplaintXrefCode } from './entities/person_complaint_xref_code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PersonComplaintXrefCode])],
  controllers: [PersonComplaintXrefCodeController],
  providers: [PersonComplaintXrefCodeService]
})
export class PersonComplaintXrefCodeModule {}
