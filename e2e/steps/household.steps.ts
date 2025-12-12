import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('I am on the Household quote page', async ({ page }) => {
  await page.goto('/quote/household');
  await expect(page.getByRole('heading', { name: /Household Insurance Quote/i })).toBeVisible();
});

When('I submit the quote form without entering any data', async ({ page }) => {
  // Click the submit button without filling any fields
  await page.getByRole('button', { name: /Create Policy/i }).click();
});

Then('I should see the following validation errors:', async ({ page }, table) => {
  // table.hashes() returns array of objects with the table headers as keys
  const rows: Array<{ message: string }>= table.hashes();
  for (const { message } of rows) {
    await expect(page.getByText(message, { exact: true })).toBeVisible();
  }
});
