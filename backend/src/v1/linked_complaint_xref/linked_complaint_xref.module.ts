import { Module } from "@nestjs/common";
import { LinkedComplaintXrefService } from "./linked_complaint_xref.service";
import { LinkedComplaintXrefController } from "./linked_complaint_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LinkedComplaintXref])],
  controllers: [LinkedComplaintXrefController],
  providers: [LinkedComplaintXrefService],
  exports: [LinkedComplaintXrefService],
})
export class LinkedComplaintXrefModule {}
