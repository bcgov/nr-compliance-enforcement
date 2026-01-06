import { Migration1 } from "./migrations/migration-1";
import { Migration2 } from "./migrations/migration-2";
import { Migration3 } from "./migrations/migration-3";
import { AddOutcomeNote } from "./migrations/migration-4";
import { AddPersonGuidAndOutcomeReview } from "./migrations/migration-5";
import { AddEquipment } from "./migrations/migration-6";
import { AddIsInEdit } from "./migrations/migration-7";
import { AddGirTypeCode } from "./migrations/migration-8";
import { AddWebEOCChangeCount } from "./migrations/migration-9";
import { RebuildCodeTable } from "./migrations/migration-11";
import { AddFeatureFlag } from "./migrations/migration-12";
import { ActiveTab } from "./migrations/migration-13";
import { AddTeamCode } from "./migrations/migration-14";
import { Decision } from "./migrations/migration-15";
import { AddComplaintMethodReceivedCodes } from "./migrations/migration-16";
import { AddLeadAgencyCode } from "./migrations/migration-17";
import { AddScheduleSectorTypes } from "./migrations/migration-18";
import { AddComplaintSearchParameters } from "./migrations/migration-19";
import { DrugAdministeredChanges } from "./migrations/migration-20";
import { AddCat1TypeAndLocationType } from "./migrations/migration-21";
import { AddActiveComplaintsViewType } from "./migrations/migration-22";
import { AssessmentTypeUpdates } from "./migrations/migration-23";
import { AddComsEnrolledInd } from "./migrations/migration-24";
import { UpdateMapLogicForClustering } from "./migrations/migration-25";
import { ComplaintReadOnlyIndicator } from "./migrations/migration-26";
import { AddIPMAuthCategoryCode } from "./migrations/migration-27";
import { AddComplaintReferral } from "./migrations/migration-28";
import { AddEquipmentStatusCode } from "./migrations/migration-29";
import { addHwcrOutcomeActionedByCodes } from "./migrations/migration-30";
import { AddParkAreaCode } from "@/app/store/migrations/migration-31";
import { MultipleAssessments } from "@/app/store/migrations/migration-32";
import { AddParkCache } from "@/app/store/migrations/migration-33";
import { MultiplePreventions } from "@/app/store/migrations/migration-34";
import { ExternalAgencies } from "@/app/store/migrations/migration-35";
import { AddEmailReference } from "@/app/store/migrations/migration-36";
import { AddSectorComplaints } from "@/app/store/migrations/migration-37";
import { AddPartyType } from "./migrations/migration-38";
import { AddPartyAssociationRole } from "./migrations/migration-39";
import { AddTaskTables } from "./migrations/migration-40";
import { AddTaskAttachments } from "@/app/store/migrations/migration-41";

const BaseMigration = {
  0: (state: any) => {
    return {
      ...state,
    };
  },
};

let migration = { ...BaseMigration };
migration = {
  ...migration,
  ...Migration1,
  ...Migration2,
  ...Migration3,
  ...AddOutcomeNote,
  ...AddPersonGuidAndOutcomeReview,
  ...AddEquipment,
  ...AddIsInEdit,
  ...AddGirTypeCode,
  ...AddWebEOCChangeCount,
  ...RebuildCodeTable,
  ...AddFeatureFlag,
  ...ActiveTab,
  ...AddTeamCode,
  ...Decision,
  ...AddComplaintMethodReceivedCodes,
  ...AddLeadAgencyCode,
  ...AddScheduleSectorTypes,
  ...AddComplaintSearchParameters,
  ...DrugAdministeredChanges,
  ...AddCat1TypeAndLocationType,
  ...AddActiveComplaintsViewType,
  ...AssessmentTypeUpdates,
  ...AddComsEnrolledInd,
  ...UpdateMapLogicForClustering,
  ...ComplaintReadOnlyIndicator,
  ...AddIPMAuthCategoryCode,
  ...AddComplaintReferral,
  ...AddEquipmentStatusCode,
  ...addHwcrOutcomeActionedByCodes,
  ...AddParkAreaCode,
  ...MultipleAssessments,
  ...AddParkCache,
  ...MultiplePreventions,
  ...ExternalAgencies,
  ...AddEmailReference,
  ...AddSectorComplaints,
  ...AddPartyType,
  ...AddPartyAssociationRole,
  ...AddTaskTables,
  ...AddTaskAttachments,
};

export default migration;
