# Subscript 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/subscript](https://tiptap.dev/docs/editor/extensions/marks/subscript)

テキストを<sub>下付き文字</sub>でレンダリングするための拡張機能です。エディタの初期コンテンツに `<sub>` タグ、またはインラインスタイルで `vertical-align: sub` を指定したテキストを渡すと、どちらも下付き文字でレンダリングされます。

> [!NOTE]
> **制約**
>
> `Editor` インスタンスのコンテンツを読み出すと、この拡張機能は対応する `<sub>` HTML タグを生成します。どの方法で下付き文字にしたテキストも、`<sub>` HTML タグにそろえられます。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Subscript)

## インストール

```bash
npm install @tiptap/extension-subscript
```

## 設定

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Subscript.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setSubscript()

テキストを下付き文字にします。

```js
editor.commands.setSubscript()
```

### toggleSubscript()

下付き文字のマークを切り替えます。

```js
editor.commands.toggleSubscript()
```

### unsetSubscript()

下付き文字のマークを外します。

```js
editor.commands.unsetSubscript()
```

## キーボードショートカット

| コマンド           | Windows/Linux                     | macOS                         |
| ----------------- | --------------------------------- | ----------------------------- |
| toggleSubscript() | <kbd>Control</kbd> + <kbd>,</kbd> | <kbd>Cmd</kbd> + <kbd>,</kbd> |

## ソースコード

[packages/extension-subscript/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-subscript/)
