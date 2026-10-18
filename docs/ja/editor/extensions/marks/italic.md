# Italic 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/italic](https://tiptap.dev/docs/editor/extensions/marks/italic)

テキストを_斜体_でレンダリングするための拡張機能です。エディタの初期コンテンツに `<em>` タグや `<i>` タグ、または `font-style: italic` を設定したインラインの `style` 属性付きのテキストを渡すと、どれも斜体でレンダリングされます。

`*アスタリスク1つ*` または `_アンダースコア1つ_` で囲んで入力すると、入力中に自動で_斜体_に変わります。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Italic)

> [!NOTE]
> **制約**
>
> `Editor` インスタンスのコンテンツを読み出すと、この拡張機能は対応する `<em>` HTML タグを生成します。どの方法で斜体にしたテキストも、`<em>` HTML タグにそろえられます。

## インストール

```bash
npm install @tiptap/extension-italic
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Italic.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setItalic()

テキストを斜体にします。

```js
editor.commands.setItalic()
```

### toggleItalic()

斜体のマークを切り替えます。

```js
editor.commands.toggleItalic()
```

### unsetItalic()

斜体のマークを外します。

```js
editor.commands.unsetItalic()
```

## キーボードショートカット

| コマンド        | Windows/Linux                     | macOS                         |
| -------------- | --------------------------------- | ----------------------------- |
| toggleItalic() | <kbd>Control</kbd> + <kbd>I</kbd> | <kbd>Cmd</kbd> + <kbd>I</kbd> |

## ソースコード

[packages/extension-italic/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-italic/)
