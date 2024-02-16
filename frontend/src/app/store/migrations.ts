// import { ExampleMigration } from "./migrations/example";

const BaseMigration = {
  0: (state: any) => {
    return {
      ...state,
    };
  },
};

let migration = {...BaseMigration}
// migration = {...migration, ...ExampleMigration }

export default migration;