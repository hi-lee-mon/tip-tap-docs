# HorizontalRule 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/horizontal-rule](https://tiptap.dev/docs/editor/extensions/nodes/horizontal-rule)

`<hr>` HTML タグをレンダリングするための拡張機能です。エディタの初期コンテンツに `<hr>` を渡すと、そのとおりにレンダリングされます。

新しい行の先頭でダッシュ 3 つ（`---`）、またはアンダースコア 3 つとスペース（`___ `）を入力すると、魔法のように水平線に変わります。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/HorizontalRule)

## インストール

```bash
npm install @tiptap/extension-horizontal-rule
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
HorizontalRule.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setHorizontalRule()

水平線を作ります。

```js
editor.commands.setHorizontalRule()
```

## ソースコード

[packages/extension-horizontal-rule/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-horizontal-rule/)
