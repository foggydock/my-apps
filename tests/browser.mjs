import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { APPS } from '../data/apps.js';
import { mkdir } from 'node:fs/promises';
await mkdir('.test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, timezoneId: 'Asia/Tokyo' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
let mode = 'success';
let apiPages = [];
let blocked = [];
await context.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.origin === 'http://127.0.0.1:3100') return route.continue();
  if (url.hostname === 'api.github.com') {
    apiPages.push(url.searchParams.get('page'));
    if (mode === 'failure') return route.fulfill({ status: 403, json: { message: 'fixture rate limit' } });
    if (mode === 'malformed') return route.fulfill({ json: { invalid: true } });
    if (mode === 'timeout') return;
    if (mode === 'pages' && url.searchParams.get('page') === '1') return route.fulfill({ json: Array.from({ length: 100 }, (_, i) => ({ name: `fixture-${i}`, pushed_at: null })) });
    return route.fulfill({ json: APPS.map((app, i) => ({ name: app.repo.toUpperCase(), pushed_at: i === 0 ? 'invalid' : i === 1 ? '2099-01-01T00:00:00Z' : '2026-10-22T14:55:00Z' })) });
  }
  blocked.push(url.origin);
  return route.fulfill({ contentType: 'text/html', body: '<h1>Dummy destination</h1>' });
});
await page.clock.install({ time: new Date('2026-10-23T00:05:00+09:00') });
const open = async () => { await page.goto('http://127.0.0.1:3100/my-apps/'); await page.waitForFunction(() => !document.body.textContent.includes('更新日を取得中')); };
await open();
assert.equal(await page.locator('.card').count(), APPS.length);
assert.equal(await page.locator('time').count(), APPS.length - 2);
assert.equal(await page.locator('time').first().textContent(), 'きのう更新');
await page.getByRole('button', { name: '学ぶ', exact: true }).click();
assert.equal(await page.locator('.card').count(), APPS.filter(a => a.tag === '学ぶ').length);
await page.getByRole('searchbox').fill('ＡＷＳ');
assert.equal(await page.locator('.card').count(), 2);
await page.getByRole('searchbox').fill('存在しないダミー');
assert.equal(await page.locator('.card').count(), 0);
assert.ok(await page.getByText('該当するアプリがありません。検索語やカテゴリを変えてください。').isVisible());
await page.getByRole('searchbox').fill('');
await page.getByRole('button', { name: 'すべて', exact: true }).click();
await page.getByRole('searchbox').focus(); await page.keyboard.press('Tab');
assert.equal(await page.evaluate(() => document.activeElement.textContent), 'すべて');
await page.clock.resume();
await page.screenshot({ path: '.test-results/desktop.png', fullPage: true });
for (const width of [280, 320, 390]) {
  await page.setViewportSize({ width, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
}
await page.waitForTimeout(150);
await page.screenshot({ path: '.test-results/mobile.png' });
await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
await page.waitForTimeout(150);
await page.screenshot({ path: '.test-results/dark.png' });
await page.locator('.card').first().click();
assert.equal(await page.locator('h1').textContent(), 'Dummy destination');
mode = 'failure'; await open();
assert.ok(await page.getByRole('button', { name: '再試行' }).isVisible());
assert.equal(await page.locator('.card').count(), APPS.length);
mode = 'pages'; apiPages = [];
await page.getByRole('button', { name: '再試行' }).click();
await page.waitForFunction(() => document.querySelectorAll('time').length > 0);
assert.deepEqual(apiPages, ['1', '2']);
mode = 'malformed'; await open();
assert.ok(await page.getByRole('button', { name: '再試行' }).isVisible());
mode = 'timeout'; await page.goto('http://127.0.0.1:3100/my-apps/');
await page.waitForFunction(() => document.body.textContent.includes('更新日を取得中'));
await page.clock.fastForward(16000);
await page.getByRole('button', { name: '再試行' }).waitFor();
mode = 'success'; await open();
await page.clock.fastForward(24 * 60 * 60 * 1000);
assert.equal(await page.locator('time').first().textContent(), '2日前に更新');
assert.deepEqual(errors, []);
console.log(JSON.stringify({ result: 'PASS', cases: ['render', 'invalid/future date', 'calendar midnight', 'category', 'search normalization', 'empty results', 'keyboard', '280/320/390px', 'dark/reduced-motion', 'dummy navigation', '403 fallback', 'retry', 'pagination', 'malformed API', 'timeout', 'next-day refresh'], pageErrors: errors, externalRequestsSent: 0, destinationsMocked: blocked.length }));
} finally { await browser.close(); }
