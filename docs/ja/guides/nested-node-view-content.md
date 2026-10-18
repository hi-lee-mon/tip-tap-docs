# 入れ子のノードビュー

> 原文: [https://tiptap.dev/docs/guides/nested-node-view-content](https://tiptap.dev/docs/guides/nested-node-view-content)

このガイドでは、複数の子ノードを持つ親ノードを作り、子ノードをそれぞれ専用のコンポーネントでレンダリングする方法を紹介します。1つのブロックの中に、見た目の異なる構造化されたコンテンツを置きたいときに役立つパターンです。

ノードビューが初めての場合は、[ノードビューの概要](../editor/extensions/custom-extensions/node-views/index.md)と、フレームワーク別のガイド（[React](../editor/extensions/custom-extensions/node-views/react.md)、[Vue](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/vue)）から読み始めてください。

## 要点

このパターンでいちばん大事なのは、スキーマを正しく定義することです。親ノードは、どの子ノードを許可するかを明示的に宣言する必要があります。また、子ノードにはそれぞれ、`NodeViewContent` コンポーネントを持つ専用のノードビューが必要です。

この例では、親の `multiNode` が `firstNode` と `secondNode` の2つの子ノードを持ちます。各ノードはそれぞれ専用のコンポーネントでレンダリングされます。

> [!NOTE]
> **まずスキーマを確認する**
>
> 入れ子の `NodeViewContent` が期待どおりにレンダリングされない場合は、コンポーネントをデバッグする前に、
> 親ノードと子ノードの拡張機能にある `content` の式を確認し直してください。

## 親ノードを挿入する

親ノードを挿入するときは、構造全体を一度に作ります。こうすると、ドキュメントには常に想定どおりの子ノードが含まれます。

```js
editor
  .chain()
  .focus()
  .insertContent(
    editor.schema.node('multiNode', null, [
      editor.schema.node('firstNode', null, [editor.schema.node('paragraph')]),
      editor.schema.node('secondNode', null, [editor.schema.node('paragraph')]),
    ]),
  )
  .run()
```

## Vue

### 親ノードの拡張機能

```js
import MultiNode from './MultiNode.vue'
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

export default Node.create({
  name: 'multiNode',
  group: 'block',
  content: 'firstNode secondNode',
  parseHTML() {
    return [{ tag: 'multi-node' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['multi-node', mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(MultiNode)
  },
})
```

### 親ノードのノードビュー

親のコンポーネントは外側の構造を受け持ちます。その中に子ノードのノードビューをレンダリングするには、`<node-view-content />` を使います。

```html
<template>
  <node-view-wrapper class="multi-node">
    <node-view-content />
  </node-view-wrapper>
</template>

<script setup>
  import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
</script>
```

### 子ノードの拡張機能

子ノードは親と同じグループに属し、編集できるコンテンツを自分で定義します。

```js
import FirstNode from './FirstNode.vue'
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

export default Node.create({
  name: 'firstNode',
  group: 'block',
  content: 'block+',
  parseHTML() {
    return [{ tag: 'first-node' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['first-node', mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(FirstNode)
  },
})
```

### 子ノードのノードビュー

```html
<template>
  <node-view-wrapper class="first-node">
    <node-view-content />
  </node-view-wrapper>
</template>

<script setup>
  import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
</script>
```

`secondNode` の拡張機能とノードビューも、`firstNode` と同じ形で作ります。

## React

React でも、スキーマのルールは同じです。主な違いは、`@tiptap/react` の `ReactNodeViewRenderer`、`NodeViewWrapper`、`NodeViewContent` を使う点です。

### 親ノードの拡張機能

```js
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import MultiNode from './MultiNode.jsx'

export default Node.create({
  name: 'multiNode',
  group: 'block',
  content: 'firstNode secondNode',
  parseHTML() {
    return [{ tag: 'multi-node' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['multi-node', mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return ReactNodeViewRenderer(MultiNode)
  },
})
```

### 親ノードのノードビュー

```jsx
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export default function MultiNode() {
  return (
    <NodeViewWrapper className="multi-node">
      <NodeViewContent />
    </NodeViewWrapper>
  )
}
```

### 子ノードの拡張機能

```js
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import FirstNode from './FirstNode.jsx'

export default Node.create({
  name: 'firstNode',
  group: 'block',
  content: 'block+',
  parseHTML() {
    return [{ tag: 'first-node' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['first-node', mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return ReactNodeViewRenderer(FirstNode)
  },
})
```

### 子ノードのノードビュー

```jsx
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export default function FirstNode() {
  return (
    <NodeViewWrapper className="first-node">
      <NodeViewContent />
    </NodeViewWrapper>
  )
}
```

`secondNode` の拡張機能とノードビューも、`firstNode` と同じ形で作ります。

## 関連資料

- [ノードビューの概要](../editor/extensions/custom-extensions/node-views/index.md)
- [React でのノードビュー](../editor/extensions/custom-extensions/node-views/react.md)
- [Vue でのノードビュー](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/vue)
- [独自のノードを作る](../editor/extensions/custom-extensions/create-new/node.md)
