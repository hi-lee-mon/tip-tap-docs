# Blockquote 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/blockquote](https://tiptap.dev/docs/editor/extensions/nodes/blockquote)

Blockquote 拡張機能を使うと、エディタで `<blockquote>` HTML タグを使えます。そう、エディタで引用を表示するのにぴったりです。

新しい行の先頭で `> ` と入力すると、魔法のように引用ブロックに変わります。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Blockquote)

## インストール

```bash
npm install @tiptap/extension-blockquote
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Blockquote.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setBlockquote()

コンテンツを引用ブロックで包みます。

```js
editor.commands.setBlockquote()
```

### toggleBlockquote()

引用ブロックで包む、または包みを外します。

```js
editor.commands.toggleBlockquote()
```

### unsetBlockquote()

引用ブロックの包みを外します。

```js
editor.commands.unsetBlockquote()
```

## キーボードショートカット

| コマンド             | Windows/Linux                                        | macOS                                            |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| 引用ブロックの切り替え | <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> |

## ソースコード

[packages/extension-blockquote/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-blockquote/)
