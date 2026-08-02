import AppGrid from '../components/AppGrid';
import { USER } from '../data/apps';

// このファイルがトップページ（/）になる。
export default function Home() {
  return (
    <div className="wrap">
      <header>
        <h1>🧰 つくったもの棚</h1>
        <p className="lead">
          これまで作って公開しているアプリの一覧です。カードを押すとそのアプリが開きます。
        </p>
      </header>

      <AppGrid />

      <footer>
        最終更新日は GitHub から自動取得しています ·{' '}
        <a href={`https://github.com/${USER}`}>github.com/{USER}</a>
      </footer>
    </div>
  );
}
