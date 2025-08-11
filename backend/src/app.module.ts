import "dotenv/config";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { pojos } from "@automapper/pojos";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtAuthModule } from "./auth/jwtauth.module";
import { ComplaintStatusCodeModule } from "./v1/complaint_status_code/complaint_status_code.module";
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
import { StagingComplaintModule } from "./v1/staging_complaint/staging_complaint.module";
import { EntityCodeModule } from "./v1/entity_code/entity_code.module";
import { StagingMetaDataMappingModule } from "./v1/staging_meta_data_mapping/staging_meta_data_mapping.module";
import { StagingStatusCodeModule } from "./v1/staging_status_code/staging_status_code.module";
import { StagingActivityCodeModule } from "./v1/staging_activity_code/staging_activity_code.module";
import { RequestTokenMiddleware } from "./middleware/req.token";
import { CaseFileModule } from "./v1/shared_data/case_file/case_file.module";
import { ComplaintUpdatesModule } from "./v1/complaint_updates/complaint_updates.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ComplaintSequenceResetScheduler } from "./v1/complaint/complaint-sequence-reset.service";
import { DocumentModule } from "./v1/document/document.module";
import { CdogsModule } from "./external_api/cdogs/cdogs.module";
import { GirTypeCodeModule } from "./v1/gir_type_code/gir_type_code.module";
import { GeneralIncidentComplaintModule } from "./v1/gir_complaint/gir_complaint.module";
import { FeatureFlagModule } from "./v1/feature_flag/feature_flag.module";
import { FeatureCodeModule } from "./v1/feature_code/feature_code.module";
import { TeamModule } from "./v1/team/team.module";
import { TeamCodeModule } from "./v1/team_code/team_code.module";
import { OfficerTeamXrefModule } from "./v1/officer_team_xref/officer_team_xref.module";
import { ComplaintMethodReceivedCodeModule } from "./v1/complaint_method_received_code/complaint_method_received_code.module";
import { CompMthdRecvCdAgcyCdXrefModule } from "./v1/comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.module";
import { LinkedComplaintXrefModule } from "./v1/linked_complaint_xref/linked_complaint_xref.module";
import { ViolationAgencyXrefModule } from "./v1/violation_agency_xref/violation_agency_xref.module";
import { ComplaintReferralModule } from "./v1/complaint_referral/complaint_referral.module";
import { SharedDataModule } from "./v1/shared_data/shared_data.module";
import { ChesModule } from "./external_api/ches/ches.module";
import { EmailReferenceModule } from "./v1/email_reference/email_reference.module";
import { EmailModule } from "./v1/email/email.module";
import { ComplaintReferralEmailLogModule } from "./v1/complaint_referral_email_log/complaint_referral_email_log.module";

console.log("Var check - POSTGRESQL_HOST", process.env.POSTGRESQL_HOST);
console.log("Var check - POSTGRESQL_DATABASE", process.env.POSTGRESQL_DATABASE);
console.log("Var check - POSTGRESQL_USER", process.env.POSTGRESQL_USER);
console.log("Var check - POSTGRESQL_ENABLE_LOGGING", process.env.POSTGRESQL_ENABLE_LOGGING);
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
          schema: "complaint",
          autoLoadEntities: true, // Auto load all entities registered by typeorm forFeature method.
          logging: process.env.POSTGRESQL_ENABLE_LOGGING === "true",
          extra: {
            options: "-c search_path=complaint,public",
          },
        };
      },
    }),
    JwtAuthModule,
    ComplaintStatusCodeModule,
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
    StagingComplaintModule,
    StagingActivityCodeModule,
    StagingStatusCodeModule,
    StagingMetaDataMappingModule,
    EntityCodeModule,
    CaseFileModule,
    ComplaintUpdatesModule,
    ScheduleModule.forRoot(),
    DocumentModule,
    CdogsModule,
    GirTypeCodeModule,
    GeneralIncidentComplaintModule,
    FeatureFlagModule,
    FeatureCodeModule,
    TeamModule,
    TeamCodeModule,
    OfficerTeamXrefModule,
    ComplaintMethodReceivedCodeModule,
    CompMthdRecvCdAgcyCdXrefModule,
    LinkedComplaintXrefModule,
    ViolationAgencyXrefModule,
    ComplaintReferralModule,
    SharedDataModule,
    ChesModule,
    EmailReferenceModule,
    EmailModule,
    ComplaintReferralEmailLogModule,
  ],
  controllers: [AppController],
  providers: [AppService, ComplaintSequenceResetScheduler],
})
export class AppModule {
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).exclude({ path: "", method: RequestMethod.ALL }).forRoutes("*");
    consumer
      .apply(RequestTokenMiddleware)
      .forRoutes(
        "v1/code-table",
        "v1/case",
        "v1/complaint-referral",
        "v1/shared-data",
        "v1/configuration",
        "v1/complaint/search",
        "v1/complaint/map/search",
        "v1/complaint/:complaint_id/add-collaborator/:person_guid",
        "v1/document/export-complaint",
      );
  }
}
