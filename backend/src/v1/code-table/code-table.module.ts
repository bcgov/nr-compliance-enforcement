import { Module } from "@nestjs/common";
import { CodeTableService } from "./code-table.service";
import { CaseManagementCodeTableController, CodeTableController } from "./code-table.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ViolationCode } from "../violation_code/entities/violation_code.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([AgencyCode]),
    TypeOrmModule.forFeature([AttractantCode]),
    TypeOrmModule.forFeature([ComplaintStatusCode]),
    TypeOrmModule.forFeature([HwcrComplaintNatureCode]),
    TypeOrmModule.forFeature([GeoOrgUnitTypeCode]),
    TypeOrmModule.forFeature([GeoOrganizationUnitCode]),
    TypeOrmModule.forFeature([PersonComplaintXrefCode]),
    TypeOrmModule.forFeature([SpeciesCode]),
    TypeOrmModule.forFeature([ViolationCode]),
    TypeOrmModule.forFeature([CosGeoOrgUnit]),
    TypeOrmModule.forFeature([ComplaintTypeCode]),
    TypeOrmModule.forFeature([ReportedByCode]),
    TypeOrmModule.forFeature([GirTypeCode]),
  ],
  controllers: [CodeTableController, CaseManagementCodeTableController],
  providers: [CodeTableService],
  exports: [CodeTableService],
})
export class CodeTableModule {}
