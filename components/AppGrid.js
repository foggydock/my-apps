'use client';
// ↑ この1行が大事。
// Next.js は既定でサーバー側だけでHTMLを作る。ボタンを押して表示が変わる
// ような「動く部分」は、この印を付けて見ている人のブラウザでも動かす。

import { useEffect, useMemo, useState } from 'react';
import { APPS, USER } from '../data/apps';
import AppCard from './AppCard';

export default function AppGrid() {
  // いま選ばれている絞り込み。setActive を呼ぶと画面が描き直される。
  const [active, setActive] = useState('すべて');

  // リポ名 → 最終更新日 の対応表。GitHubから取れるまでは null。
  const [updated, setUpdated] = useState(null);

  // タグの一覧を台帳から作る。Set を使って重複を消している。
  const tags = useMemo(() => ['すべて', ...new Set(APPS.map((a) => a.tag))], []);

  // 表示するアプリを絞り込む
  const shown = APPS.filter((a) => active === 'すべて' || a.tag === active);

  // 画面が出たあと1回だけ GitHub に聞きに行く
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`
        );
        if (!res.ok) throw new Error(res.status);
        const repos = await res.json();
        if (!alive) return;
        // [{name, pushed_at}, ...] を { name: pushed_at, ... } の形に変える
        setUpdated(Object.fromEntries(repos.map((r) => [r.name, r.pushed_at])));
      } catch {
        // 取れなくてもサイト自体は使えるようにしておく（日付を消すだけ）
        if (alive) setUpdated({});
      }
    }
    load();

    // 表示が消えたあとに結果が返ってきても書き込まないようにする後始末
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <div className="filters">
        {tags.map((t) => (
          <button
            key={t}
            aria-pressed={t === active}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid">
        {shown.map((app) => (
          <AppCard key={app.repo} app={app} updatedAt={updated?.[app.repo]} />
        ))}
      </div>
    </>
  );
}
