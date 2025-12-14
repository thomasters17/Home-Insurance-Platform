import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { ProductQuestions } from '@/lib/types/question.types';

const { Given, When, Then } = createBdd();

// Store the current config for the test
let currentConfig: ProductQuestions;

Given(
  'the household JSON config is:',
  async ({ page }, table) => {
    const questions = table.hashes().map((row: { field: string; isRequired: string; }) => ({
      key: row.field,
      displayText: row.field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, c => c.toUpperCase()),
      type: 'Choice',
      isRequired: row.isRequired === 'true',
      answer: {
        type: 'String',
        values: [{ label: 'Option', value: 'option' }],
      },
    }));

    await page.route('**/data/questions/household.json', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          productType: 'household',
          version: '1.0.0',
          lastUpdated: '2024-12-10',
          questions,
        }),
      })
    );
  }
);

Given('the household JSON config has all fields marked as required', async ({ page }) => {
  currentConfig = {
    productType: 'household',
    version: '1.0.0',
    lastUpdated: '2024-12-10',
    questions: [
      {
        key: 'propertyType',
        displayText: 'Property Type',
        type: 'Choice',
        isRequired: true,
        helpText: 'Select the type of property',
        answer: {
          type: 'String',
          values: [
            { label: 'Detached House', value: 'DetachedHouse' },
            { label: 'Terraced House', value: 'TerracedHouse' },
          ],
        },
      },
      {
        key: 'numberOfBedrooms',
        displayText: 'Number of bedrooms',
        type: 'Choice',
        isRequired: true,
        answer: {
          type: 'Number',
          values: [
            { label: '1 Bedroom', value: '1' },
            { label: '2 Bedrooms', value: '2' },
            { label: '3 Bedrooms', value: '3' },
          ],
        },
      },
      {
        key: 'yearOfConstruction',
        displayText: 'Year of construction',
        type: 'Choice',
        isRequired: true,
        answer: {
          type: 'Number',
          values: [
            { label: 'Pre 1750', value: '1700' },
            { label: '1900-1999', value: '1900' },
          ],
        },
      },
    ],
  };

  await page.route('**/household.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(currentConfig),
    });
  });
});

Given('the household JSON config has all fields marked as optional', async ({ page }) => {
  currentConfig = {
    productType: 'household',
    version: '1.0.0',
    lastUpdated: '2024-12-10',
    questions: [
      {
        key: 'propertyType',
        displayText: 'Property Type',
        type: 'Choice',
        isRequired: false,
        answer: {
          type: 'String',
          values: [{ label: 'House', value: 'house' }],
        },
      },
      {
        key: 'numberOfBedrooms',
        displayText: 'Number of bedrooms',
        type: 'Choice',
        isRequired: false,
        answer: {
          type: 'Number',
          values: [{ label: '3', value: '3' }],
        },
      },
      {
        key: 'yearOfConstruction',
        displayText: 'Year of construction',
        type: 'Choice',
        isRequired: false,
        answer: {
          type: 'Number',
          values: [{ label: '1900', value: '1900' }],
        },
      },
    ],
  };

  await page.route('**/household.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(currentConfig),
    });
  });
});

Given('the household JSON config has {string} marked as required', async ({ page }, fieldKey: string) => {
  if (!currentConfig) {
    currentConfig = {
      productType: 'household',
      version: '1.0.0',
      lastUpdated: '2024-12-10',
      questions: [],
    };
  }

  const existingField = currentConfig.questions.find((q) => q.key === fieldKey);
  if (existingField) {
    existingField.isRequired = true;
  } else {
    currentConfig.questions.push({
      key: fieldKey,
      displayText: fieldKey,
      type: 'Choice' as const,
      isRequired: true,
      answer: {
        type: fieldKey === 'numberOfBedrooms' ? 'Number' : 'String',
        values: [{ label: 'Option', value: '1' }],
      },
    });
  }

  await page.route('**/household.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(currentConfig),
    });
  });
});

Given('the household JSON config has {string} marked as optional', async ({ page }, fieldKey: string) => {
  if (!currentConfig) {
    currentConfig = {
      productType: 'household',
      version: '1.0.0',
      lastUpdated: '2024-12-10',
      questions: [],
    };
  }

  const existingField = currentConfig.questions.find((q) => q.key === fieldKey);
  if (existingField) {
    existingField.isRequired = false;
  } else {
    currentConfig.questions.push({
      key: fieldKey,
      displayText: fieldKey,
      type: 'Choice' as const,
      isRequired: false,
      answer: {
        type: fieldKey === 'numberOfBedrooms' ? 'Number' : 'String',
        values: [{ label: 'Option', value: '1' }],
      },
    });
  }

  await page.route('**/household.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(currentConfig),
    });
  });
});

// WHEN steps
When('I navigate to the {word} quote form', async ({ page }, productType: string) => {
  await page.goto(`/quote/${productType}`);
  await page.waitForLoadState('networkidle');
});

When('I fill in the policyholder information', async ({ page }) => {
  await page.getByLabel('First Name').fill('John');
  await page.getByLabel('Last Name').fill('Doe');
  await page.getByLabel('Date of Birth').fill('1990-01-01');
});

When('I fill in the property address', async ({ page }) => {
  await page.getByLabel('Address Line 1').fill('123 Main Street');
  await page.getByLabel('Postcode').fill('SW1A 1AA');
});

When('I submit the form without filling product questions', async ({ page }) => {
  await page.getByRole('button', { name: 'Create Policy' }).click();
});

When('I submit the form', async ({ page }) => {
  await page.getByRole('button', { name: 'Create Policy' }).click();
});

When('I click on the {string} field', async ({ page }, fieldLabel: string) => {
  await page.getByLabel(fieldLabel).click();
});

When(
  'I click outside the {string} field',
  async ({ page }) => {
    await page.mouse.click(0, 0);
  }
);

// THEN steps
Then('I should see the {string} field marked as required', async ({ page }, fieldLabel: string) => {
  const label = page.getByText(new RegExp(fieldLabel, 'i'));
  const requiredIndicator = label.locator('xpath=.//span[@aria-label="required"]');
  await expect(requiredIndicator).toBeVisible();
});

Then('I should not see required indicators on product question fields', async ({ page }) => {
  const productSection = page.locator('text=Product-Specific Questions').locator('..');
  const requiredIndicators = productSection.locator('[aria-label="required"]');
  await expect(requiredIndicators).toHaveCount(0);
});

Then('I should see a validation error for {string}', async ({ page }, fieldName: string) => {
  const errorRegex = new RegExp(`${fieldName}.*required`, 'i');
  await expect(page.getByText(errorRegex).first()).toBeVisible();
});

Then('I should not see a validation error for {string}', async ({ page }, fieldName) => {
  const errorLocator = page.locator('role=alert', { hasText: fieldName });
  await expect(errorLocator).toHaveCount(0);
});

Then('the form should submit successfully', async ({ page }) => {
  await page.waitForURL(/\/policies\/.+/);
});

Then('I should be redirected to the policy details page', async ({ page }) => {
  await expect(page).toHaveURL(/\/policies\/.+/);
});

Then('I should see {int} validation errors for product questions', async ({ page }, count: number) => {
  const productSection = page.locator('text=Product-Specific Questions').locator('..');
  const errors = productSection.getByRole('alert');
  await expect(errors).toHaveCount(count);
});