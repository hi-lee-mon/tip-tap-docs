# Tiptap 公式ドキュメントの日本語版を、共通部分と React に絞って Markdown で作る

- 日付: 2026-10-18
- 状態: 採用

## 背景

Tiptap 3 系（`@tiptap/react` ^3.32.0）を React / Next.js で使う。公式ドキュメントは英語だけなので、日本語で読める版を手元に置きたい。

原文は [ueberdosis/tiptap-docs](https://github.com/ueberdosis/tiptap-docs) の `src/content/` にある MDX ファイル群。MDX は Markdown の中に React コンポーネントを書ける書式で、公式サイトのコードがないと部品（`<Callout>` や `<CodeDemo>` など）が表示されない。本文のライセンスは MIT なので、出典を示せば翻訳して置ける。

翻訳の起点にしたコミットは `5b0902e606a2550745971da5c0c544872fb8917b`（2026-10-14）。

## 決定

### 範囲は `editor/` と `guides/`、ただし React 以外のフレームワーク専用ページは除く

除外するページ:

- `editor/getting-started/install/` の alpine・nuxt・php・svelte・vanilla-javascript・vue2・vue3
- `editor/api/utilities/tiptap-for-php.mdx`
- `editor/extensions/functionality/drag-handle-vue.mdx`
- `editor/extensions/custom-extensions/node-views/vue.mdx`、`mark-views/vue.mdx`
- `guides/decorations-vanilla.mdx`、`guides/decorations-vue.mdx`

`node-views/javascript.mdx` と `mark-views/javascript.mdx` は残す。フレームワークに依存しない基本の API で、React 版のページもこの仕組みの上に成り立っているため。

AI・Collaboration・UI Components などの有料機能中心のセクションは対象外とした。

### 形式は原文と同じフォルダ構成の `.md`

`docs/ja/` の下に、`src/content/` と同じ構成で置く。GitHub やエディタのプレビューでそのまま読めることを優先した。

MDX の部品は、機械的に置き換えられるものをスクリプト（`tools/mdx-to-md/`）で先に変換し、残りを翻訳時に手で Markdown にする。

| 原文 | 変換後 |
| --- | --- |
| `import` 行 | 削除 |
| `<Callout variant="...">` | GitHub の注記ブロック（`> [!NOTE]` など） |
| `<CodeDemo>` | 公式のデモページへのリンク |
| `<Checklist>` / `<CheckboxItem>` | `- [ ]` のチェックリスト |
| `<EnterpriseCalloutAuto>` | 削除（有料プランの宣伝枠のため） |
| サイト内リンク | 翻訳済みページなら相対パス、それ以外は `https://tiptap.dev/docs/...` |

### 翻訳は並行して進め、用語は対訳表でそろえる

約 225 ファイル・110 万文字あるため、フォルダごとに分けて並行で訳す。訳語の揺れを防ぐため、先に `docs/ja/GLOSSARY.md` を作り、全員がそれに従う。

## 採らなかった案

- **MDX のまま訳す**: 公式サイトのコードを動かさないと読めない。手元で読む目的に合わない
- **全セクションを訳す**: 有料機能のページが半分以上を占め、今回の用途（オープンソース版を React で使う）では読まない

## 影響

- 原文の更新には自動で追従しない。追従するときは、起点コミットとの差分を取って該当ページだけ訳し直す
- デモ（`<CodeDemo>`）は埋め込めないので、リンク先の公式ページで見る
