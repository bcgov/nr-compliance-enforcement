import { Module } from "@nestjs/common";
import { ComplaintController } from "./complaint.controller";
import { ComplaintService } from "./complaint.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Complaint } from "../complaint/entities/complaint.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ViolationCode } from "../violation_code/entities/violation_code.entity";
import { CodeTableModule } from "../code-table/code-table.module";
import { PersonComplaintXrefModule } from "../person_complaint_xref/person_complaint_xref.module";
import { AttractantHwcrXrefModule } from "../attractant_hwcr_xref/attractant_hwcr_xref.module";
import { AutomapperModule } from "@automapper/nestjs";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { ComplaintUpdatesModule } from "../complaint_updates/complaint_updates.module";
import { StagingComplaintModule } from "../staging_complaint/staging_complaint.module";
import { ActionTaken } from "./entities/action_taken.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint]),
    TypeOrmModule.forFeature([HwcrComplaint]),
    TypeOrmModule.forFeature([AllegationComplaint]),
    TypeOrmModule.forFeature([AgencyCode]),
    TypeOrmModule.forFeature([Office]),
    TypeOrmModule.forFeature([Officer]),
    TypeOrmModule.forFeature([ReportedByCode]),
    TypeOrmModule.forFeature([ComplaintStatusCode]),
    TypeOrmModule.forFeature([AttractantCode]),
    TypeOrmModule.forFeature([HwcrComplaintNatureCode]),
    TypeOrmModule.forFeature([GeoOrgUnitTypeCode]),
    TypeOrmModule.forFeature([GeoOrganizationUnitCode]),
    TypeOrmModule.forFeature([PersonComplaintXrefCode]),
    TypeOrmModule.forFeature([SpeciesCode]),
    TypeOrmModule.forFeature([ViolationCode]),
    TypeOrmModule.forFeature([CosGeoOrgUnit]),
    TypeOrmModule.forFeature([ComplaintTypeCode]),
    TypeOrmModule.forFeature([GirComplaint]),
    TypeOrmModule.forFeature([ComplaintUpdate]),
    TypeOrmModule.forFeature([GirComplaint]),
    TypeOrmModule.forFeature([ActionTaken]),
    CodeTableModule,
    PersonComplaintXrefModule,
    AttractantHwcrXrefModule,
    AutomapperModule,
    ComplaintUpdatesModule,
    StagingComplaintModule,
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
  exports: [ComplaintService],
})
export class ComplaintModule {}
