import { Migration1 } from "./migrations/migration-1";

const BaseMigration = {
  0: (state: any) => {
    return {
      ...state,
    };
  },
};

let migration = {...BaseMigration}
migration = {...migration, ...Migration1 }

export default migration;