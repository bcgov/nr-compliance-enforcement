import { Module } from "@nestjs/common";
import { PersonComplaintXrefCodeService } from "./person_complaint_xref_code.service";
import { PersonComplaintXrefCode } from "./entities/person_complaint_xref_code.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PersonComplaintXrefCode])],
  controllers: [],
  providers: [PersonComplaintXrefCodeService],
})
export class PersonComplaintXrefCodeModule {}
