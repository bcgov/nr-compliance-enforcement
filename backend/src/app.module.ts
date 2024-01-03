import "dotenv/config";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { pojos } from "@automapper/pojos";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtAuthModule } from "./auth/jwtauth.module";
import { ComplaintStatusCodeModule } from "./v1/complaint_status_code/complaint_status_code.module";
import { AgencyCodeModule } from "./v1/agency_code/agency_code.module";
import { ComplaintModule } from "./v1/complaint/complaint.module";
import { ViolationCodeModule } from "./v1/violation_code/violation_code.module";
import { AllegationComplaintModule } from "./v1/allegation_complaint/allegation_complaint.module";
import { GeoOrgUnitStructureModule } from "./v1/geo_org_unit_structure/geo_org_unit_structure.module";
import { GeoOrganizationUnitCodeModule } from "./v1/geo_organization_unit_code/geo_organization_unit_code.module";
import { GeoOrgUnitTypeCodeModule } from "./v1/geo_org_unit_type_code/geo_org_unit_type_code.module";
import { OfficeModule } from "./v1/office/office.module";
import { PersonModule } from "./v1/person/person.module";
import { OfficerModule } from "./v1/officer/officer.module";
import { SpeciesCodeModule } from "./v1/species_code/species_code.module";
import { HwcrComplaintNatureCodeModule } from "./v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.module";
import { AttractantCodeModule } from "./v1/attractant_code/attractant_code.module";
import { HwcrComplaintModule } from "./v1/hwcr_complaint/hwcr_complaint.module";
import { AttractantHwcrXrefModule } from "./v1/attractant_hwcr_xref/attractant_hwcr_xref.module";
import { CosGeoOrgUnitModule } from "./v1/cos_geo_org_unit/cos_geo_org_unit.module";
import { HTTPLoggerMiddleware } from "./middleware/req.res.logger";
import { PersonComplaintXrefModule } from "./v1/person_complaint_xref/person_complaint_xref.module";
import { PersonComplaintXrefCodeModule } from "./v1/person_complaint_xref_code/person_complaint_xref_code.module";
import { BcGeoCoderModule } from "./external_api/bc_geo_coder/bc_geo_coder.module";
import { ConfigurationModule } from "./v1/configuration/configuration.module";
import { ComplaintTypeCodeModule } from "./v1/complaint_type_code/complaint_type_code.module";
import { CodeTableModule } from "./v1/code-table/code-table.module";
import { ReportedByCodeModule } from "./v1/reported_by_code/reported_by_code.module";

console.log("Var check - POSTGRESQL_HOST", process.env.POSTGRESQL_HOST);
console.log("Var check - POSTGRESQL_DATABASE", process.env.POSTGRESQL_DATABASE);
console.log("Var check - POSTGRESQL_USER", process.env.POSTGRESQL_USER);
if (process.env.POSTGRESQL_PASSWORD != null) {
  console.log("Var check - POSTGRESQL_PASSWORD present");
} else {
  console.log("Var check - POSTGRESQL_PASSWORD not present");
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: "postgres",
          host: process.env.POSTGRESQL_HOST || "localhost",
          port: 5432,
          database: process.env.POSTGRESQL_DATABASE || "postgres",
          username: process.env.POSTGRESQL_USER || "postgres",
          password: process.env.POSTGRESQL_PASSWORD,
          autoLoadEntities: true, // Auto load all entities registered by typeorm forFeature method.
        };
      },
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
    SpeciesCodeModule,
    HwcrComplaintNatureCodeModule,
    AttractantCodeModule,
    HwcrComplaintModule,
    AttractantHwcrXrefModule,
    CosGeoOrgUnitModule,
    PersonComplaintXrefModule,
    PersonComplaintXrefCodeModule,
    BcGeoCoderModule,
    ConfigurationModule,
    ComplaintTypeCodeModule,
    CodeTableModule,
    ReportedByCodeModule,
    AutomapperModule.forRoot({
      strategyInitializer: pojos(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
  }
}
