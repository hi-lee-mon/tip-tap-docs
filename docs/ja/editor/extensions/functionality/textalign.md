# TextAlign 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/textalign](https://tiptap.dev/docs/editor/extensions/functionality/textalign)

この拡張機能は、指定したノードにテキストの配置を表す属性を追加します。この属性を使ってテキストを揃えます。

> [!NOTE]
> **Firefox のバグ**
>
> Firefox では、`text-align: justify` と `white-space: pre-wrap` を一緒に使うと働きません。これは[既知の問題](https://bugzilla.mozilla.org/show_bug.cgi?id=1253840)です。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/TextAlign)

## インストール

```bash
npm install @tiptap/extension-text-align
```

## 設定

### types

テキストの配置の属性を適用するノードの一覧です。通常は `['heading', 'paragraph']` のように指定します。

デフォルト: `[]`

```js
TextAlign.configure({
  types: ['heading', 'paragraph'],
})
```

### alignments

テキストの配置の属性に指定できる値の一覧です。

デフォルト: `['left', 'center', 'right', 'justify']`

```js
TextAlign.configure({
  alignments: ['left', 'right'],
})
```

### defaultAlignment

デフォルトのテキストの配置です。

デフォルト: `null`

```js
TextAlign.configure({
  defaultAlignment: 'right',
})
```

## コマンド

### setTextAlign()

テキストの配置を指定した値にします。

```js
editor.commands.setTextAlign('right')
```

### unsetTextAlign()

テキストの配置の値を取り除きます。

```js
editor.commands.unsetTextAlign()
```

### toggleTextAlign()

テキストの配置の値を切り替えます。現在の値が指定した値と同じなら、値を取り除きます。

```js
editor.commands.toggleTextAlign('right')
```

## キーボードショートカット

| コマンド | Windows/Linux | macOS |
| --- | --- | --- |
| setTextAlign(left) | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> |
| setTextAlign(center) | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd> |
| setTextAlign(right) | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> |
| setTextAlign(justify) | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> |

## ソースコード

[packages/extension-text-align/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-align/)
