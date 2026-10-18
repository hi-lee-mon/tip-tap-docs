# Details 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/details](https://tiptap.dev/docs/editor/extensions/nodes/details)

Details 拡張機能を使うと、エディタで `<details>` HTML タグを使えます。コンテンツの表示・非表示を切り替えるのに便利です。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Details)

## インストール

```bash
npm install @tiptap/extension-details
```

この拡張機能には [`DetailsSummary`](details-summary.md) ノードと [`DetailsContent`](details-content.md) ノードが必要です。

## 設定

### persist

開閉の状態をドキュメントに保存するかどうかを指定します。デフォルトは `false` です。

```js
Details.configure({
  persist: true,
})
```

### openClassName

コンテンツを開いたときに付ける CSS クラスを指定します。デフォルトは `is-open` です。

```js
Details.configure({
  openClassName: 'is-open',
})
```

### renderToggleButton

details ノードを開閉するボタンをカスタマイズします。コールバックには、ボタンの `element`、現在の開閉状態 `isOpen`、ラベルの元にする `node` が渡されます。

ボタンのアクセシブルなラベルを変えたいときや、ボタン要素を直接更新したいときに便利です。

```js
Details.configure({
  renderToggleButton: ({ element, isOpen, node }) => {
    element.setAttribute(
      'aria-label',
      isOpen
        ? `Collapse details: ${node.textContent || 'details'}`
        : `Expand details: ${node.textContent || 'details'}`,
    )
  },
})
```

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Details.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setDetails()

コンテンツを details ノードで包みます。

```js
editor.commands.setDetails()
```

### unsetDetails()

details ノードの包みを外します。

```js
editor.commands.unsetDetails()
```
