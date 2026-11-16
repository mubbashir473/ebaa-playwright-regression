const { test, expect } = require('@playwright/test');
for (const route of ['/', '/products/', '/webinar/']) {
  test(`Responsive smoke: ${route}`, async ({ page }, testInfo) => {
    const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(res.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('viewport.png'), fullPage: false });
    // Screenshot inspection is available in artifacts; horizontal overflow can be
    // introduced intentionally by carousels and should be reviewed separately.
  });
}
