import { Module } from "@nestjs/common";
import { CodeTableService } from "./code-table.service";
import { CaseManagementCodeTableController, CodeTableController } from "./code-table.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AppUserComplaintXrefCode } from "../app_user_complaint_xref_code/entities/app_user_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { ViolationAgencyXref } from "../violation_agency_xref/entities/violation_agency_entity_xref";
import { EmailReference } from "src/v1/email_reference/entities/email_reference.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([AttractantCode]),
    TypeOrmModule.forFeature([ComplaintStatusCode]),
    TypeOrmModule.forFeature([HwcrComplaintNatureCode]),
    TypeOrmModule.forFeature([AppUserComplaintXrefCode]),
    TypeOrmModule.forFeature([SpeciesCode]),
    TypeOrmModule.forFeature([ViolationAgencyXref]),
    TypeOrmModule.forFeature([ComplaintTypeCode]),
    TypeOrmModule.forFeature([ReportedByCode]),
    TypeOrmModule.forFeature([GirTypeCode]),
    TypeOrmModule.forFeature([CompMthdRecvCdAgcyCdXref]),
    TypeOrmModule.forFeature([EmailReference]),
  ],
  controllers: [CodeTableController, CaseManagementCodeTableController],
  providers: [CodeTableService],
  exports: [CodeTableService],
})
export class CodeTableModule {}
