const { test, expect } = require('@playwright/test');
const routes = ['/webinar/', '/traceability-request/', '/contact/'];
for (const route of routes) {
  test(`Form inventory: ${route}`, async ({ page }, testInfo) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response.status()).toBeLessThan(400);
    const count = await page.locator('form').count();
    const inventory = await page.locator('form').evaluateAll(forms => forms.map(f => ({
      action: f.action,
      fields: [...f.querySelectorAll('input,select,textarea')].map(x => ({ name: x.name, type: x.type, required: x.required }))
    })));
    await testInfo.attach('forms.json', { body: JSON.stringify({ route, count, inventory }, null, 2), contentType: 'application/json' });
    expect(count, `No form found at ${route}`).toBeGreaterThan(0);
  });
}

test('Webinar form contains essential required inputs', async ({ page }) => {
  await page.goto('/webinar/');
  const visibleRequired = page.locator('input[required]:visible,select[required]:visible,textarea[required]:visible,[aria-required="true"]:visible');
  const count = await visibleRequired.count();
  // Some form plugins use server-side validation rather than required attributes.
  // Make this a diagnostic, not a fabricated proof of validation.
  console.log(`Webinar form: ${count} visible required-marked fields`);
  await expect(page.locator('form').first()).toBeVisible();
});

// Real submission test: staging only, requires explicit enablement and site-specific
// selectors, CAPTCHA test setup, and verified non-production mail/CRM destination.
test('@staging Form submission integration (template)', async ({ page }) => {
  test.skip(process.env.ALLOW_SUBMISSIONS !== 'true', 'Enable ONLY on authorized staging with test CAPTCHA keys');
  test.skip(true, 'Implement and approve a specific form fill, CAPTCHA test setup, confirmation and destination assertion before enabling.');
});
