# Bold 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/bold](https://tiptap.dev/docs/editor/extensions/marks/bold)

テキストを**太字**でレンダリングするための拡張機能です。エディタの初期コンテンツに `<strong>` タグや `<b>` タグ、または CSS の `font-weight` を設定したインラインの `style` 属性付きのテキストを渡すと、どれも太字でレンダリングされます。

`**アスタリスク2つ**` または `__アンダースコア2つ__` で囲んで入力すると、入力中に自動で**太字**に変わります。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Bold)

> [!NOTE]
> **制約**
>
> `Editor` インスタンスのコンテンツを読み出すと、この拡張機能は対応する `<strong>` HTML タグを生成します。どの方法で太字にしたテキストも、`<strong>` HTML タグにそろえられます。

## インストール

```bash
npm install @tiptap/extension-bold
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Bold.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setBold()

テキストを太字にします。

```js
editor.commands.setBold()
```

### toggleBold()

太字のマークを切り替えます。

```js
editor.commands.toggleBold()
```

### unsetBold()

太字のマークを外します。

```js
editor.commands.unsetBold()
```

## キーボードショートカット

| コマンド      | Windows/Linux                     | macOS                         |
| ------------ | --------------------------------- | ----------------------------- |
| toggleBold() | <kbd>Control</kbd> + <kbd>B</kbd> | <kbd>Cmd</kbd> + <kbd>B</kbd> |

## ソースコード

[packages/extension-bold/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bold/)
