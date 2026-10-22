'use client';

import { useEffect, useState } from 'react';
import { APPS, USER } from '../data/apps';
import { loadUpdates } from '../lib/updates.mjs';
import AppCard from './AppCard';

const tags = [...new Set(APPS.map((app) => app.tag))];

export default function AppGrid() {
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');
  const [updated, setUpdated] = useState({});
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const search = query.normalize('NFKC').trim().toLocaleLowerCase('ja');
  const shown = APPS.filter((app) => (active === null || app.tag === active)
    && `${app.name} ${app.desc} ${app.tag}`.normalize('NFKC').toLocaleLowerCase('ja').includes(search));

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, 60000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setStatus('loading');
    loadUpdates(USER, APPS.map((app) => app.repo), { signal: controller.signal })
      .then((result) => {
        if (alive) {
          setUpdated(result);
          setNow(new Date());
          setStatus('ready');
        }
      })
      .catch(() => { if (alive) setStatus('error'); })
      .finally(() => clearTimeout(timeout));
    return () => {
      alive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  return (
    <>
      <div className="search">
        <label htmlFor="app-search">アプリを検索</label>
        <input id="app-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="名前・説明・カテゴリで検索" />
      </div>
      <div className="filters" role="group" aria-label="カテゴリで絞り込み">
        {[null, ...tags].map((tag) => (
          <button key={tag === null ? 'all' : `tag:${tag}`} type="button" aria-pressed={tag === active} onClick={() => setActive(tag)}>
            {tag ?? 'すべて'}
          </button>
        ))}
      </div>
      <p className="result-count" role="status">{shown.length}件のアプリ</p>
      <div className="update-status" role="status">
        {status === 'loading' && '更新日を取得中…'}
        {status === 'error' && <>更新日を取得できませんでした。アプリは開けます。 <button type="button" onClick={() => setAttempt((value) => value + 1)}>再試行</button></>}
      </div>
      <div className="grid">
        {shown.map((app) => <AppCard key={app.repo} app={app} updatedAt={updated[app.repo.toLowerCase()]} now={now} />)}
      </div>
      {shown.length === 0 && <p>該当するアプリがありません。検索語やカテゴリを変えてください。</p>}
    </>
  );
}
