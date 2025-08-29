import { Module } from "@nestjs/common";
import { LinkedComplaintXrefService } from "./linked_complaint_xref.service";
import { LinkedComplaintXrefController } from "./linked_complaint_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";
import { Officer } from "../officer/entities/officer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LinkedComplaintXref, Officer])],
  controllers: [LinkedComplaintXrefController],
  providers: [LinkedComplaintXrefService],
  exports: [LinkedComplaintXrefService],
})
export class LinkedComplaintXrefModule {}
