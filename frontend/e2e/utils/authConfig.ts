import path from "path";

/**
 * Filepaths that the e2e/auth.setup.ts will write the storage state to.
 * If the value of authFilePath changes you must update the .gitignore as
 * well. The auth cookies should never be commit.
 */
const authFilePath = path.join(process.cwd(), "e2e/.auth");

export const STORAGE_STATE_BY_ROLE = {
  COS: `${authFilePath}/COS.json`,
  CEEB: `${authFilePath}/CEEB.json`,
  PARKS: `${authFilePath}/PARKS.json`,
};
