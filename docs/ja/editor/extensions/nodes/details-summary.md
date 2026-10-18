# DetailsSummary 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/details-summary](https://tiptap.dev/docs/editor/extensions/nodes/details-summary)

Details 拡張機能を使うと、エディタで `<details>` HTML タグを使えます。コンテンツの表示・非表示を切り替えるのに便利です。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Details)

## インストール

```bash
npm install @tiptap/extension-details
```

## 使い方

```js
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details'

const editor = new Editor({
  extensions: [Details, DetailsSummary, DetailsContent],
})
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
DetailsSummary.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```
