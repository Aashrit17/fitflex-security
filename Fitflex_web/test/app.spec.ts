import { test, expect } from '@playwright/test';

test.describe('FitFlex App Navigation', () => {
  test('should load the login page', async ({ page }) => {
    // Update the URL to match the new port
    await page.goto('https://localhost:5173');  // Replace with your app's local URL
    
    // Verify that the Login page is loaded by checking the presence of a login element.
    const loginButton = await page.locator('text=Login');  // Adjust selector based on your UI
    await expect(loginButton).toBeVisible();
  });

});

test.describe('FitFlex Registration Page', () => {
  test('should load the registration page', async ({ page }) => {
    await page.goto('https://localhost:5173/register');
    const heading = await page.locator('h2');
    await expect(heading).toHaveText('Create an Account');
  });




  test('should navigate back to login page', async ({ page }) => {
    await page.goto('https://localhost:5173/register');
    const backToLoginLink = await page.locator('text=Back to Login');
    await backToLoginLink.click();
    await expect(page).toHaveURL('https://localhost:5173/');
  });

});

