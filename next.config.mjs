// GitHub Pages は https://foggydock.github.io/my-apps/ のように
// リポジトリ名がURLの途中に入る。そのぶんを basePath で教えてあげる。
// 手元で npm run dev するときは http://localhost:3100 のまま使いたいので、
// 本番ビルドのときだけ付ける。
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // サーバーを置かず、ただのHTML/CSS/JSとして書き出す設定。
  // これがあるから GitHub Pages に置ける。
  output: 'export',

  basePath: isProd ? '/my-apps' : '',

  // 末尾に / を付けたURLで書き出す（GitHub Pages と相性がよい）
  trailingSlash: true,

  // 画像の自動最適化はサーバーが要るので、静的書き出しでは切る
  images: { unoptimized: true },
};

export default nextConfig;
