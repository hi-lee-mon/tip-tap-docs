# 日本語訳を VitePress でサイトとして読めるようにする

- 日付: 2026-10-18
- 状態: 採用

## 背景

日本語訳（`docs/ja/`）は Markdown ファイルだけで、サイドバーや検索を使いながら読む手段がなかった。公式サイトのように、ページ間を行き来しながら読みたい。

## 決定

VitePress 1.6.4（安定版）を使う。`pnpm docs:dev` で手元に開発サーバーを立て、ブラウザで読む。

- サイドバーは、ファイル構成と各ページの1行目（タイトル）から自動で作る（`docs/ja/.vitepress/sidebar.mjs`）
- `README.md` をトップページとして表示する（`rewrites`）
- 名前に `key` / `token` を含む未翻訳の4ページは、サイトの対象から外し、サイドバーでは公式サイトの原文へリンクする
- pnpm が承認を求めた esbuild のインストール時スクリプトは許可しない（`pnpm-workspace.yaml` の `allowBuilds`）。本体のバイナリは別パッケージで入るため、スクリプトなしで動く

### 追記: GitHub Pages で公開する

手元で起動しなくても読めるように、GitHub Pages で公開する（https://hi-lee-mon.github.io/tip-tap-docs/）。

- main への push を合図に、GitHub Actions がテスト・ビルド・公開までを行う（`.github/workflows/deploy-docs.yml`）
- 公開先はリポジトリ名の下になるため、VitePress の `base` を `/tip-tap-docs/` にした。手元の開発サーバーも同じパスで開く
- CI でも同じ pnpm を使うため、`package.json` の `packageManager` で版を固定した

## 採らなかった案

- **GitHub の表示だけで読む**: ビルドは不要だが、サイドバーと全文検索がない
- **Docusaurus**: 機能は十分だが React と MDX が前提になる。訳文は素の Markdown なので、Markdown をそのまま扱える VitePress のほうが手直しが少ない
- **VitePress 2.0（alpha）**: 安定版ではない

## 影響

- Markdown は Vue のテンプレートとしても解釈されるため、本文に HTML タグを直接書くと、ビルドが失敗することがある（例: `<code>` の中に `~~`）。本文ではインラインコード（バッククォート）を使う
- 原文の相対リンクがサイト上で切れていると、ビルドが失敗する。原文の更新を取り込んだら、`pnpm docs:build` で確かめる
