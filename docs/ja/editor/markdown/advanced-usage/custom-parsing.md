# Markdown のカスタムパース

> 原文: [https://tiptap.dev/docs/editor/markdown/advanced-usage/custom-parsing](https://tiptap.dev/docs/editor/markdown/advanced-usage/custom-parsing)

このガイドでは、Tiptap エディタで Markdown のカスタムパースを実装する手順を説明します。読み終えるころには、[トークン](../glossary#token)から [Tiptap JSON](../glossary#tiptap-json) を取り出せるようになります。

拡張機能には、特定の Markdown トークンを扱う独自のパース処理を持たせられます。そのために使うのが `markdown.parse` ハンドラーです。

## パースハンドラーを作って仕組みを理解する

パースハンドラーは、MarkedJS から Markdown のトークンを受け取り、エディタが扱える Tiptap JSON のコンテンツを返します。
パース関数はトークンのほかに、パースを手助けするユーティリティ関数をまとめた `helpers` オブジェクトも受け取ります。

これらは、ノードやマークを作るときや、`token.tokens` にある `MarkedJS` の子トークンをパースするときに役立ちます。

```typescript
const MyHeading = Node.create({
  name: 'customHeading',
  // ...

  markdownTokenName: 'heading', // 扱うトークンの種類（省略可。デフォルトは拡張機能の名前）
  parseMarkdown: (token, helpers) => {
    return {
      type: 'heading',
      attrs: { level: token.depth },
      content: helpers.parseInline(token.tokens || []),
    }
  },
})
```

この例のパースハンドラーは、MarkedJS が Markdown マネージャーに渡す `heading` トークンを処理します。
このトークンを受け取り、ノードの種類が `heading` の Tiptap ノードに変換しています。

トークンから適切な `level` 属性を取り出し、インラインのコンテンツを `helpers.parseInline()` 関数でパースします（見出しに入れられるのはマークかインラインのテキストだけだからです）。

> **重要**: トークンが持つ属性は、[トークナイザー](../glossary#tokenizer)の設定によって変わることがあります。

## パース用のヘルパー関数

前の節で説明したとおり、`helpers` オブジェクトには、子トークンのパースやノード・マークの作成に使うユーティリティ関数がそろっています。
以下、ヘルパーごとに使い方を説明します。

### インラインレベルの子トークンを `helpers.parseInline(tokens)` でパースする

このヘルパーはトークンのリストを受け取り、インラインのコンテンツ（マーク付きのテキストノード）としてのパースを**試みます**。
トークンが本当にインラインのトークンかどうかは確かめないので、ここにはインラインのトークンだけを渡してください。

この関数は、Tiptap ノードの `content` に使える `TiptapJSON[]` を返します。

```typescript
parse: (token, helpers) => {
  const content = helpers.parseInline(token.tokens || [])

  return {
    type: 'paragraph',
    content,
  }
}
```

### ブロックレベルの子トークンを `helpers.parseChildren(tokens)` でパースする

`parseInline()` と似ていますが、トークンをブロックレベルのコンテンツ（リスト項目、引用、コードブロックなど）としてパースします。
トークンが本当にブロックレベルのトークンかどうかは確かめないので、ここにはブロックレベルのトークンだけを渡してください。

この関数は、Tiptap ノードの `content` に使える `TiptapJSON[]` を返します。

```typescript
parse: (token, helpers) => {
  // 入れ子のブロックコンテンツ（リスト項目など）をパースする
  const content = helpers.parseChildren(token.tokens || [])

  return {
    type: 'blockquote',
    content,
  }
}
```

### `helpers.parseInline()` と `helpers.applyMark()` でマークをパースする

コンテンツにマークを適用するには、`helpers.applyMark()` を使います。

```typescript
const Bold = Mark.create({
  name: 'bold',

  markdownTokenName: 'strong',
  parseMarkdown: (token, helpers) => {
    const content = helpers.parseInline(token.tokens || []) // マークの中のインラインコンテンツをパースする
    return helpers.applyMark('bold', content) // パースしたコンテンツに 'bold' マークを適用する
  },
})
```

## Markdown の中の HTML をパースする

Markdown に HTML が含まれている場合は、拡張機能の既存の `parseHTML` メソッドでパースされます。

```markdown
# Regular Markdown

<custom-component data-foo="bar">
  <p>This HTML is parsed by your extensions</p>
</custom-component>

More **Markdown** here.
```

## Markdown のトークン名を指定する

トークンをノードやマークにパースするとき、トークンとノード・マークの名前が一対一に対応しないことがあります。その場合は `markdownTokenName` を使い、どのトークン名をパースしてノードやマークの種類名に対応させるかを指定します。

```typescript
const CustomBold = Mark.create({
  name: 'bold',
  // ...

  markdownTokenName: 'strong', // パース時に 'strong' トークンにマッチさせる
  parseMarkdown: (token, helpers) => { /* ... */ },
  renderMarkdown: (node, helpers) => { /* ... */ },
})
```

次のような場面で役立ちます。

- Markdown のトークン名がノード名と違う
- 複数の Markdown トークンを同じ種類のノードに対応させたい
- 1種類のノードを、複数の Markdown 形式にシリアライズしたい

## フォールバックのパース

特定の種類のトークンを扱う拡張機能がない場合、MarkdownManager はよく使うトークンについてフォールバックのパースを行います。

- `paragraph` → `{ type: 'paragraph' }`
- `heading` → `{ type: 'heading', attrs: { level } }`
- `text` → `{ type: 'text', text }`
- `html` → 拡張機能の `parseHTML` メソッドでパースする

これらの種類のトークンに独自のハンドラーを用意すれば、この動きを上書きできます。

## パースをデバッグする

MarkedJS が何を生成しているかを知るには、トークンをログに出力します。

```typescript
const markdown = '# Hello **World**'
const tokens = editor.markdown.instance.lexer(markdown)
console.log(JSON.stringify(tokens, null, 2))
```

### トークンを単独でパースする

```typescript
const token = {
  type: 'heading',
  depth: 1,
  tokens: [{ type: 'text', text: 'Hello' }],
}

const helpers = {
  parseInline: tokens => [{ type: 'text', text: 'Hello' }],
  // ... その他のヘルパー
}

const result = myExtension.options.markdown.parse(token, helpers)
console.log(result)
```

## パフォーマンスへの配慮

### 遅延パース

大きなドキュメントでは、必要になったときにパースする方法を検討してください。

```typescript
let cachedJSON = null

function getJSON() {
  if (!cachedJSON) {
    cachedJSON = editor.markdown.parse(largeMarkdownString)
  }
  return cachedJSON
}
```

### 差分更新

変更のたびにドキュメント全体をパースし直すのではなく、該当する部分だけを更新します。

```typescript
editor.commands.insertContentAt(position, newMarkdown, { contentType: 'markdown' })
```

## 例

### 見出し用のカスタムパーサー

`customHeading` 拡張機能のために、見出しのレベルを取り出し、見出しごとに一意の ID も生成するカスタムパーサーを作ってみましょう。

```typescript
import { Node } from '@tiptap/core'

const CustomHeading = Node.create({
  name: 'customHeading',

  // ... その他の設定

  parseMarkdown: (token, helpers) => {
    const level = token.depth || 1 // 見出しのレベルはトークンから取得できる

    // 独自の属性を追加する
    return {
      type: 'customHeading',
      attrs: {
        level,
        id: `heading-${Math.random()}`, // ID を生成する
      },
      content: helpers.parseInline(token.tokens || []), // 見出しトークンのインラインコンテンツをパースする
    }
  },
})
```

### YouTube 埋め込み用のカスタムパーサー

`youtube` トークンを、埋め込み用の適切な属性を持つ `youtubeEmbed` ノードに変換するカスタムパーサーを作ってみましょう。

```typescript
import { Node } from '@tiptap/core'

const YoutubeEmbed = Node.create({
  name: 'youtubeEmbed',
  atom: true, // それ自体で完結したノード

  // ... その他の設定

  parseMarkdown: (token) => {
    // これらの属性は youtube トークンから取り出す
    // ここでは、カスタムトークナイザーが次のような Markdown 記法から
    // これらのトークンを生成していると仮定する: ![youtube](videoId?start=60&width=800&height=450)
    const videoId = token.videoId || ''
    const start = token.start || 0
    const width = token.width || 560
    const height = token.height || 315

    // アトムノードはそれ自体で完結しているので、
    // 子をパースするためのヘルパーは要らない
    return {
      type: 'youtubeEmbed',
      attrs: {
        videoId,
        start,
        width,
        height,
      },
    }
  },
})
```
