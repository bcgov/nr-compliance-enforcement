import { STORAGE_STATE_BY_ROLE } from './utils/authConfig'
import { test, expect } from '@playwright/test'

/**
 * Tests can declare which storage to use for an entire test file
 * which will then apply to tests below that point
 */
test.use({ storageState: STORAGE_STATE_BY_ROLE.COS })
test('Sample COS test', async ({ page }) => {
  // page is authenticated as a COS user
  await page.goto('/protected-by-role')
  await expect(page.getByText('You have a valid role! 🤩')).toBeVisible()
})

test.describe('CEEB tests', () => {
  /**
   * The storage being used can be overridden for specific tests
   */
  test.use({ storageState: STORAGE_STATE_BY_ROLE.CEEB })

  test('Sample CEEB test', async ({ page }) => {
    // page is authenticated as a CEEB user
    // should not have access.
    await page.goto('/protected-by-role')
    await expect(page.getByText('Not authorized 😠')).toBeVisible()
  })
})
