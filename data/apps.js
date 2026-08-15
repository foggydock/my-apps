// ここがこのサイトの「台帳」です。
// アプリを増やしたら、この配列に1行足すだけで一覧に出ます。
//
//   repo  : GitHub のリポジトリ名。最終更新日の取得と、リンク先の既定値に使う
//   name  : 表示する名前
//   emoji : カードの頭に出る絵文字
//   tag   : 絞り込みボタンのグループ。新しい言葉を書けばボタンも自動で増える
//   desc  : 一言説明
//   url   : 省略可。GitHub Pages 以外（Cloudflare Pages など）で公開している場合だけ書く。
//           書かなければ既定で https://USER.github.io/repo/ になる

export const USER = 'foggydock';

export const APPS = [
  {
    repo: 'code-quiz',
    name: 'コード理解クイズ',
    emoji: '🧩',
    tag: '学ぶ',
    desc: '自分のアプリのコードやClaude Codeの仕組みから4択で出題。AWS学習の息抜きに。',
  },
  {
    repo: 'aws-quiz',
    name: 'AWS CLF 問題集',
    emoji: '☁️',
    tag: '学ぶ',
    desc: 'クラウドプラクティショナー対策。通勤中にオフラインで解ける忘却曲線つき問題集。',
  },
  {
    repo: 'rekishi-log',
    name: '歴史ログ',
    emoji: '📜',
    tag: '学ぶ',
    desc: 'ポッドキャストの文字起こしを貼るとAIが振り分け、年表とテーマが日々育つ。',
  },
  {
    repo: 'satto-task',
    name: 'サッとタスク',
    emoji: '✅',
    tag: '記録',
    desc: 'スマホでサッと開いて書けるだけのタスク管理。余計な機能を足さない。',
  },
  {
    repo: 'my-routine',
    name: 'ルーティン',
    emoji: '🔁',
    tag: '記録',
    desc: '自分で決めた周期の定期作業を管理。次にやる日が近い順に並ぶ。',
  },
  {
    repo: 'place-log',
    name: '行った場所ノート',
    emoji: '📍',
    tag: '記録',
    desc: '訪れた場所を自分のジャンルで記録。訪問履歴が積み上がり、地図にピンが立つ。',
  },
  {
    repo: 'my-music-log',
    name: 'ミュージックログ',
    emoji: '🎵',
    tag: '記録',
    desc: 'いいなと思った曲のURLを貼るだけ。曲名・歌手・カバー画像が自動で入る。',
  },
  {
    repo: 'newspaper-ads',
    name: '新聞広告アーカイブ',
    emoji: '📰',
    tag: '記録',
    desc: '気になった新聞広告を写真で残して検索できるようにした個人用アーカイブ。',
    locked: true,
  },
  {
    repo: 'jogging-log',
    name: 'ジョギングログ',
    emoji: '🏃',
    tag: '記録',
    desc: '走った記録と、走る理由をためて振り返るアプリ。',
  },
  {
    repo: 'expert-log',
    name: '有識者リスト作成ツール',
    emoji: '🎙️',
    tag: '学ぶ',
    desc: 'ポッドキャストの文字起こしから、AIが登場人物や専門家を抜き出してリスト化。',
  },
  {
    repo: 'my-mentor',
    name: 'メンター',
    emoji: '🌱',
    tag: '暮らし',
    desc: '話した内容を書き起こし、直近数日を踏まえてAIが助言をくれる。朝・通勤前・帰宅の3場面。',
    locked: true,
  },
  {
    repo: 'kandu',
    name: 'カンドゥー作戦ボード',
    emoji: '🎪',
    tag: '暮らし',
    desc: 'キッザニア系施設カンドゥーの当日用。時間割・お仕事図鑑・メモを1画面に。',
  },
  {
    repo: 'stamp-calendar',
    name: 'もくひょうスタンプカレンダー',
    emoji: '⭐',
    tag: '暮らし',
    desc: '子ども向けの目標達成アプリ。カレンダー×スタンプ×ごほうびで続ける力を後押し。',
  },
  {
    repo: 'care-mitsu',
    name: 'ケアミツー',
    emoji: '🌸',
    tag: '暮らし',
    desc: '生理周期を記録して、体調の波を夫婦で見守るアプリ。',
    locked: true,
  },
  {
    repo: 'family-othello',
    name: 'マイオセロ',
    emoji: '⚫',
    tag: 'あそび',
    desc: '家族の写真が石になるオセロ。家族で対戦できる。',
  },
  {
    repo: 'diamond-game',
    name: 'ダイヤモンドゲーム',
    emoji: '💎',
    tag: 'あそび',
    desc: '昔ながらのダイヤモンドゲームをブラウザで。',
  },
];
