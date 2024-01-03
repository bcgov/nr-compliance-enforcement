import { Module } from "@nestjs/common";
import { HwcrComplaintService } from "./hwcr_complaint.service";
import { HwcrComplaintController } from "./hwcr_complaint.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintService } from "../complaint/complaint.service";
import { HwcrComplaint } from "./entities/hwcr_complaint.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { AgencyCodeService } from "../agency_code/agency_code.service";
import { ComplaintStatusCodeService } from "../complaint_status_code/complaint_status_code.service";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { GeoOrganizationUnitCodeService } from "../geo_organization_unit_code/geo_organization_unit_code.service";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { SpeciesCodeService } from "../species_code/species_code.service";
import { HwcrComplaintNatureCodeService } from "../hwcr_complaint_nature_code/hwcr_complaint_nature_code.service";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { AttractantCodeService } from "../attractant_code/attractant_code.service";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { CosGeoOrgUnitService } from "../cos_geo_org_unit/cos_geo_org_unit.service";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { OfficeService } from "../office/office.service";
import { OfficerService } from "../officer/officer.service";
import { Person } from "../person/entities/person.entity";
import { PersonService } from "../person/person.service";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";
import { BcGeoCoderService } from "../../external_api/bc_geo_coder/bc_geo_coder.service";
import { HttpModule } from "@nestjs/axios";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { CodeTableModule } from "../code-table/code-table.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([HwcrComplaint]),
    TypeOrmModule.forFeature([Complaint]),
    TypeOrmModule.forFeature([AgencyCode]),
    TypeOrmModule.forFeature([ComplaintStatusCode]),
    TypeOrmModule.forFeature([GeoOrganizationUnitCode]),
    TypeOrmModule.forFeature([SpeciesCode]),
    TypeOrmModule.forFeature([HwcrComplaintNatureCode]),
    TypeOrmModule.forFeature([AttractantHwcrXref]),
    TypeOrmModule.forFeature([AttractantCode]),
    TypeOrmModule.forFeature([CosGeoOrgUnit]),
    TypeOrmModule.forFeature([Office]),
    TypeOrmModule.forFeature([Officer]),
    TypeOrmModule.forFeature([Person]),
    TypeOrmModule.forFeature([PersonComplaintXref]),
    TypeOrmModule.forFeature([AllegationComplaint]),
    CodeTableModule,
    HttpModule,
  ],
  controllers: [HwcrComplaintController],
  providers: [
    HwcrComplaintService,
    ComplaintService,
    AgencyCodeService,
    ComplaintStatusCodeService,
    GeoOrganizationUnitCodeService,
    SpeciesCodeService,
    HwcrComplaintNatureCodeService,
    AttractantHwcrXrefService,
    AttractantCodeService,
    CosGeoOrgUnitService,
    OfficeService,
    OfficerService,
    PersonService,
    PersonComplaintXrefService,
    BcGeoCoderService,
  ],
})
export class HwcrComplaintModule {}
