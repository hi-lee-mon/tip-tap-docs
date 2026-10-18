# CodeBlock 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/code-block](https://tiptap.dev/docs/editor/extensions/nodes/code-block)

CodeBlock 拡張機能を使うと、ドキュメントにフェンス付きのコードブロックを追加できます。コードは `<pre>` と `<code>` の HTML タグで包まれます。

`` ``` ``（バッククォート 3 つとスペース）または `~~~ `（チルダ 3 つとスペース）と入力すると、すぐにコードブロックが追加されます。言語も指定できます。`` ```css `` と入力してみてください。`<code>` タグに `language-css` クラスが付くはずです。

> [!TIP]
> **シンタックスハイライトはありません**
>
> CodeBlock 拡張機能にはスタイルが付いておらず、シンタックスハイライトも組み込まれていません。
> シンタックスハイライト付きのコードブロックが必要なら、[CodeBlockLowlight](code-block-lowlight.md) 拡張機能を試してください。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/CodeBlock)

## インストール

```bash
npm install @tiptap/extension-code-block
```

## 使い方

```js
import CodeBlock from '@tiptap/extension-code-block'

const editor = new Editor({
  extensions: [CodeBlock],
})
```

## 設定

### languageClassPrefix

code タグに付ける言語クラスの接頭辞を指定します。

デフォルト: `'language-'`

```js
CodeBlock.configure({
  languageClassPrefix: 'language-',
})
```

### exitOnTripleEnter

Enter を 3 回押したときにノードから抜けるかどうかを指定します。

デフォルト: `true`

```js
CodeBlock.configure({
  exitOnTripleEnter: false,
})
```

### defaultLanguage

lowlight の自動判定を使わずに、デフォルトの言語を指定します。

デフォルト: `null`

```js
CodeBlock.configure({
  defaultLanguage: 'plaintext',
})
```

### exitOnArrowDown

後ろにノードがないとき、下矢印キーでノードから抜けるかどうかを指定します。

デフォルト: `true`

```js
CodeBlock.configure({
  exitOnArrowDown: false,
})
```

### exitOnArrowUp

前にノードがないとき、上矢印キーでノードから抜けるかどうかを指定します。

デフォルト: `true`

```js
CodeBlock.configure({
  exitOnArrowUp: false,
})
```

### enableTabIndentation

Tab キーを押したときにインデントするかどうかを指定します。

デフォルト: `false`

```js
CodeBlock.configure({
  enableTabIndentation: true,
})
```

### tabSize

インデントに使うスペースの数を設定します。

デフォルト: `4`

```js
CodeBlock.configure({
  tabSize: 2,
})
```

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
CodeBlock.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### enableTabIndentation

コードブロック内で Tab キーによるインデントを有効にします。

デフォルト: `false`

```js
CodeBlock.configure({
  enableTabIndentation: true,
})
```

### tabSize

Tab でインデントするときのスペースの数。

デフォルト: `4`

```js
CodeBlock.configure({
  tabSize: 2,
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

[packages/extension-code-block/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-code-block/)
