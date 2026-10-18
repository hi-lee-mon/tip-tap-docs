# Superscript 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/superscript](https://tiptap.dev/docs/editor/extensions/marks/superscript)

テキストを<sup>上付き文字</sup>でレンダリングするための拡張機能です。エディタの初期コンテンツに `<sup>` タグ、またはインラインスタイルで `vertical-align: super` を指定したテキストを渡すと、どちらも上付き文字でレンダリングされます。

> [!NOTE]
> **制約**
>
> `Editor` インスタンスのコンテンツを読み出すと、この拡張機能は対応する `<sup>` HTML タグを生成します。どの方法で上付き文字にしたテキストも、`<sup>` HTML タグにそろえられます。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Superscript)

## インストール

```bash
npm install @tiptap/extension-superscript
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Superscript.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setSuperscript()

テキストを上付き文字にします。

```js
editor.commands.setSuperscript()
```

### toggleSuperscript()

上付き文字のマークを切り替えます。

```js
editor.commands.toggleSuperscript()
```

### unsetSuperscript()

上付き文字のマークを外します。

```js
editor.commands.unsetSuperscript()
```

## キーボードショートカット

| コマンド             | Windows/Linux                     | macOS                         |
| ------------------- | --------------------------------- | ----------------------------- |
| toggleSuperscript() | <kbd>Control</kbd> + <kbd>.</kbd> | <kbd>Cmd</kbd> + <kbd>.</kbd> |

## ソースコード

[packages/extension-superscript/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-superscript/)
