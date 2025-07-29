import { test, expect } from '@playwright/test';

test.describe('Registration Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:5173/register');
  });

  test('should load the registration page', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Create an Account');
  });

  test('should not submit the form if required fields are empty', async ({ page }) => {
    await page.click('button:has-text("Register")');

    const errorMessage = page.locator('span.text-gray-400').nth(0);
    await expect(errorMessage).toBeVisible();
  });

  // ✅ Simple Test 2: Ensure that clicking the checkbox works
  test('should allow the user to check the terms and conditions checkbox', async ({ page }) => {
    const termsCheckbox = page.locator('input[type="checkbox"]');
    await termsCheckbox.check();
    await expect(termsCheckbox).toBeChecked();
  });

  // ✅ Simple Test 3: Ensure the "Register" button is visible and enabled
  test('should have a visible and enabled Register button', async ({ page }) => {
    const registerButton = page.locator('button:has-text("Register")');
    await expect(registerButton).toBeVisible();
    await expect(registerButton).toBeEnabled();
  });
});
