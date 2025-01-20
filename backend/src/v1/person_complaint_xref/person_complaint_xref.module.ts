import { forwardRef, Module } from "@nestjs/common";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { PersonComplaintXrefController } from "./person_complaint_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { ComplaintModule } from "../complaint/complaint.module";

@Module({
  imports: [TypeOrmModule.forFeature([PersonComplaintXref]), forwardRef(() => ComplaintModule)],
  controllers: [PersonComplaintXrefController],
  providers: [PersonComplaintXrefService],
  exports: [PersonComplaintXrefService],
})
export class PersonComplaintXrefModule {}
