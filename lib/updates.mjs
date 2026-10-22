const DAY = 86400000;

// Calendar dates in the viewer's timezone; elapsed 24-hour periods mislabel midnight.
export function updateInfo(iso, now = new Date()) {
  const date = typeof iso === 'string' ? new Date(iso) : new Date(NaN);
  if (!Number.isFinite(date.getTime()) || date > now) return null;
  const calendarDay = (value) => Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
  const days = Math.round((calendarDay(now) - calendarDay(date)) / DAY);
  const label = days === 0 ? 'きょう更新' : days === 1 ? 'きのう更新'
    : days < 30 ? `${days}日前に更新`
    : days < 365 ? `${Math.floor(days / 30)}か月前に更新`
    : `${Math.floor(days / 365)}年前に更新`;
  return { label, fresh: now - date < 7 * DAY, iso: date.toISOString() };
}

export async function loadUpdates(user, names, { signal, fetcher = fetch } = {}) {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  const result = {};
  for (let page = 1; wanted.size; page += 1) {
    const response = await fetcher(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=full_name&page=${page}`,
      { signal },
    );
    if (!response.ok) throw new Error(`GitHub: ${response.status}`);
    const repos = await response.json();
    if (!Array.isArray(repos)) throw new Error('Invalid repository list');
    for (const repo of repos) {
      if (typeof repo?.name !== 'string') continue;
      const name = repo.name.toLowerCase();
      if (!wanted.has(name)) continue;
      result[name] = typeof repo.pushed_at === 'string' ? repo.pushed_at : null;
      wanted.delete(name);
    }
    if (repos.length < 100) break;
  }
  return result;
}
