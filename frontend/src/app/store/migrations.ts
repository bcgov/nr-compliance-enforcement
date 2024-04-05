import { Migration1 } from "./migrations/migration-1";
import { Migration2 } from "./migrations/migration-2";
import { Migration3 } from "./migrations/migration-3";
import { AddOutcomeNote } from "./migrations/migration-4";
import { Migration5 } from "./migrations/migration-5";

const BaseMigration = {
  0: (state: any) => {
    return {
      ...state,
    };
  },
};

let migration = {...BaseMigration}
migration = {
  ...migration, 
  ...Migration1, 
  ...Migration2, 
  ...Migration3,
  ...AddOutcomeNote,
  ...Migration5
};

export default migration;