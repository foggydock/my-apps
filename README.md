# つくったもの棚

これまで作って公開しているアプリの一覧サイト。Next.js（React）製。

公開先: https://foggydock.github.io/my-apps/

## アプリを増やしたいとき

`data/apps.js` の配列に1つ足すだけ。ほかのファイルは触らなくていい。

```js
{
  repo: 'atarashii-app',   // GitHub のリポジトリ名
  name: '新しいアプリ',
  emoji: '🆕',
  tag: '記録',              // 新しい言葉を書けば絞り込みボタンも自動で増える
  desc: '一言説明。',
  locked: true,            // 合言葉つきのアプリなら付ける（🔒が出る）。不要なら書かない
}
```

## 手元で見るとき

```bash
npm run dev
```

http://localhost:3100 が開く。ファイルを保存すると自動で画面が変わる。

## 公開するとき

`main` に push するだけ。GitHub 側が自動でビルドして公開する（`.github/workflows/deploy.yml`）。
手元で `npm run build` する必要はない。

## ファイルの役割

| 場所 | 何をしているか |
|---|---|
| `data/apps.js` | アプリの台帳。ふだん触るのはここだけ |
| `app/page.js` | トップページの骨組み（見出し・フッター） |
| `app/layout.js` | 全ページ共通の外枠。タイトルやファビコン |
| `app/globals.css` | 色と見た目 |
| `components/AppGrid.js` | 絞り込みボタンと、GitHubから更新日を取る処理 |
| `components/AppCard.js` | カード1枚ぶんの見た目 |
| `next.config.mjs` | GitHub Pages 向けの書き出し設定 |
| `prototype.html` | Next.js にする前の単一HTML版（記念。公開されない） |

## メモ

- 最終更新日は GitHub の公開API から見ている人のブラウザで取っている。
  だから push すればサイトを作り直さなくても日付が新しくなる。
- 非公開リポや、PC内だけで動かしているアプリは載せていない。
