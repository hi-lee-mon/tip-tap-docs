# Strike 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/strike](https://tiptap.dev/docs/editor/extensions/marks/strike)

~~取り消し線付きのテキスト~~をレンダリングするための拡張機能です。エディタの初期コンテンツに `<s>`、`<del>`、`<strike>` タグ、または `text-decoration: line-through` を設定したインラインの `style` 属性付きのテキストを渡すと、どれも取り消し線付きでレンダリングされます。

`~~ チルダで囲んだテキスト ~~` を入力すると、入力中に自動で~~取り消し線~~が付きます。

> [!NOTE]
> **制約**
>
> `Editor` インスタンスのコンテンツを読み出すと、この拡張機能は対応する `<s>` HTML タグを生成します。どの方法で取り消し線を付けたテキストも、`<s>` HTML タグにそろえられます。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Strike)

## インストール

```bash
npm install @tiptap/extension-strike
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Strike.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setStrike()

テキストに取り消し線を付けます。

```js
editor.commands.setStrike()
```

### toggleStrike()

取り消し線のマークを切り替えます。

```js
editor.commands.toggleStrike()
```

### unsetStrike()

取り消し線のマークを外します。

```js
editor.commands.unsetStrike()
```

## キーボードショートカット

| コマンド        | Windows/Linux                                        | macOS                                            |
| -------------- | ---------------------------------------------------- | ------------------------------------------------ |
| toggleStrike() | <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> |

## ソースコード

[packages/extension-strike/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-strike/)
