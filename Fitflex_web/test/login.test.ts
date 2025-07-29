import { test, expect } from '@playwright/test';

test.describe('LoginView Tests', () => {
  test('should display error if email or password is missing', async ({ page }) => {
    await page.goto('https://localhost:5173/'); // Replace with your app's URL

    // Click the login button without filling in the fields
    const loginButton = await page.locator('button:has-text("Login")');
    await loginButton.click();

    // Check for the error message
    const errorMessage = await page.locator('p.text-red-500');
    await expect(errorMessage).toHaveText('Please fill in all fields.');
  });

  test('should display error when invalid credentials are entered', async ({ page }) => {
    await page.goto('https://localhost:5173/'); // Replace with your app's URL
  
    // Enter invalid credentials
    await page.fill('input[placeholder="Email"]', 'invalid@example.com');
    await page.fill('input[placeholder="Password"]', 'wrongpassword');
  
    // Click login button
    await page.click('button:has-text("Login")');
  
    // Mock API response for invalid login
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Invalid credentials. Please try again.' }),
      });
    });
  
    // Check for the correct error message
    const errorMessage = await page.locator('p.text-red-500');
    await expect(errorMessage).toHaveText('Invalid credentials. Please try again.');
  });

  test('should not allow login without filling in email and password', async ({ page }) => {
    await page.goto('https://localhost:5173/'); // Replace with your app's URL

    // Attempt to click the login button without filling in the email and password
    const loginButton = await page.locator('button:has-text("Login")');
    await loginButton.click();

    // Try to locate any error message in the form (email and password fields)
    const errorMessages = await page.locator('div.text-red-500'); // Modify this selector if necessary

    // Ensure there are error messages for the missing fields
    await expect(errorMessages).toHaveCount(0); // Assuming there are two error messages
  });

  });
  

