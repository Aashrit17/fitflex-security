import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock localStorage for authentication
    await page.addInitScript(() => {
      localStorage.setItem('userId', 'testUser');
    });

    // Navigate to the dashboard
    await page.goto('https://localhost:5173/dashboard'); // Replace with your actual dashboard route
  });

  test('should display the dashboard and sidebar correctly', async ({ page }) => {
    // Check if the sidebar is visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check if the Home section is active
    const homeTitle = page.locator('h1', { hasText: 'Home' });
    await expect(homeTitle).toBeVisible();
  });

  test('should display the welcome message', async ({ page }) => {
    const welcomeMessage = page.locator('h1'); // Assuming the main heading contains a welcome message
    await expect(welcomeMessage).toContainText('Home');
  });

  test('should logout the user and redirect to login', async ({ page }) => {
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();

    // Ensure user is redirected to login page
    await expect(page).toHaveURL('https://localhost:5173/'); // Update URL if needed
  });

  // ✅ Simple Test: Check if the "Exercise" section is present in the sidebar
  test('should have Exercise section in the sidebar', async ({ page }) => {
    const exerciseSection = page.locator('button:has-text("Exercise")');
    await expect(exerciseSection).toBeVisible();
  });

  // ✅ Simple Test: Check if the "Food Intake" section is present in the sidebar
  test('should have Food Intake section in the sidebar', async ({ page }) => {
    const foodIntakeSection = page.locator('button:has-text("Food Intake")');
    await expect(foodIntakeSection).toBeVisible();
  });

  // ✅ Simple Test: Check if the "Progress" section is present in the sidebar
  test('should have Progress section in the sidebar', async ({ page }) => {
    const progressSection = page.locator('button:has-text("Progress")');
    await expect(progressSection).toBeVisible();
  });
});
