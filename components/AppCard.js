'use client';

import { USER } from '../data/apps';

// 日付を「5日前に更新」のような読みやすい言葉に直す
function ago(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days <= 0) return 'きょう更新';
  if (days === 1) return 'きのう更新';
  if (days < 30) return `${days}日前に更新`;
  if (days < 365) return `${Math.floor(days / 30)}か月前に更新`;
  return `${Math.floor(days / 365)}年前に更新`;
}

// カード1枚ぶん。app と updatedAt を受け取って見た目を返すだけ。
export default function AppCard({ app, updatedAt }) {
  const isFresh = updatedAt && Date.now() - new Date(updatedAt) < 7 * 86400000;

  return (
    <a className="card" href={app.url || `https://${USER}.github.io/${app.repo}/`}>
      <h2>
        <span className="emoji">{app.emoji}</span>
        {app.name}
        {app.locked && <span className="lock" title="合言葉が要ります">🔒</span>}
      </h2>

      <p className="desc">{app.desc}</p>

      <div className="meta">
        <span className="tag">{app.tag}</span>
        <span className={isFresh ? 'upd fresh' : 'upd'}>
          {updatedAt ? ago(updatedAt) : ''}
        </span>
      </div>
    </a>
  );
}
