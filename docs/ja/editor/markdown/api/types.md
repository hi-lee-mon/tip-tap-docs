# Markdown の型の API

> 原文: [https://tiptap.dev/docs/editor/markdown/api/types](https://tiptap.dev/docs/editor/markdown/api/types)

## 型

### `MarkdownExtensionOptions`

Markdown 拡張機能を設定するためのオプションです。

```typescript
type MarkdownExtensionOptions = {
  indentation?: {
    style?: 'space' | 'tab'
    size?: number
  }
  marked?: typeof marked
  markedOptions?: MarkedOptions
}
```

---

### `MarkdownExtensionSpec`

拡張機能で Markdown に対応させるための設定です。

```typescript
type MarkdownExtensionSpec = {
  parseName?: string
  renderName?: string
  markdownName?: string // 旧形式
  parseMarkdown?: (token: MarkdownToken, helpers: MarkdownParseHelpers) => MarkdownParseResult
  renderMarkdown?: (node: JSONContent, helpers: MarkdownRendererHelpers, context: RenderContext) => string
  isIndenting?: boolean
  tokenizer?: MarkdownTokenizer
}
```

---

### `MarkdownToken`

MarkedJS が生成するトークンの構造です。

```typescript
type MarkdownToken = {
  type: string
  raw?: string
  text?: string
  tokens?: MarkdownToken[]
  [key: string]: any
}
```

---

### `MarkdownParseHelpers`

パースハンドラーに渡されるヘルパーです。

```typescript
type MarkdownParseHelpers = {
  parseInline: (tokens: MarkdownToken[]) => JSONContent[]
  parseChildren: (tokens: MarkdownToken[]) => JSONContent[]
  createTextNode: (text: string, marks?: Array<{ type: string; attrs?: any }>) => JSONContent
  createNode: (type: string, attrs?: any, content?: JSONContent[]) => JSONContent
  applyMark: (markType: string, content: JSONContent[], attrs?: any) => MarkdownParseResult
}
```

---

### `MarkdownRendererHelpers`

レンダリングハンドラーに渡されるヘルパーです。

```typescript
type MarkdownRendererHelpers = {
  renderChildren: (nodes: JSONContent | JSONContent[], separator?: string) => string
  wrapInBlock: (prefix: string, content: string) => string
  indent: (content: string) => string
}
```

---

### `RenderContext`

レンダリングハンドラーに渡されるコンテキスト情報です。

```typescript
type RenderContext = {
  index: number // 親の中でのノードのインデックス
  level: number // 入れ子の深さ
  parentType?: string // 親ノードの種類
  meta: Record<string, any> // 独自のメタデータ
}
```

---

### `MarkdownTokenizer`

MarkedJS 用のカスタムトークナイザーです。

```typescript
type MarkdownTokenizer = {
  name: string
  level?: 'block' | 'inline'
  start?: (src: string) => number | undefined
  tokenize: (src: string, tokens: MarkdownToken[], lexer: MarkdownLexerConfiguration) => MarkdownToken | undefined
}
```

---

### `MarkdownLexerConfiguration`

カスタムトークナイザーで使うレキサーのヘルパーです。

```typescript
type MarkdownLexerConfiguration = {
  inlineTokens: (src: string) => MarkdownToken[]
  blockTokens: (src: string) => MarkdownToken[]
}
```

---

### `MarkdownParseResult`

パースハンドラーの戻り値の型です。

```typescript
type MarkdownParseResult = JSONContent | JSONContent[] | { mark: string; content: JSONContent[]; attrs?: any } | null
```

---

### `ExtendableMarkdownSpec`

拡張機能に書く Markdown の設定です。

```typescript
type ExtendableMarkdownSpec = {
  name?: string
  parseName?: string
  renderName?: string
  parse?: (token: MarkdownToken, helpers: MarkdownParseHelpers) => MarkdownParseResult
  render?: (node: JSONContent, helpers: MarkdownRendererHelpers, context: RenderContext) => string
  isIndenting?: boolean
  tokenizer?: MarkdownTokenizer
}
```
