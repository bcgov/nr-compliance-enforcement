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
};

export default migration;
