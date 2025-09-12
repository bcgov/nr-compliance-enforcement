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
import { AgeCodeModule } from "./case_management/age_code/age_code.module";
import { EquipmentCodeModule } from "./case_management/equipment_code/equipment_code.module";
import { SexCodeModule } from "./case_management/sex_code/sex_code.module";
import { ThreatLevelCodeModule } from "./case_management/threat_level_code/threat_level_code.module";
import { ConflictHistoryCodeModule } from "./case_management/conflict_history_code/conflict_history_code.module";
import { EarCodeModule } from "./case_management/ear_code/ear_code.module";
import { DrugCodeModule } from "./case_management/drug_code/drug_code.module";
import { DrugMethodCodeModule } from "./case_management/drug_method_code/drug_method_code.module";
import { DrugRemainingOutcomeCodeModule } from "./case_management/drug_remaining_outcome_code/drug_remaining_outcome_code.module";
import { HwcrOutcomeCodeModule } from "./case_management/hwcr_outcome_code/hwcr_outcome_code.module";
import { HwcrOutcomeActionedByCodeModule } from "./case_management/hwcr_outcome_actioned_by_code/hwcr_outcome_actioned_by_code.module";
import { ConfigurationModule } from "./case_management/configuration/configuration.module";
import { ComplaintOutcomeModule } from "./case_management/complaint_outcome/complaint_outcome.module";
import { InactionJustificationTypeModule } from "./case_management/inaction_justification_type/inaction_justification_type.module";
import { DateScalar } from "./common/custom_scalars";
import { HWCRPreventionActionModule } from "./case_management/hwcr_prevention_action/hwcr_prevention_action.module";
import { HWCRAssessmentActionModule } from "./case_management/hwcr_assessment_action/hwcr_assessment_action.module";
import { ScheduleCodeModule } from "./case_management/code-tables/schedule_code/schedule_code.module";
import { DischargeCodeModule } from "./case_management/code-tables/discharge_code/discharge_code.module";
import { NonComplianceCodeModule } from "./case_management/code-tables/non_compliance_code/non_compliance_code.module";
import { SectorCodeModule } from "./case_management/code-tables/sector_code/sector_code.module";
import { CEEBDecisionActionModule } from "./case_management/ceeb_decision_action/ceeb_decision_action.module";
import { OutcomeAgencyCodeModule } from "./case_management/agency_code/outcome_agency_code.module";
import { ScheduleSectorXrefModule } from "./case_management/schedule_sector_xref/schedule_sector_xref.module";
import { LeadModule } from "./case_management/lead/lead.module";
import { CaseLocationCodeModule } from "./case_management/code-tables/case_location_code/case_location_code.module";
import { IpmAuthCategoryCodeModule } from "./case_management/ipm_auth_category_code/ipm_auth_category_code.module";
import { PersonModule } from "./shared/person/person.module";
import { ParkModule } from "./shared/park/park.module";
import { AgencyCodeModule } from "./shared/agency_code/agency_code.module";
import { AutomapperModule, InjectMapper } from "@automapper/nestjs";
import { pojos } from "@automapper/pojos";
import { Mapper } from "@automapper/core";
import { initializeMappings } from "./middleware/mapper";
import { EquipmentStatusCodeModule } from "src/case_management/equipment_status_code/equipment_status_code.module";
import { ImportCommand } from "./app.commands";
import { InvestigationModule } from "./investigation/investigation/investigation.module";
import { PrismaModuleInvestigation } from "./prisma/investigation/prisma.investigation.module";
import { CaseFileModule } from "./shared/case_file/case_file.module";
import { PartyModule } from "./shared/party/party.module";
import { InspectionModule } from "./inspection/inspection/inspection.module";
import { PrismaModuleInspection } from "./prisma/inspection/prisma.inspection.module";
import { PartyTypeCodeModule } from "./shared/party_type_code/party_type_code.module";

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
  ],
  controllers: [AppController],
  providers: [AppService, ImportCommand, DateScalar],
})
export class AppModule {
  constructor(@InjectMapper() private readonly mapper: Mapper) {}

  onModuleInit() {
    initializeMappings(this.mapper); // ✅ Ensures mappings are registered after DI is ready
  }

  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
  }
}
