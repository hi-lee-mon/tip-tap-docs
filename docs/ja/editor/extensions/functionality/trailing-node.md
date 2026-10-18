# Trailing Node 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/trailing-node](https://tiptap.dev/docs/editor/extensions/functionality/trailing-node)

この拡張機能は、エディタの最後のブロックノードのあとにノードを追加します。プレースホルダーやボタンのような末尾のノードを置きたいときに便利です。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/TrailingNode)

## インストール

```bash
npm install @tiptap/extensions
```

## 使い方

```js
import { Editor } from '@tiptap/core'
import { TrailingNode } from '@tiptap/extensions'

new Editor({
  extensions: [TrailingNode],
})
```

## 設定

### node

ドキュメントの末尾に挿入するノードの型です。指定しない場合、Trailing Node は ProseMirror のスキーマが定める代替のノード（通常はデフォルトのブロックノード）を使います。この動作は `node` オプションで上書きできます。独自のドキュメント構造を定義している場合は特に関係があります。独自のドキュメントが想定される代替のノードにどう影響するかは、[コンテンツ構造を強制する例](https://tiptap.dev/docs/examples/advanced/forced-content-structure)を参照してください。

デフォルト: `undefined`

```js
TrailingNode.configure({
  node: 'paragraph',
})
```

### notAfter

このノードの型のあとには、末尾のノードを挿入しません。

デフォルト: `['paragraph']`

```js
TrailingNode.configure({
  node: 'paragraph',
  notAfter: ['heading', 'blockquote'],
})
```

## 特定のトランザクションで末尾のノードを作らない

トランザクションに `skipTrailingNode` のメタフラグを設定すると、そのトランザクションでは末尾のノードを自動で挿入しません。

```ts
editor
  .chain()
  .command(({ tr }) => {
    tr.setMeta('skipTrailingNode', true)

    return true
  })
  .run()
```

あえて末尾のノードを追加しない状態でドキュメントを残したいトランザクションに便利です。

## ソースコード

[packages/extensions/src/trailing-node/](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/trailing-node/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { TrailingNode } from '@tiptap/extensions/trailing-node'

new Editor({
  extensions: [TrailingNode],
})
```
