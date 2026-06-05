import { type Page, type Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Tab buttons
  readonly signInTab: Locator;
  readonly signUpTab: Locator;

  // Form fields
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  // Actions
  readonly submitButton: Locator;

  // Feedback
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInTab    = page.getByRole('button', { name: 'Sign In' });
    this.signUpTab    = page.getByRole('button', { name: 'Sign Up' });
    this.nameInput    = page.getByLabel('Name');
    this.emailInput   = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('p.text-red-600');
  }

  async goto() {
    await this.page.goto('/auth');
  }

  async switchToRegister() {
    await this.signUpTab.click();
    await expect(this.nameInput).toBeVisible();
  }

  async switchToLogin() {
    await this.signInTab.click();
    await expect(this.nameInput).not.toBeVisible();
  }

  async register(email: string, password: string, name?: string) {
    await this.switchToRegister();
    if (name) await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.switchToLogin();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
