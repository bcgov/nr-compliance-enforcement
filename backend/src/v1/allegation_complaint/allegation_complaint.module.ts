import { Module } from "@nestjs/common";
import { AllegationComplaintService } from "./allegation_complaint.service";
import { AllegationComplaintController } from "./allegation_complaint.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AllegationComplaint } from "./entities/allegation_complaint.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { CodeTableModule } from "../code-table/code-table.module";
import { AttractantHwcrXrefModule } from "../attractant_hwcr_xref/attractant_hwcr_xref.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AllegationComplaint]),
    TypeOrmModule.forFeature([CosGeoOrgUnit]),
    TypeOrmModule.forFeature([Office]),
    TypeOrmModule.forFeature([Officer]),
    CodeTableModule,
    AttractantHwcrXrefModule,
  ],
  controllers: [AllegationComplaintController],
  providers: [AllegationComplaintService],
})
export class AllegationComplaintModule {}
