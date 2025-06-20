import path from 'path'

const authFilePath = path.join(process.cwd(), 'e2e/.auth')

export const STORAGE_STATE_BY_ROLE = {
  COS: `${authFilePath}/COS.json`,
  CEEB: `${authFilePath}/CEEB.json`,
}
