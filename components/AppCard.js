import { USER } from '../data/apps';
import { updateInfo } from '../lib/updates.mjs';

export default function AppCard({ app, updatedAt, now }) {
  const update = updateInfo(updatedAt, now);
  return (
    <a className="card" href={app.url || `https://${USER}.github.io/${app.repo}/`}>
      <h2>
        <span className="emoji" aria-hidden="true">{app.emoji}</span>
        {app.name}
        {app.locked && <span className="lock" title="合言葉が要ります" aria-label="合言葉が要ります">🔒</span>}
      </h2>
      <p className="desc">{app.desc}</p>
      <div className="meta">
        <span className="tag">{app.tag}</span>
        {update && <time dateTime={update.iso} className={update.fresh ? 'upd fresh' : 'upd'}>{update.label}</time>}
      </div>
    </a>
  );
}
