import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutomapperModule } from "@automapper/nestjs";
import { CaseFileController } from "./case_file.controller";
import { CaseFileService } from "./case_file.service";
import { CodeTableModule } from "../../code-table/code-table.module";
import { ComplaintModule } from "../../complaint/complaint.module";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { LinkedComplaintXref } from "../../linked_complaint_xref/entities/linked_complaint_xref.entity";

@Module({
  imports: [
    AutomapperModule,
    CodeTableModule,
    ComplaintModule,
    TypeOrmModule.forFeature([Complaint]),
    TypeOrmModule.forFeature([LinkedComplaintXref]),
  ],
  controllers: [CaseFileController],
  providers: [CaseFileService],
  exports: [CaseFileService],
})
export class CaseFileModule {}
