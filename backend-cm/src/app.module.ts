import "dotenv/config";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HTTPLoggerMiddleware } from "./middleware/req.res.logger";
import { PrismaModuleComplaintOutcome } from "./prisma/complaint_outcome/prisma.complaint_outcome.module";
import { PrismaModuleShared } from "./prisma/shared/prisma.shared.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { JwtAuthModule } from "./auth/jwtauth.module";
import { AgeCodeModule } from "./complaint_outcome/age_code/age_code.module";
import { EquipmentCodeModule } from "./complaint_outcome/equipment_code/equipment_code.module";
import { SexCodeModule } from "./complaint_outcome/sex_code/sex_code.module";
import { ThreatLevelCodeModule } from "./complaint_outcome/threat_level_code/threat_level_code.module";
import { ConflictHistoryCodeModule } from "./complaint_outcome/conflict_history_code/conflict_history_code.module";
import { EarCodeModule } from "./complaint_outcome/ear_code/ear_code.module";
import { DrugCodeModule } from "./complaint_outcome/drug_code/drug_code.module";
import { DrugMethodCodeModule } from "./complaint_outcome/drug_method_code/drug_method_code.module";
import { DrugRemainingOutcomeCodeModule } from "./complaint_outcome/drug_remaining_outcome_code/drug_remaining_outcome_code.module";
import { HwcrOutcomeCodeModule } from "./complaint_outcome/hwcr_outcome_code/hwcr_outcome_code.module";
import { HwcrOutcomeActionedByCodeModule } from "./complaint_outcome/hwcr_outcome_actioned_by_code/hwcr_outcome_actioned_by_code.module";
import { ConfigurationModule } from "./complaint_outcome/configuration/configuration.module";
import { ComplaintOutcomeModule } from "./complaint_outcome/complaint_outcome/complaint_outcome.module";
import { InactionJustificationTypeModule } from "./complaint_outcome/inaction_justification_type/inaction_justification_type.module";
import { DateScalar, JSONObjectScalar, PointScalar } from "./common/custom_scalars";
import { HWCRPreventionActionModule } from "./complaint_outcome/hwcr_prevention_action/hwcr_prevention_action.module";
import { HWCRAssessmentActionModule } from "./complaint_outcome/hwcr_assessment_action/hwcr_assessment_action.module";
import { ScheduleCodeModule } from "./complaint_outcome/code-tables/schedule_code/schedule_code.module";
import { DischargeCodeModule } from "./complaint_outcome/code-tables/discharge_code/discharge_code.module";
import { NonComplianceCodeModule } from "./complaint_outcome/code-tables/non_compliance_code/non_compliance_code.module";
import { SectorCodeModule } from "./complaint_outcome/code-tables/sector_code/sector_code.module";
import { CEEBDecisionActionModule } from "./complaint_outcome/ceeb_decision_action/ceeb_decision_action.module";
import { OutcomeAgencyCodeModule } from "./complaint_outcome/agency_code/outcome_agency_code.module";
import { ScheduleSectorXrefModule } from "./complaint_outcome/schedule_sector_xref/schedule_sector_xref.module";
import { LeadModule } from "./complaint_outcome/lead/lead.module";
import { CaseLocationCodeModule } from "./complaint_outcome/code-tables/case_location_code/case_location_code.module";
import { IpmAuthCategoryCodeModule } from "./complaint_outcome/ipm_auth_category_code/ipm_auth_category_code.module";
import { PersonModule } from "./shared/person/person.module";
import { ParkModule } from "./shared/park/park.module";
import { AgencyCodeModule } from "./shared/agency_code/agency_code.module";
import { AutomapperModule, InjectMapper } from "@automapper/nestjs";
import { pojos } from "@automapper/pojos";
import { Mapper } from "@automapper/core";
import { initializeMappings } from "./middleware/mapper";
import { EquipmentStatusCodeModule } from "src/complaint_outcome/equipment_status_code/equipment_status_code.module";
import { ImportCommand } from "./app.commands";
import { InvestigationModule } from "./investigation/investigation/investigation.module";
import { PrismaModuleInvestigation } from "./prisma/investigation/prisma.investigation.module";
import { CaseFileModule } from "./shared/case_file/case_file.module";
import { PartyModule } from "./shared/party/party.module";
import { InspectionModule } from "./inspection/inspection/inspection.module";
import { PrismaModuleInspection } from "./prisma/inspection/prisma.inspection.module";
import { PartyTypeCodeModule } from "./shared/party_type_code/party_type_code.module";
import { CaseActivityModule } from "src/shared/case_activity/case_activity.module";
import { EventModule } from "./shared/event/event.module";
import { EventPublisherModule } from "./event_publisher/event_publisher.module";
import { InvestigationPartyModule } from "./investigation/investigation_party/investigation_party.module";
import { OfficeModule } from "./shared/office/office.module";
import { TeamCodeModule } from "./shared/team_code/team_code.module";
import { TeamModule } from "./shared/team/team.module";
import { GeoOrgUnitTypeCodeModule } from "./shared/geo_org_unit_type_code/geo_org_unit_type_code.module";
import { GeoOrganizationUnitCodeModule } from "./shared/geo_organization_unit_code/geo_organization_unit_code.module";
import { CosGeoOrgUnitModule } from "./shared/cos_geo_org_unit/cos_geo_org_unit.module";
import { AppUserModule } from "./shared/app_user/app_user.module";
import { AppUserTeamXrefModule } from "./shared/app_user_team_xref/app_user_team_xref.module";
import { InspectionPartyModule } from "./inspection/inspection_party/inspection_party.module";
import { ContinuationReportModule } from "src/investigation/continuation_report/continuation_report.module";
import { PartyAssociationRoleModule } from "./shared/party_association_role/party_association_role.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModuleComplaintOutcome,
    PrismaModuleShared,
    PrismaModuleInvestigation,
    PrismaModuleInspection,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./dist/**/*.graphql", "./src/**/*.graphql"],
      context: ({ req }) => ({ req }),
    }),
    AutomapperModule.forRoot({
      strategyInitializer: pojos(),
    }),
    JwtAuthModule,
    AgeCodeModule,
    OutcomeAgencyCodeModule,
    EquipmentCodeModule,
    SexCodeModule,
    ThreatLevelCodeModule,
    ConflictHistoryCodeModule,
    EarCodeModule,
    DrugCodeModule,
    DrugMethodCodeModule,
    DrugRemainingOutcomeCodeModule,
    HwcrOutcomeCodeModule,
    HwcrOutcomeActionedByCodeModule,
    ConfigurationModule,
    HWCRAssessmentActionModule,
    HWCRPreventionActionModule,
    ComplaintOutcomeModule,
    InactionJustificationTypeModule,
    ScheduleCodeModule,
    DischargeCodeModule,
    NonComplianceCodeModule,
    SectorCodeModule,
    CEEBDecisionActionModule,
    ScheduleSectorXrefModule,
    LeadModule,
    CaseLocationCodeModule,
    IpmAuthCategoryCodeModule,
    PersonModule,
    ParkModule,
    AgencyCodeModule,
    CaseFileModule,
    EquipmentStatusCodeModule,
    InvestigationModule,
    PartyModule,
    InspectionModule,
    PartyTypeCodeModule,
    CaseActivityModule,
    EventModule,
    EventPublisherModule,
    InvestigationPartyModule,
    OfficeModule,
    TeamCodeModule,
    TeamModule,
    GeoOrgUnitTypeCodeModule,
    GeoOrganizationUnitCodeModule,
    CosGeoOrgUnitModule,
    AppUserModule,
    AppUserTeamXrefModule,
    InspectionPartyModule,
    ContinuationReportModule,
    PartyAssociationRoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, ImportCommand, DateScalar, JSONObjectScalar, PointScalar],
})
export class AppModule {
  constructor(@InjectMapper() private readonly mapper: Mapper) {}

  onModuleInit() {
    initializeMappings(this.mapper); // ✅ Ensures mappings are registered after DI is ready
  }

  // let's add a middleware on all routes.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
  }
}
