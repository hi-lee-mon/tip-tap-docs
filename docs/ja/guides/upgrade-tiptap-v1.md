# Tiptap v1 から v2 へアップグレードする方法

> 原文: [https://tiptap.dev/docs/guides/upgrade-tiptap-v1](https://tiptap.dev/docs/guides/upgrade-tiptap-v1)

最初にお伝えしておくと、Tiptap v1 はすでにサポートが終了しており、今後アップデートは提供されません。

Tiptap v1 のドキュメントは[こちら](https://v1.tiptap.dev/)にありますが、まだ v1 を使っている場合はバージョン 2 へのアップグレードを強くおすすめします。

使い慣れたテキストエディタを新しい API に移行するのは確かに手間がかかります。それでも最新バージョンにアップグレードするだけの理由は十分にそろえました。

- IDE での自動補完（TypeScript のおかげです）
- 100 ページ以上、インタラクティブなサンプル 100 個以上を備えた充実のドキュメント
- 活発な開発。新機能を開発中で、毎週新しいリリースがある
- 大量の新しい拡張機能
- しっかりテストされたコードベース

新しい API には見覚えのある部分も多いはずですが、変更点はかなりあります。アップグレードを少しでも楽にするために、知っておくべきことを以下にまとめました。

## Tiptap v1 をアンインストールする

パッケージ構成が全面的に変わり、npm の名前空間も別のものに移りました。そのため、Tiptap 2 にアップグレードする前に古いバージョンを完全に削除する必要があります。

削除しないと、「looks like multiple versions of prosemirror-model were loaded」のような例外が発生します。

```bash
npm uninstall tiptap tiptap-commands tiptap-extensions tiptap-utils
```

## Tiptap v2 をインストールする

古いバージョンの Tiptap をアンインストールしたら、新しい Vue 2 用パッケージ、ProseMirror ライブラリ、スターターキットをインストールします。

```bash
npm install @tiptap/vue-2 @tiptap/pm @tiptap/starter-kit
```

## Tiptap v2 を最新に保つ

Tiptap のアップデートは頻繁にリリースしています。

残念ながら npm には依存パッケージを手軽に更新する標準のツールがありません。代わりに `npm-check` パッケージを使えます。

```bash
npm install -g npm-check
npm-check -u
```

## Document・Text・Paragraph 拡張機能を明示的に登録する

Tiptap 1 では、デフォルト設定の `useBuiltInExtensions: true` によって、必須の拡張機能の一部を利用者から見えないようにしていました。この設定は廃止され、すべての拡張機能をインポートする必要があります。少なくとも [`Document`](../editor/extensions/nodes/document.md)、[`Paragraph`](../editor/extensions/nodes/paragraph.md)、[`Text`](../editor/extensions/nodes/text.md) の拡張機能は必ず明示的にインポートしてください。

```js
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  extensions: [
    Document,
    Paragraph,
    Text,
    // ほかの拡張機能すべて
  ],
})
```

また、`dropCursor`、`enableDropCursor`、`enableGapCursor` の設定も削除しました。これらは独立した拡張機能 [`Dropcursor`](../editor/extensions/functionality/dropcursor.md) と [`Gapcursor`](../editor/extensions/functionality/gapcursor.md) になっています。おそらく読み込みたくなるはずですが、不要ならこの段落は無視してかまいません。

## ほとんどの拡張機能の名前が変わった

命名規則を lowerCamelCase に切り替えたため、多くのタイプ名が変わりました。コンテンツを JSON で保存している場合は、全体をループで走査して名前を書き換える必要があります。お手数をおかけします。

| 旧タイプ | 新タイプ |
| --------------------- | ---------------------- |
| ~~`bullet_list`~~     | `bulletList`           |
| ~~`code_block`~~      | `codeBlock`            |
| ~~`hard_break`~~      | `hardBreak`            |
| ~~`horizontal_rule`~~ | `horizontalRule`       |
| ~~`list_item`~~       | `listItem`             |
| ~~`ordered_list`~~    | `orderedList`          |
| ~~`table_cell`~~      | `tableCell`            |
| ~~`table_header`~~    | `tableHeader`          |
| ~~`table_row`~~       | `tableRow`             |
| ~~`todo_list`~~       | `taskList`（名前が変わりました） |
| ~~`todo_item`~~       | `taskItem`（名前が変わりました） |

## 削除されたメソッド

`.state()` メソッドを削除しました。ただし心配は要りません。同じものは `editor.state` から引き続き取得できます。

## 新しい拡張機能 API

プロジェクト用にカスタム拡張機能を作っている場合は、新しい API に合わせて書き直す必要があります。とはいえ、これまでの成果の多くはそのまま活かせます。`schema`、`commands`、`keys`、`inputRules`、`pasteRules` はどれも以前と同じように動きます。違うのは登録の仕方だけです。

```js
import { Node } from '@tiptap/core'

const CustomExtension = Node.create({
  name: 'custom_extension',
  addOptions() {
    …
  },
  addAttributes() {
    …
  },
  parseHTML() {
    …
  },
  renderHTML({ node, HTMLAttributes }) {
    …
  },
  addCommands() {
    …
  },
  addKeyboardShortcuts() {
    …
  },
  addInputRules() {
    …
  },
  // ほかにもいろいろ …
})
```

[カスタム拡張機能を作るときの細かなポイント](../editor/extensions/custom-extensions/index.md)は、ガイドで詳しく説明しています。

## 名前が変わった設定とメソッド

[多くの設定とメソッドの名前を変更しました](../editor/api/editor.md)。検索と置換で新しい API に移行できるはずです。変更点の一覧は次のとおりです。

| 旧名 | 新名 |
| --------------- | ----------- |
| ~~`autoFocus`~~ | `autofocus` |

## 名前が変わったコマンド

新しい拡張機能にはどれも、スタイルを設定（set）・解除（unset）・切り替え（toggle）する専用のコマンドがあります。そのため `.bold()` ではなく `.toggleBold()` になりました。また、命名規則を lowerCamelCase に切り替えています。以下にいくつか例を挙げます。それから、`todo_list` は `taskList` に名前を変えました。お手数をおかけします。

| 旧コマンド | 新コマンド |
| ------------------------ | ------------------------------- |
| `.redo()`                | `.redo()`（変更なし）     |
| `.undo()`                | `.undo()`（変更なし）     |
| ~~`.todo_list()`~~       | `.toggleTaskList()`（名前が変わりました） |
| ~~`.blockquote()`~~      | `.toggleBlockquote()`           |
| ~~`.bold()`~~            | `.toggleBold()`                 |
| ~~`.bullet_list()`~~     | `.toggleBulletList()`           |
| ~~`.code()`~~            | `.toggleCode()`                 |
| ~~`.code_block()`~~      | `.toggleCodeBlock()`            |
| ~~`.hard_break()`~~      | `.setHardBreak()`               |
| ~~`.heading()`~~         | `.toggleHeading()`              |
| ~~`.horizontal_rule()`~~ | `.setHorizontalRule()`          |
| ~~`.italic()`~~          | `.toggleItalic()`               |
| ~~`.link()`~~            | `.toggleLink()`                 |
| ~~`.ordered_list()`~~    | `.toggleOrderedList()`          |
| ~~`.paragraph()`~~       | `.setParagraph()`               |
| ~~`.strike()`~~          | `.toggleStrike()`               |
| ~~`.underline()`~~       | `.toggleUnderline()`            |
| …                        | …                               |

## MenuBar・BubbleMenu・FloatingMenu

メニューの移行方法は、専用の[メニュー作成ガイド](../editor/getting-started/style-editor/custom-menus.md)を参照してください。

## コマンドをチェーンできるようになった

ほとんどのコマンドを、1回の呼び出しにまとめられるようになりました。たいていの場合、関数を別々に呼ぶより短く書けます。選択中のテキストを太字にする例を示します。

```js
editor.chain().focus().toggleBold().run()
```

`.chain()` で新しいチェーンを開始し、`.run()` で間に挟んだコマンドをすべて実際に実行します。[新しい Tiptap のコマンド](../editor/api/commands/index.md)について詳しくは API ドキュメントを参照してください。

## .focus() はコマンドごとに呼ばれなくなった

Tiptap 1 では `.focus()` コマンドを利用者から隠し、すべてのコマンドで自動的に実行していました。その結果、コマンドは実行したいがエディタにはフォーカスしたくない、という特定のユースケースで問題が起きていました。

Tiptap v2 では `focus()` を明示的に呼ぶ必要があります。おそらく多くの箇所で呼ぶことになるでしょう。例を示します。

```js
editor.chain().focus().toggleBold().run()
```

## イベントコールバックの引数が減った

新しいイベントコールバックは引数が少なくなりました。以前と同じ情報は `this.` から取得できるはずです。[イベントについて詳しくはこちら](../editor/api/events.md)を参照してください。

## 共同編集

共同編集のリファレンス実装は Y.js を使うようになりました。これはまったく別物です。Tiptap 1 の拡張機能を使い続けることもできますが、新しい拡張機能 API への対応は各自で行ってください。対応できたら、ぜひ共有してください。ここからリンクします。

[新しい共同編集の体験](https://tiptap.dev/docs/collaboration/getting-started/install)について詳しくはガイドを参照してください。

## マークがノードビューに対応しなくなった

マークでのノードビューは、[ProseMirror で十分にサポートされていません](https://discuss.prosemirror.net/t/there-is-a-bug-in-marks-nodeview/2722/2)。Tiptap 1 にも[関連する issue](https://github.com/ueberdosis/tiptap/issues/613) があります。そのため Tiptap 2 ではこの機能を削除しました。
