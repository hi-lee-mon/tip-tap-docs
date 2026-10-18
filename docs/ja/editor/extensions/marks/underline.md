# Underline 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/underline](https://tiptap.dev/docs/editor/extensions/marks/underline)

テキストに<u>下線</u>を付けてレンダリングするための拡張機能です。エディタの初期コンテンツに `<u>` タグ、または `text-decoration: underline` を設定したインラインの `style` 属性付きのテキストを渡すと、どれも下線付きでレンダリングされます。

インターネット上では、下線付きのテキストはたいていクリックできるリンクを表します。下線付きのテキストでユーザーを混乱させないよう注意してください。

> [!NOTE]
> **制約**
>
> `Editor` インスタンスのコンテンツを読み出すと、この拡張機能は対応する `<u>` HTML タグを生成します。どの方法で下線を付けたテキストも、`<u>` HTML タグにそろえられます。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Underline)

## インストール

```bash
npm install @tiptap/extension-underline
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Underline.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setUnderline()

テキストに下線を付けます。

```js
editor.commands.setUnderline()
```

### toggleUnderline()

下線のマークを切り替えます。

```js
editor.commands.toggleUnderline()
```

### unsetUnderline()

下線のマークを外します。

```js
editor.commands.unsetUnderline()
```

## キーボードショートカット

| コマンド           | Windows/Linux                     | macOS                         |
| ----------------- | --------------------------------- | ----------------------------- |
| toggleUnderline() | <kbd>Control</kbd> + <kbd>U</kbd> | <kbd>Cmd</kbd> + <kbd>U</kbd> |

## ソースコード

[packages/extension-underline/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-underline/)
