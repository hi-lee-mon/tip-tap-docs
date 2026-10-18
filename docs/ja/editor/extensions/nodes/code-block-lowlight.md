# CodeBlockLowlight 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/code-block-lowlight](https://tiptap.dev/docs/editor/extensions/nodes/code-block-lowlight)

CodeBlockLowlight 拡張機能を使うと、ドキュメントにフェンス付きのコードブロックを追加できます。コードは `<pre>` と `<code>` の HTML タグで包まれます。

> [!WARNING]
> **シンタックスハイライトの依存関係**
>
> この拡張機能は、コードブロックの中身にシンタックスハイライトを適用するために
> [lowlight](https://github.com/wooorm/lowlight) ライブラリを使います。

`` ``` ``（バッククォート 3 つとスペース）または `~~~ `（チルダ 3 つとスペース）と入力すると、すぐにコードブロックが追加されます。言語も指定できます。`` ```css `` と入力してみてください。`<code>` タグに `language-css` クラスが付くはずです。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/CodeBlockLowlight)

## インストール

```bash
npm install lowlight @tiptap/extension-code-block-lowlight
```

## 設定

### lowlight

この拡張機能には `lowlight` モジュールを渡す必要があります。`lowlight`
パッケージを拡張機能から切り離しておくことで、クライアントのアプリケーション側で、
使う lowlight のバージョンや読み込むプログラミング言語のパッケージを決められます。

```js
import { lowlight } from 'lowlight/lib/core'

CodeBlockLowlight.configure({
  lowlight,
})
```

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
CodeBlockLowlight.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### enableTabIndentation

コードブロック内で Tab キーによるインデントを有効にします。

デフォルト: `false`

```js
CodeBlockLowlight.configure({
  enableTabIndentation: true,
})
```

### tabSize

Tab でインデントするときのスペースの数。

デフォルト: `4`

```js
CodeBlockLowlight.configure({
  tabSize: 2,
})
```

### languageClassPrefix

code タグに付ける言語クラスの接頭辞を指定します。

デフォルト: `'language-'`

```js
CodeBlockLowlight.configure({
  languageClassPrefix: 'language-',
})
```

### defaultLanguage

lowlight の自動判定を使わずに、デフォルトの言語を指定します。

デフォルト: `null`

```js
CodeBlockLowlight.configure({
  defaultLanguage: 'plaintext',
})
```

## コマンド

### setCodeBlock()

コンテンツをコードブロックで包みます。

```js
editor.commands.setCodeBlock()
```

### toggleCodeBlock()

コードブロックを切り替えます。

```js
editor.commands.toggleCodeBlock()
```

## キーボードショートカット

| コマンド        | Windows/Linux                                      | macOS                                          |
| --------------- | -------------------------------------------------- | ---------------------------------------------- |
| toggleCodeBlock | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>C</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>C</kbd> |

## ソースコード

[packages/extension-code-block-lowlight/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-code-block-lowlight/)
