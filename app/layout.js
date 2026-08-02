import './globals.css';

// ページの <head> に入る情報。Next.js がここを見て自動で書いてくれる。
export const metadata = {
  title: 'つくったもの棚',
  description: 'これまで作って公開しているアプリの一覧',
};

// 全ページの外枠。children のところに page.js の中身が入る。
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧰</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
