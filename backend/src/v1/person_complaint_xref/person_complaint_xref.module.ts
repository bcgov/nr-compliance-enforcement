import { Module } from "@nestjs/common";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { PersonComplaintXrefController } from "./person_complaint_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PersonComplaintXref])],
  controllers: [PersonComplaintXrefController],
  providers: [PersonComplaintXrefService],
  exports: [PersonComplaintXrefService],
})
export class PersonComplaintXrefModule {}
