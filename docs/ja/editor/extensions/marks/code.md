# Code 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/code](https://tiptap.dev/docs/editor/extensions/marks/code)

Code 拡張機能を使うと、エディタで `<code>` HTML タグを使えます。`<code>` タグを含むテキストを貼り付けると、インラインコードとしてレンダリングされます。

<code>\`バッククォート\`</code>で囲んで入力すると、入力中に自動で `インラインコード` に変わります。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Code)

## インストール

```bash
npm install @tiptap/extension-code
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Code.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setCode()

テキストをインラインコードにします。

```js
editor.commands.setCode()
```

### toggleCode()

インラインコードのマークを切り替えます。

```js
editor.commands.toggleCode()
```

### unsetCode()

インラインコードのマークを外します。

```js
editor.commands.unsetCode()
```

## キーボードショートカット

| コマンド      | Windows/Linux                     | macOS                         |
| ------------ | --------------------------------- | ----------------------------- |
| toggleCode() | <kbd>Control</kbd> + <kbd>E</kbd> | <kbd>Cmd</kbd> + <kbd>E</kbd> |

## ソースコード

[packages/extension-code/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-code/)
