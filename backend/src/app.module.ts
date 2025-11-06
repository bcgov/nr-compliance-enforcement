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
import { AppUserModule } from "./v1/app_user/app_user.module";
import { SpeciesCodeModule } from "./v1/species_code/species_code.module";
import { HwcrComplaintNatureCodeModule } from "./v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.module";
import { AttractantCodeModule } from "./v1/attractant_code/attractant_code.module";
import { HwcrComplaintModule } from "./v1/hwcr_complaint/hwcr_complaint.module";
import { AttractantHwcrXrefModule } from "./v1/attractant_hwcr_xref/attractant_hwcr_xref.module";
import { HTTPLoggerMiddleware } from "./middleware/req.res.logger";
import { AppUserComplaintXrefModule } from "./v1/app_user_complaint_xref/app_user_complaint_xref.module";
import { AppUserComplaintXrefCodeModule } from "./v1/app_user_complaint_xref_code/app_user_complaint_xref_code.module";
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
import { ComplaintOutcomeModule } from "./v1/shared_data/complaint_outcome/complaint_outcome.module";
import { ComplaintUpdatesModule } from "./v1/complaint_updates/complaint_updates.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ComplaintSequenceResetScheduler } from "./v1/complaint/complaint-sequence-reset.service";
import { DocumentModule } from "./v1/document/document.module";
import { CdogsModule } from "./external_api/cdogs/cdogs.module";
import { GirTypeCodeModule } from "./v1/gir_type_code/gir_type_code.module";
import { GeneralIncidentComplaintModule } from "./v1/gir_complaint/gir_complaint.module";
import { FeatureFlagModule } from "./v1/feature_flag/feature_flag.module";
import { FeatureCodeModule } from "./v1/feature_code/feature_code.module";
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
import { OfficeModule } from "./v1/office/office.module";
import { TeamModule } from "./v1/team/team.module";

console.log("Var check - COMPLAINT_POSTGRESQL_HOST", process.env.COMPLAINT_POSTGRESQL_HOST);
console.log("Var check - COMPLAINT_POSTGRESQL_DATABASE", process.env.COMPLAINT_POSTGRESQL_DATABASE);
console.log("Var check - COMPLAINT_POSTGRESQL_USER", process.env.COMPLAINT_POSTGRESQL_USER);
console.log("Var check - COMPLAINT_POSTGRESQL_ENABLE_LOGGING", process.env.COMPLAINT_POSTGRESQL_ENABLE_LOGGING);
if (process.env.COMPLAINT_POSTGRESQL_PASSWORD != null) {
  console.log("Var check - COMPLAINT_POSTGRESQL_PASSWORD present");
} else {
  console.log("Var check - COMPLAINT_POSTGRESQL_PASSWORD not present");
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: "postgres",
          host: process.env.COMPLAINT_POSTGRESQL_HOST || "localhost",
          port: 5432,
          database: process.env.COMPLAINT_POSTGRESQL_DATABASE || "postgres",
          username: process.env.COMPLAINT_POSTGRESQL_USER || "postgres",
          password: process.env.COMPLAINT_POSTGRESQL_PASSWORD,
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
    AppUserModule,
    SpeciesCodeModule,
    HwcrComplaintNatureCodeModule,
    AttractantCodeModule,
    HwcrComplaintModule,
    AttractantHwcrXrefModule,
    AppUserComplaintXrefModule,
    AppUserComplaintXrefCodeModule,
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
    ComplaintOutcomeModule,
    ComplaintUpdatesModule,
    ScheduleModule.forRoot(),
    DocumentModule,
    CdogsModule,
    GirTypeCodeModule,
    GeneralIncidentComplaintModule,
    FeatureFlagModule,
    FeatureCodeModule,
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
    OfficeModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService, ComplaintSequenceResetScheduler],
})
export class AppModule {
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).exclude({ path: "", method: RequestMethod.ALL }).forRoutes("*");
    consumer.apply(RequestTokenMiddleware).forRoutes(
      "v1/code-table",
      "v1/case",
      "v1/complaint-outcome",
      "v1/complaint-referral",
      "v1/shared-data",
      "v1/configuration",
      "v1/complaint/search", //Note: these all have to be explict paths of the @Public decorator will fail breaking the webEOC integration.
      "v1/complaint/map/search",
      "v1/complaint/:complaint_id/add-collaborator/:app_user_guid",
      "v1/document/export-complaint",
    );
  }
}
