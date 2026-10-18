# Markdown 拡張機能の API

> 原文: [https://tiptap.dev/docs/editor/markdown/api/extension](https://tiptap.dev/docs/editor/markdown/api/extension)

## 拡張機能の設定

### `Markdown.configure(options)`

Markdown 拡張機能を独自のオプションで設定します。

```typescript
Markdown.configure({
  indentation?: {
    style?: 'space' | 'tab'
    size?: number
  },
  marked?: typeof marked,
  markedOptions?: MarkedOptions,
})
```

#### パラメーター

- **`indentation`**（省略可）

  - `style`: インデントに使う文字。`'space'` または `'tab'`。デフォルトは `'space'`
  - `size`: インデントの文字数。デフォルトは `2`

- **`marked`**（省略可）

  - パースに使う、独自の MarkedJS インスタンス

- **`markedOptions`**（省略可）
  - `marked.setOptions()` に渡すオプション
  - [marked のドキュメント](https://marked.js.org/using_advanced#options)を参照してください

#### 例

```typescript
import { Markdown } from '@tiptap/markdown'

const markdown = Markdown.configure({
  indentation: {
    style: 'space',
    size: 4,
  },
  markedOptions: {
    gfm: true,
    breaks: false,
  },
})
```
