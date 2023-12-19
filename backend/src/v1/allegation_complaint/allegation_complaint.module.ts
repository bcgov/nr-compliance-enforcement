import { Module } from "@nestjs/common";
import { AllegationComplaintService } from "./allegation_complaint.service";
import { AllegationComplaintController } from "./allegation_complaint.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AllegationComplaint } from "./entities/allegation_complaint.entity";
import { ComplaintService } from "../complaint/complaint.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { ViolationCodeService } from "../violation_code/violation_code.service";
import { AgencyCodeService } from "../agency_code/agency_code.service";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { ComplaintStatusCodeService } from "../complaint_status_code/complaint_status_code.service";
import { GeoOrganizationUnitCodeService } from "../geo_organization_unit_code/geo_organization_unit_code.service";
import { ViolationCode } from "../violation_code/entities/violation_code.entity";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { CosGeoOrgUnitService } from "../cos_geo_org_unit/cos_geo_org_unit.service";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { OfficeService } from "../office/office.service";
import { OfficerService } from "../officer/officer.service";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { PersonService } from "../person/person.service";
import { Person } from "../person/entities/person.entity";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { CodeTableModule } from "../code-table/code-table.module";
import { AttractantHwcrXrefModule } from "../attractant_hwcr_xref/attractant_hwcr_xref.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AllegationComplaint]),
    TypeOrmModule.forFeature([Complaint]),
    TypeOrmModule.forFeature([ViolationCode]),
    TypeOrmModule.forFeature([AgencyCode]),
    TypeOrmModule.forFeature([ComplaintStatusCode]),
    TypeOrmModule.forFeature([GeoOrganizationUnitCode]),
    TypeOrmModule.forFeature([CosGeoOrgUnit]),
    TypeOrmModule.forFeature([Office]),
    TypeOrmModule.forFeature([Officer]),
    TypeOrmModule.forFeature([Person]),
    TypeOrmModule.forFeature([PersonComplaintXref]),
    TypeOrmModule.forFeature([HwcrComplaint]),
    CodeTableModule,
    AttractantHwcrXrefModule
  ],
  controllers: [AllegationComplaintController],
  providers: [
    AllegationComplaintService,
    ComplaintService,
    ViolationCodeService,
    AgencyCodeService,
    ComplaintStatusCodeService,
    GeoOrganizationUnitCodeService,
    CosGeoOrgUnitService,
    OfficeService,
    OfficerService,
    PersonService,
    PersonComplaintXrefService,
  ],
})
export class AllegationComplaintModule {}
