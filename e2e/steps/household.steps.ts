import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { loadFormDefinition, getRequiredFieldErrors } from '../helpers/formHelpers';
import {ProductType} from "@/lib/types/policy.types";

const { Given, When, Then } = createBdd();

Given('I am on the {string} quote page', async ({ page }, productType: string) => {
  await page.goto(`/quote/${productType}`);
  await expect(page.getByRole('heading', { name: new RegExp(productType, 'i') })).toBeVisible();
});

When('I submit the quote form without entering any data', async ({ page }) => {
  await page.getByRole('button', { name: /Create Policy/i }).click();
});

Then('I should see all required field errors for {string}', async ({ page }, productType: string) => {
  const formJson = loadFormDefinition(productType as ProductType);
  const expectedErrors = getRequiredFieldErrors(formJson);

  for (const message of expectedErrors) {
    await expect(page.getByText(message, { exact: true })).toBeVisible();
  }
});
