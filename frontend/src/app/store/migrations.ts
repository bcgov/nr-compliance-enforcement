import { Migration1 } from "./migrations/migration-1";

const BaseMigration = {
  0: (state: any) => {
    return {
      ...state,
    };
  },
};

let migration = {...BaseMigration}
// Uncomment the line below when Migration has been filled out
migration = {...migration, ...Migration1 }

export default migration;