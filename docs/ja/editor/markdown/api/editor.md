# エディタ

> 原文: [https://tiptap.dev/docs/editor/markdown/api/editor](https://tiptap.dev/docs/editor/markdown/api/editor)

Markdown パッケージは新しい Editor クラスをエクスポートせず、既存の Tiptap の Editor クラスを拡張します。そのため、Tiptap の Editor の標準のメソッドやオプションをすべて使いながら、Markdown パッケージが追加する機能も使えます。

## メソッド

### `Editor.getMarkdown()`

エディタの現在のコンテンツを Markdown で取得します。

- **戻り値**: `string`

```js
const markdown = editor.getMarkdown()
```

## プロパティ

### `Editor.markdown`

MarkdownManager のインスタンスにアクセスします。

```typescript
editor.markdown: MarkdownManager
```

#### 例

```typescript
// Markdown を JSON にパースする
const json = editor.markdown.parse('# Hello')

// JSON を Markdown にシリアライズする
const markdown = editor.markdown.serialize(json)

// marked のインスタンスにアクセスする
const marked = editor.markdown.instance
```

## オプション

### `Editor.content`

エディタのコンテンツには、**HTML**、**Markdown**、**Tiptap JSON** のいずれかを指定できます。

> **注**: 初期値の `content` が Markdown の場合は、`contentType: 'markdown'` を指定してください。

- **型**: `string | object`
- **デフォルト**: `''`
- **必須**: `false`

```js
const editor = new Editor({
  content: '<h1>Hello world</h1>',
})
```

```js
const editor = new Editor({
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Hello world' }] },
  ],
})
```

```js
const editor = new Editor({
  content: '# Hello world',
  contentType: 'markdown',
})
```

### `Editor.contentType`

エディタに渡すコンテンツの種類を指定します。デフォルトは `json` です。組み合わせが正しくない場合、たとえばコンテンツが JSON オブジェクトなのに contentType が `markdown` になっている場合は、エディタが自動で `json` に切り替えます。逆の場合も同様です。

- **型**: `string`
- **デフォルト**: `json`
- **必須**: `false`
- **指定できる値**: `json`、`html`、`markdown`

```js
const editor = new Editor({
  content: '# Hello world',
  contentType: 'markdown',
})
```

## コマンドのオプション

### `setContent(content, options)`

Markdown からエディタのコンテンツを設定します。

```typescript
editor.commands.setContent(
  content: string,
  options?: {
    contentType?: string,
    emitUpdate?: boolean,
    parseOptions?: ParseOptions,
  }
): boolean
```

#### パラメーター

- **`content`**: 設定する Markdown 文字列
- **`options.contentType`**: 挿入するコンテンツの種類。`json`、`html`、`markdown` のいずれか。形式が合わない場合は自動で判定します（デフォルト: `json`）
- **`options.emitUpdate`**: update イベントを発行するかどうか（デフォルト: `true`）
- **`options.parseOptions`**: 追加のパースオプション

#### 戻り値

`boolean` - コマンドが成功したかどうか

#### 例

```typescript
editor.commands.setContent('# New Content\n\nThis is **bold**.', { contentType: 'markdown' })
```

---

### `insertContent(value, options)`

現在の選択範囲に Markdown コンテンツを挿入します。

```typescript
editor.commands.insertContent(
  value: string,
  options?: {
    contentType?: string,
    parseOptions?: ParseOptions,
    updateSelection?: boolean,
  }
): boolean
```

#### パラメーター

- **`value`**: 挿入する Markdown 文字列
- **`options.contentType`**: 挿入するコンテンツの種類。`json`、`html`、`markdown` のいずれか。形式が合わない場合は自動で判定します（デフォルト: `json`）
- **`options.updateSelection`**: 挿入後に選択範囲を更新するかどうか
- **`options.parseOptions`**: 追加のパースオプション

#### 戻り値

`boolean` - コマンドが成功したかどうか

#### 例

```typescript
editor.commands.insertContent('**Bold text** at cursor', { contentType: 'markdown' })
```

---

### `insertContentAt(position, value, options)`

指定した位置に Markdown コンテンツを挿入します。

```typescript
editor.commands.insertContentAt(
  position: number | Range,
  value: string,
  options?: {
    contentType?: string,
    parseOptions?: ParseOptions,
    updateSelection?: boolean,
  }
): boolean
```

#### パラメーター

- **`position`**: 位置（数値）または範囲（`{ from, to }`）
- **`value`**: 挿入する Markdown 文字列
- **`options.contentType`**: 挿入するコンテンツの種類。`json`、`html`、`markdown` のいずれか。形式が合わない場合は自動で判定します（デフォルト: `json`）
- **`options.updateSelection`**: 挿入後に選択範囲を更新するかどうか
- **`options.parseOptions`**: 追加のパースオプション

#### 戻り値

`boolean` - コマンドが成功したかどうか

#### 例

```typescript
// 指定した位置に挿入する
editor.commands.insertContentAt(10, '## Heading', { contentType: 'markdown' })

// 範囲を置き換える
editor.commands.insertContentAt({ from: 10, to: 20 }, '**replacement**', { contentType: 'markdown' })
```

---

## 拡張機能の仕様

拡張機能の仕様にも、次のオプションが追加されます。

### `markdownTokenName`

Markdown のパースに使うトークンの名前です。

- **型**: `string`
- **デフォルト**: `undefined`
- **必須**: `false`

```typescript
const CustomNode = Node.create({
  // ...

  markdownTokenName: 'custom_token',
})
```

### `parseMarkdown`

Markdown のトークンを ProseMirror のノードにパースする方法をカスタマイズする関数です。

- **型**: `(token: MarkdownToken, helpers: MarkdownParseHelpers) => ProseMirrorNode[] | null`
- **デフォルト**: `undefined`
- **必須**: `false`

```typescript
const CustomNode = Node.create({
  // ...

  parseMarkdown: (token, helpers) => {
    return {
      type: 'customNode',
      attrs: { type: token.type },
      content: helpers.parseChildren(token.tokens || [])
    }
  },
})
```

### `renderMarkdown`

ProseMirror のノードを Markdown にレンダリングする方法をカスタマイズする関数です。

- **型**: `(node: JSONContent, helpers: MarkdownRenderHelpers, context: RenderContext) => string | null`
- **デフォルト**: `undefined`
- **必須**: `false`

```typescript
const CustomNode = Node.create({
  // ...

  renderMarkdown: (node, helpers, context) => {
    const content = helpers.renderChildren(node.content, context)

    return `[${context.parentType}] ${content}`
  },
})
```

### `markdownTokenizer`

カスタムトークナイザーを作るための設定オブジェクトです。このトークナイザーが Markdown 文字列をトークンに変換します。

- **型**: `object`
- **デフォルト**: `undefined`
- **必須**: `false`

```typescript
const CustomNode = Node.create({
  // ...

  // ::custom text:: にマッチするトークナイザーの例
  markdownTokenizer: {
    name: 'custom_token',
    level: 'inline',
    start(src) { return src.indexOf('::') },
    tokenizer(src, tokens) {
      const rule = /^::(.*?)::/
      const match = rule.exec(src)
      if (match) {
        return {
          type: 'custom_token',
          raw: match[0],
          text: match[1].trim(),
        }
      }
    },
  },
})
```

### `markdownOptions`

Markdown のパーサーとシリアライザーに追加のオプションを渡すための、省略可能なオブジェクトです。

- **型**: `object`
- **デフォルト**: `undefined`
- **必須**: `false`

```typescript
const CustomNode = Node.create({
  // ...

  markdownOptions: {
    indentsContent: true, // この設定にすると、このノードの中ではレンダリングコンテキストのインデントの深さが1段増える
  }
})
```
