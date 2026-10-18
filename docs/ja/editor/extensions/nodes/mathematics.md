# Mathematics 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/mathematics](https://tiptap.dev/docs/editor/extensions/nodes/mathematics)

エディタに数式を挿入できるようにする拡張機能です。LaTeX で書いた数式を [KaTeX](https://katex.org/) でレンダリングします。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Mathematics)

## インストール

```bash
npm install @tiptap/extension-mathematics katex
```

## 使い方

```js
import { Mathematics } from '@tiptap/extension-mathematics'

const editor = new Editor({
  extensions: [
    Mathematics.configure({
      inlineOptions: {
        // インラインの数式ノードのオプション（省略可）
      },
      blockOptions: {
        // ブロックの数式ノードのオプション（省略可）
      },
      katexOptions: {
        // KaTeX レンダラーのオプション（省略可）
      },
    }),
  ],
})
```

## 追加のセットアップ

### KaTeX のレンダリング結果にスタイルを付ける

レンダリングされる要素とエディタの入力欄には、自由にスタイルを付けられます。

**KaTeX のスタイルの import（必須）**

```js
import 'katex/dist/katex.min.css'
```

次のクラスを使うと、数式ノードを選んでスタイルを付けられます。例は、このページ末尾のデモのコードを参照してください。

```css
/* レンダリングされた数式ノード */
.tiptap-mathematics-render {
  // …
}

/* 編集可能な数式ノードだけを選ぶセレクター */
.tiptap-mathematics-render--editable {
  // …
}

/** ブロックの数式ノードだけを選ぶセレクター */
.tiptap-mathematics-render[data-type="block-math"] {
  // …
}

/** インラインの数式ノードだけを選ぶセレクター */
.tiptap-mathematics-render[data-type="inline-math"] {
  // …
}
```

### 拡張機能を設定し、数式ノードを更新する

この拡張機能には、数式ノードの挙動を設定するオプションがいくつかあります。

```js
import Mathematics from '@tiptap/extension-mathematics'

// [...]

Mathematics.configure({
  // インラインの数式ノードのオプション
  inlineOptions: {
    onClick: (node, pos) => {
      // クリック時には何でもできる。たとえば数式ノードを編集するダイアログを開く、
      // 手早く試作するなら LaTeX コードを編集するプロンプトを出すだけでもよい
      const katex = prompt('Enter new calculation:', node.attrs.latex)
      if (katex) {
        editor.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
      }
    },
  },

  // ブロックの数式ノードのオプション
  blockOptions: {
    onClick: (node, pos) => {
      // クリック時には何でもできる。たとえば数式ノードを編集するダイアログを開く、
      // 手早く試作するなら LaTeX コードを編集するプロンプトを出すだけでもよい
      const katex = prompt('Enter new calculation:', node.attrs.latex)
      if (katex) {
        editor.chain().setNodeSelection(pos).updateBlockMath({ latex: katex }).focus().run()
      }
    },
  },

  // KaTeX レンダラーのオプション。詳細: https://katex.org/docs/options.html
  katexOptions: {
    throwOnError: false, // LaTeX コードが不正でもエラーを投げない
    macros: {
      '\\R': '\\mathbb{R}', // 実数のマクロを追加する
      '\\N': '\\mathbb{N}', // 自然数のマクロを追加する
    },
  },
}
```

### 既存の数式デコレーションを数式ノードに移行する

Math 拡張機能は以前はデコレーションの拡張機能だったため、エディタに数式のデコレーションが残っているかもしれません。新しい数式ノードに移行するには、拡張機能が提供するユーティリティ関数 `migrateMathStrings` を使います。

```js
import { migrateMathStrings } from '@tiptap/extension-mathematics'

// エディタの `onCreate` フックで実行するのがいちばんよい
// ただし共同編集の環境では、最初のドキュメントが読み込まれるのを待つよう注意が必要
const editor = new Editor({
  // [...]
  onCreate: ({ editor: currentEditor }) => {
    migrateMathStrings(currentEditor)
  },
})

// プロバイダーを使った共同編集の環境の場合
const editor = new Editor({
  // [...]
  onCreate: ({ editor: currentEditor }) => {
    provider.on('synced', () => {
      migrateMathStrings(currentEditor)
    })
  },
})
```

### 1 種類の数式ノードだけを import する

数式ノードを 1 種類（インラインかブロックのどちらか）だけ使いたい場合は、対応する拡張機能を直接 import できます。

```js
import { InlineMath } from '@tiptap/extension-mathematics/inline'

// [...]

InlineMath.configure({
  katexOptions: {
    // KaTeX レンダラーのオプション（省略可）
  },
  onClick: (node, pos) => {
    // クリック時には何でもできる。たとえば数式ノードを編集するダイアログを開く、
    // 手早く試作するなら LaTeX コードを編集するプロンプトを出すだけでもよい
    const katex = prompt('Enter new calculation:', node.attrs.latex)
    if (katex) {
      editor.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
    }
  },
})
```

## 設定

### `inlineOptions`

インラインの数式ノードを設定するオプションです。インラインの数式ノードが対応しているオプションなら何でも渡せます。たとえば、ノードのクリックイベントを扱う `onClick` です。

デフォルト: `undefined`

```js
import Mathematics from '@tiptap/extension-mathematics'

// [...]

Mathematics.configure({
  inlineOptions: {
    onClick: (node, pos) => {
      // クリック時には何でもできる。たとえば数式ノードを編集するダイアログを開く、
      // 手早く試作するなら LaTeX コードを編集するプロンプトを出すだけでもよい
      const katex = prompt('Enter new calculation:', node.attrs.latex)
      if (katex) {
        editor.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
      }
    },
  },
})
```

### `blockOptions`

ブロックの数式ノードを設定するオプションです。ブロックの数式ノードが対応しているオプションなら何でも渡せます。たとえば、ノードのクリックイベントを扱う `onClick` です。

デフォルト: `undefined`

```js
import Mathematics from '@tiptap/extension-mathematics'

// [...]

Mathematics.configure({
  blockOptions: {
    onClick: (node) => {
      // クリック時には何でもできる。たとえば数式ノードを編集するダイアログを開く、
      // 手早く試作するなら LaTeX コードを編集するプロンプトを出すだけでもよい
      const katex = prompt('Enter new calculation:', node.attrs.latex)
      if (katex) {
        editor.chain().setNodeSelection(pos).updateBlockMath({ latex: katex }).focus().run()
      }
    },
  },
})
```

### `katexOptions`

KaTeX レンダラーを設定するオプションです。オプションの一覧は[こちら](https://katex.org/docs/options.html)を参照してください。

デフォルト: `undefined`

```js
import Mathematics from '@tiptap/extension-mathematics'

// [...]

Mathematics.configure({
  katexOptions: {
    throwOnError: false, // LaTeX コードが不正でもエラーを投げない
    macros: {
      '\\R': '\\mathbb{R}', // 実数のマクロを追加する
      '\\N': '\\mathbb{N}', // 自然数のマクロを追加する
    },
  },
})
```

## 設定: `InlineMath`

### `onClick`

インラインの数式ノードのクリックイベントを扱うオプションです。数式ノードを編集するダイアログを開いたり、手早く試作するなら LaTeX コードを編集するプロンプトを出したりできます。

デフォルト: `undefined`

```js
import { InlineMath } from '@tiptap/extension-mathematics'

// [...]

InlineMath.configure({
  onClick: (node) => {
    // クリック時には何でもできる。たとえば数式ノードを編集するダイアログを開く、
    // 手早く試作するなら LaTeX コードを編集するプロンプトを出すだけでもよい
    const katex = prompt('Enter new calculation:', node.attrs.latex)
    if (katex) {
      editor.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
    }
  },
})
```

### `katexOptions`

インラインの数式ノード用に KaTeX レンダラーを設定するオプションです。オプションの一覧は[こちら](https://katex.org/docs/options.html)を参照してください。

デフォルト: `undefined`

```js
import { InlineMath } from '@tiptap/extension-mathematics'

// [...]

InlineMath.configure({
  katexOptions: {
    throwOnError: false, // LaTeX コードが不正でもエラーを投げない
    macros: {
      '\\R': '\\mathbb{R}', // 実数のマクロを追加する
      '\\N': '\\mathbb{N}', // 自然数のマクロを追加する
    },
  },
})
```

## 設定: `BlockMath`

### `onClick`

ブロックの数式ノードのクリックイベントを扱うオプションです。数式ノードを編集するダイアログを開いたり、手早く試作するなら LaTeX コードを編集するプロンプトを出したりできます。

デフォルト: `undefined`

```js
import { BlockMath } from '@tiptap/extension-mathematics'

// [...]

BlockMath.configure({
  onClick: (node) => {
    // クリック時には何でもできる。たとえば数式ノードを編集するダイアログを開く、
    // 手早く試作するなら LaTeX コードを編集するプロンプトを出すだけでもよい
    const katex = prompt('Enter new calculation:', node.attrs.latex)
    if (katex) {
      editor.chain().setNodeSelection(pos).updateBlockMath({ latex: katex }).focus().run()
    }
  },
})
```

### `katexOptions`

ブロックの数式ノード用に KaTeX レンダラーを設定するオプションです。オプションの一覧は[こちら](https://katex.org/docs/options.html)を参照してください。

デフォルト: `undefined`

```js
import { BlockMath } from '@tiptap/extension-mathematics'

// [...]

BlockMath.configure({
  katexOptions: {
    throwOnError: false, // LaTeX コードが不正でもエラーを投げない
    macros: {
      '\\R': '\\mathbb{R}', // 実数のマクロを追加する
      '\\N': '\\mathbb{N}', // 自然数のマクロを追加する
    },
  },
})
```

## コマンド: InlineMath

### `insertInlineMath({ latex, pos })`

指定した位置に、指定した LaTeX コードで新しいインラインの数式ノードを挿入します。`pos` を指定しない場合は、現在の選択範囲に挿入します。

```js
// 位置を指定する場合
editor.commands.insertInlineMath({
  latex: '\\frac{a}{b}',
  pos: 38,
})

// 位置を指定しない場合
editor.commands.insertInlineMath({
  latex: '\\frac{a}{b}',
})
```

### `deleteInlineMath({ pos })`

指定した位置にあるインラインの数式ノードを削除します。`pos` を指定しない場合は、現在の選択範囲にあるノードを削除します。

```js
// 位置を指定する場合
editor.commands.deleteInlineMath({
  pos: 38,
})

// 位置を指定しない場合
editor.commands.deleteInlineMath()
```

### `updateInlineMath({ latex, pos })`

指定した位置にあるインラインの数式ノードを、指定した LaTeX コードで更新します。`pos` を指定しない場合は、現在の選択範囲にあるノードを更新します。

```js
// 位置を指定する場合
editor.commands.updateInlineMath({
  latex: '\\frac{a}{b}',
  pos: 38,
})

// 位置を指定しない場合
editor.commands.updateInlineMath({
  latex: '\\frac{a}{b}',
})
```

## コマンド: BlockMath

### `insertBlockMath({ latex, pos })`

指定した位置に、指定した LaTeX コードで新しいブロックの数式ノードを挿入します。`pos` を指定しない場合は、現在の選択範囲に挿入します。

```js
// 位置を指定する場合
editor.commands.insertBlockMath({
  latex: '\\frac{a}{b}',
  pos: 38,
})

// 位置を指定しない場合
editor.commands.insertBlockMath({
  latex: '\\frac{a}{b}',
})
```

### `deleteBlockMath({ pos })`

指定した位置にあるブロックの数式ノードを削除します。`pos` を指定しない場合は、現在の選択範囲にあるノードを削除します。

```js
// 位置を指定する場合
editor.commands.deleteBlockMath({
  pos: 38,
})

// 位置を指定しない場合
editor.commands.deleteBlockMath()
```

### `updateBlockMath({ latex, pos })`

指定した位置にあるブロックの数式ノードを、指定した LaTeX コードで更新します。`pos` を指定しない場合は、現在の選択範囲にあるノードを更新します。

```js
// 位置を指定する場合
editor.commands.updateBlockMath({
  latex: '\\frac{a}{b}',
  pos: 38,
})

// 位置を指定しない場合
editor.commands.updateBlockMath({
  latex: '\\frac{a}{b}',
})
```

## ユーティリティと定数

### `mathMigrationRegex`

エディタ内の数式文字列を探して移行するときに使う、デフォルトの正規表現です。`$` 記号で囲まれた LaTeX の式にマッチします。

```js
import { mathMigrationRegex } from '@tiptap/extension-mathematics'
```

### `createMathMigrateTransaction(editor, transaction, regex)`

エディタのドキュメント内の数式文字列を数式ノードに移行する、ProseMirror のトランザクションを作ります。数式文字列は、渡した正規表現で探します。

### パラメーター

- `editor`: ProseMirror のエディタのインスタンス。
- `transaction`: 変更を加える ProseMirror のトランザクション。
- `regex`（省略可）: 数式文字列を探すのに使う正規表現。デフォルトは `mathMigrationRegex` です。

```js
import { createMathMigrateTransaction } from '@tiptap/extension-mathematics'

const tr = createMathMigrateTransaction(editor, editor.state.tr, mathMigrationRegex)
editor.view.dispatch(tr)
```

### `migrateMathStrings(editor, regex)`

エディタのドキュメント内の数式文字列を数式ノードに変換する、移行用のトランザクションを作って実行します。数式文字列は、渡した正規表現で探します。

### パラメーター

- `editor`: ProseMirror のエディタのインスタンス。
- `regex`（省略可）: 数式文字列を探すのに使う正規表現。デフォルトは `mathMigrationRegex` です。

```js
import { migrateMathStrings } from '@tiptap/extension-mathematics'

migrateMathStrings(editor, mathMigrationRegex)
```
