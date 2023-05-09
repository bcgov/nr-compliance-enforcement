import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtAuthModule } from './auth/jwtauth.module';
import { ComplaintStatusCodeModule } from './v1/complaint_status_code/complaint_status_code.module';
import { AgencyCodeModule } from './v1/agency_code/agency_code.module';
import { ComplaintModule } from './v1/complaint/complaint.module';
import { ViolationCodeModule } from './v1/violation_code/violation_code.module';
import { AllegationComplaintModule } from './v1/allegation_complaint/allegation_complaint.module';
import { GeoOrgUnitStructureModule } from './v1/geo_org_unit_structure/geo_org_unit_structure.module';
import { GeoOrganizationUnitCodeModule } from './v1/geo_organization_unit_code/geo_organization_unit_code.module';
import { GeoOrgUnitTypeCodeModule } from './v1/geo_org_unit_type_code/geo_org_unit_type_code.module';
import { OfficeModule } from './v1/office/office.module';
import { PersonModule } from './v1/person/person.module';
import { OfficerModule } from './v1/officer/officer.module';

console.log("Var check - POSTGRESQL_HOST", process.env.POSTGRESQL_HOST);
console.log("Var check - POSTGRESQL_DATABASE", process.env.POSTGRESQL_DATABASE);
console.log("Var check - POSTGRESQL_USER", process.env.POSTGRESQL_USER);
if (process.env.POSTGRESQL_PASSWORD != null ){
  console.log("Var check - POSTGRESQL_PASSWORD present");
} else {
  console.log("Var check - POSTGRESQL_PASSWORD not present");
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRESQL_HOST || "localhost",
      port: 5432,
      database: process.env.POSTGRESQL_DATABASE || "postgres",
      username: process.env.POSTGRESQL_USER || "postgres",
      password: process.env.POSTGRESQL_PASSWORD,
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      schema: "ceds"
    }),
    JwtAuthModule,
    ComplaintStatusCodeModule,
    AgencyCodeModule,
    ComplaintModule,
    ViolationCodeModule,
    AllegationComplaintModule,
    GeoOrgUnitStructureModule,
    GeoOrganizationUnitCodeModule,
    GeoOrgUnitTypeCodeModule,
    OfficeModule,
    PersonModule,
    OfficerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
