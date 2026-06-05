import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';

// Each test gets a unique email so there are no conflicts between parallel runs
function uniqueEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
}

test.describe('Register', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test('shows Sign In tab by default', async () => {
    await expect(authPage.nameInput).not.toBeVisible();
    await expect(authPage.emailInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
  });

  test('switching to Sign Up reveals the Name field', async () => {
    await authPage.switchToRegister();
    await expect(authPage.nameInput).toBeVisible();
  });

  test('switching back to Sign In hides the Name field', async () => {
    await authPage.switchToRegister();
    await authPage.switchToLogin();
    await expect(authPage.nameInput).not.toBeVisible();
  });

  test('successful registration redirects to /profile', async ({ page }) => {
    await authPage.register(uniqueEmail(), 'password123', 'Test User');
    await expect(page).toHaveURL('/profile');
  });

  test('successful registration without a name still works', async ({ page }) => {
    await authPage.register(uniqueEmail(), 'password123');
    await expect(page).toHaveURL('/profile');
  });

  test('shows error for invalid email format', async () => {
    await authPage.switchToRegister();
    await authPage.nameInput.fill('Test User');
    await authPage.emailInput.fill('not-an-email');
    await authPage.passwordInput.fill('password123');
    await authPage.submitButton.click();
    await expect(authPage.errorMessage).toBeVisible();
  });

  test('shows error when password is too short', async () => {
    await authPage.switchToRegister();
    await authPage.emailInput.fill(uniqueEmail());
    await authPage.passwordInput.fill('short');
    await authPage.submitButton.click();
    await expect(authPage.errorMessage).toBeVisible();
  });

  test('shows error when email is already registered', async ({ page }) => {
    const email = uniqueEmail();

    // First registration — should succeed
    await authPage.register(email, 'password123', 'Test User');
    await expect(page).toHaveURL('/profile');

    // Log out and go back to auth
    await page.goto('/auth');

    // Second registration with same email — should fail
    await authPage.register(email, 'password123', 'Test User');
    await expect(authPage.errorMessage).toBeVisible();
    await expect(authPage.errorMessage).toContainText('already');
  });
});
