# Highlight 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/highlight](https://tiptap.dev/docs/editor/extensions/marks/highlight)

ハイライトしたテキストを `<mark>` でレンダリングするための拡張機能です。デフォルトで背景が黄色になる標準の `<mark>` HTML タグだけを使うことも、別の色を適用することもできます。

`==イコール2つ==` で囲んで入力すると、入力中に自動で<mark>ハイライト</mark>されたテキストに変わります。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Highlight)

## インストール

```bash
npm install @tiptap/extension-highlight
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Highlight.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### multicolor

複数の色を使えるようにします。

デフォルト: `false`

```js
Highlight.configure({
  multicolor: true,
})
```

## コマンド

### setHighlight()

テキストをハイライトします。

```js
editor.commands.setHighlight()
editor.commands.setHighlight({ color: '#ffcc00' })
```

### toggleHighlight()

テキストのハイライトを切り替えます。

```js
editor.commands.toggleHighlight()
editor.commands.toggleHighlight({ color: '#ffcc00' })
```

### unsetHighlight()

ハイライトを外します。

```js
editor.commands.unsetHighlight()
```

## キーボードショートカット

| コマンド           | Windows/Linux                                        | macOS                                            |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------ |
| toggleHighlight() | <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>H</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>H</kbd> |

## ソースコード

[packages/extension-highlight/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-highlight/)
