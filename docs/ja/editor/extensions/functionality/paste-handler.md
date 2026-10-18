# Paste Handler

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/paste-handler](https://tiptap.dev/docs/editor/extensions/functionality/paste-handler)

`PasteHandler` 拡張機能は、貼り付けられた HTML を賢く変換し、外部のアプリから持ち込んだコンテンツでも正しく扱えるようにします。貼り付けたコンテンツに一連の変換をかけ、ユーザーが意図した書式は残しつつ、貼り付け元に固有の余計な書式を取り除きます。

[デモを開く](https://embed-pro.tiptap.dev/preview/Extensions/PasteHandler)

## 対応している貼り付け元

| 貼り付け元 | macOS デスクトップ版 | Windows デスクトップ版 | Web（ブラウザ） |
| --- | :---: | :---: | :---: |
| Microsoft Excel | ✓ | ✓ | ✓ (SharePoint) |
| Microsoft Word | ✓ | ✓ | ✓ (SharePoint) |
| Microsoft Outlook | ✓ | ✓ | ✓ (Outlook Web) |
| Google Docs | — | — | ✓ |
| Google Sheets | — | — | ✓ |

## インストール

```bash
npm install @tiptap-pro/extension-paste-handler
```

## 使い方

設定は要りません。エディタに追加するだけで自動的に働きます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import PasteHandler from '@tiptap-pro/extension-paste-handler'

const editor = new Editor({
  extensions: [
    StarterKit,
    PasteHandler,
  ],
})
```

## 処理する内容

貼り付けられた HTML に、次の変換を上から順に適用します。

| 変換 | 内容 |
| --- | --- |
| CSS クラスの解決 | クラスで指定された CSS の書式（Excel からのものなど）をインラインスタイルに置き換える |
| Office 固有のマークアップの除去 | `<o:p>` タグや `mso-*` スタイルなど、Microsoft Office 固有の要素とプロパティを取り除く |
| ブックマークの除去 | Word のブックマークの目印と、空のブックマークのアンカーを取り除く |
| 表のセル内のテキストスタイル | 表のセル内のテキストの書式を、エディタが正しく認識できるようにする |
| 背景色の変換 | `background-color` スタイルを、Highlight 拡張機能用のハイライトのマークに変換する |
| ARIA の見出しの変換 | ARIA で見出しとして指定された要素（SharePoint 版 Word からのもの）を、HTML の見出し要素に変換する |
| 水平線の検出 | テキストで表現された水平線（Google Docs からのものなど）を検出し、`<hr>` 要素に変換する |
| ソフト改行の結合 | 余白 0 の段落が連続しているもの（Google Docs からのもの）を、1つの段落内の改行にまとめる |
| 入れ子リストの再構築 | 平らになったリスト構造（SharePoint からのもの）を、正しく入れ子になったリストに組み直す |
| 番号付きリストの正規化 | インラインの `list-style-type` を取り除き、リストのスタイルをエディタの CSS で決められるようにする |
| 余分な改行の除去 | ブロック要素の間に紛れ込み、不要な隙間を生む `<br>` タグを取り除く |

> [!NOTE]
> **エラー処理**
>
> どれかの変換が失敗した場合は、貼り付けられた元の HTML をそのまま使います。そのため、貼り付けの機能そのものが壊れることはありません。

## 既知の制限

### Safari のクリップボードでは表のセルのスタイルが失われる

Safari で SharePoint 版 Excel（または同様の貼り付け元）から表のセルをコピーしてエディタに貼り付けると、太字、斜体、色、リンクなどのセル内の書式が失われます。Safari がクリップボードに書き込む HTML は表の構造とセルのテキストだけに削られており、スタイルの情報はエディタに届く前に取り除かれているためです。

これは WebKit の段階で起きる動作なので、Paste Handler では元に戻せません。Safari でほかのエディタ（SharePoint 版 Word など）に貼り付けた場合も同じ結果になります。Chromium 系のブラウザや Firefox でコピーした場合は影響を受けません。
