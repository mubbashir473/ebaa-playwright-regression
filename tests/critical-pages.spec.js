const { test, expect } = require('@playwright/test');
const paths = [
  '/', '/products/', '/tech-support/', '/contact/',
  '/webinar/', '/traceability-request/', '/calculator/'
];
for (const route of paths) {
  test(`Critical page opens: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response, 'No document response').not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    expect((await page.title()).trim().length).toBeGreaterThan(0);
  });
}

test('Homepage exposes navigation to products', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('a[href*="/products/"]').first();
  await expect(nav).toHaveAttribute('href', /products/);
});
