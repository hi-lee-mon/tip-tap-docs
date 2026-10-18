# Placeholder 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/placeholder](https://tiptap.dev/docs/editor/extensions/functionality/placeholder)

この拡張機能は、プレースホルダーを表示できるようにします。何を書けばよいかを、ちょっとしたヒントでユーザーに伝えられます。必要なら、いくつかの点をカスタマイズできます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Placeholder)

## インストール

```bash
npm install @tiptap/extensions
```

## 使い方

```js
import { Editor } from '@tiptap/core'
import { Placeholder } from '@tiptap/extensions'

new Editor({
  extensions: [
    Placeholder.configure({
      placeholder: 'Write something …',
    }),
  ],
})
```

### 追加の設定

プレースホルダーは CSS を使って表示します。

**空のエディタの1行目だけにプレースホルダーを表示する場合**

```
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
```

**新しい行のすべてにプレースホルダーを表示する場合**

```
.tiptap p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
```

## 設定

### emptyEditorClass

エディタが空のときに付ける CSS クラスです。

デフォルト: `'is-editor-empty'`

```js
Placeholder.configure({
  emptyEditorClass: 'is-editor-empty',
})
```

### emptyNodeClass

ノードが空のときに付ける CSS クラスです。

デフォルト: `'is-empty'`

```js
Placeholder.configure({
  emptyNodeClass: 'my-custom-is-empty-class',
})
```
関数を使って、ノードに応じてクラスを決めることもできます。
```js
Placeholder.configure({
  emptyNodeClass: ({ node }) => {
    if (node.type.name === 'heading') {
      return 'my-custom-is-empty-heading-class'
    }
    return ''
  },
})
```

### dataAttribute

プレースホルダーの文字列を入れる data 属性です。たとえば `'my-placeholder'` を指定すると、プレースホルダーの文字列は `data-my-placeholder` 属性に入ります。

デフォルト: `'placeholder'`

```js
Placeholder.configure({
  dataAttribute: 'my-placeholder'
})
```

### placeholder

`data-placeholder` 属性として付けるプレースホルダーの文字列です。

デフォルト: `'Write something …'`

```js
Placeholder.configure({
  placeholder: 'My Custom Placeholder',
})
```

関数を使って、ノードに応じたプレースホルダーを付けることもできます。

```js
Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return 'What’s the title?'
    }

    return 'Can you add some further context?'
  },
})
```

### showOnlyWhenEditable

エディタが編集可能なときだけデコレーションを表示します。

デフォルト: `true`

```js
Placeholder.configure({
  showOnlyWhenEditable: false,
})
```

### showOnlyCurrent

現在選択しているノードにだけデコレーションを表示します。

デフォルト: `true`

```js
Placeholder.configure({
  showOnlyCurrent: false,
})
```

### includeChildren

入れ子のノードにもデコレーションを表示します。プレースホルダーが付くのはテキストブロックのノード（`paragraph` や `heading` など、インラインのコンテンツを直接持つノード）だけで、`bulletList` や `listItem` などのラッパーのノードは自動的に飛ばされます。

デフォルト: `false`

```js
Placeholder.configure({
  includeChildren: true,
})
```

## ソースコード

[packages/extensions/src/placeholder](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/placeholder)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { Placeholder } from '@tiptap/extensions/placeholder'

new Editor({
  extensions: [Placeholder],
})
```
