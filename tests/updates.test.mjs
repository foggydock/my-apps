import test from 'node:test';
import assert from 'node:assert/strict';
import { updateInfo, loadUpdates } from '../lib/updates.mjs';

const now = new Date('2026-10-23T00:05:00+09:00');
process.env.TZ = 'Asia/Tokyo';
test('midnight uses calendar days rather than elapsed hours', () => {
  assert.equal(updateInfo('2026-10-22T23:55:00+09:00', now).label, 'きのう更新');
  assert.equal(updateInfo('2026-10-23T00:00:00+09:00', now).label, 'きょう更新');
});
test('invalid, absent and future dates never produce misleading text', () => {
  for (const date of [null, undefined, '', 'broken', '2026-10-24T00:00:00+09:00']) assert.equal(updateInfo(date, now), null);
});
test('freshness ends at seven elapsed days', () => {
  assert.equal(updateInfo(new Date(+now - 7 * 86400000).toISOString(), now).fresh, false);
  assert.equal(updateInfo(new Date(+now - 7 * 86400000 + 1).toISOString(), now).fresh, true);
});
test('calendar days remain correct across DST', () => {
  process.env.TZ = 'America/New_York';
  try { assert.equal(updateInfo('2026-03-08T00:30:00-05:00', new Date('2026-03-09T00:05:00-04:00')).label, 'きのう更新'); }
  finally { process.env.TZ = 'Asia/Tokyo'; }
});
test('fetches beyond 100 repos and matches names case-insensitively', async () => {
  const urls = [];
  const result = await loadUpdates('demo', ['target'], { fetcher: async (url) => {
    urls.push(url);
    return { ok: true, json: async () => urls.length === 1 ? Array.from({ length: 100 }, (_, i) => ({ name: `other-${i}` })) : [{ name: 'Target', pushed_at: '2026-10-22T00:00:00Z' }] };
  } });
  assert.equal(urls.length, 2);
  assert.match(urls[1], /page=2/);
  assert.equal(result.target, '2026-10-22T00:00:00Z');
});
test('stops once all required repositories are found', async () => {
  let calls = 0;
  await loadUpdates('demo', ['target'], { fetcher: async () => {
    calls++;
    return { ok: true, json: async () => [{ name: 'target' }, ...Array.from({ length: 99 }, (_, i) => ({ name: `other-${i}` }))] };
  } });
  assert.equal(calls, 1);
});
test('missing repositories terminate at last page', async () => {
  assert.deepEqual(await loadUpdates('demo', ['missing'], { fetcher: async () => ({ ok: true, json: async () => [] }) }), {});
});
test('HTTP and malformed responses are reported', async () => {
  await assert.rejects(loadUpdates('demo', ['target'], { fetcher: async () => ({ ok: false, status: 403 }) }), /403/);
  await assert.rejects(loadUpdates('demo', ['target'], { fetcher: async () => ({ ok: true, json: async () => ({}) }) }), /Invalid/);
});
test('abort signal is passed to fetch', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(loadUpdates('demo', ['target'], { signal: controller.signal, fetcher: async (_, options) => { options.signal.throwIfAborted(); } }), { name: 'AbortError' });
});
