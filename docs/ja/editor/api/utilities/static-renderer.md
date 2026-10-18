# 静的レンダラー

> 原文: [https://tiptap.dev/docs/editor/api/utilities/static-renderer](https://tiptap.dev/docs/editor/api/utilities/static-renderer)

静的レンダラーを使うと、エディタのインスタンスなしで JSON コンテンツを HTML、Markdown、React コンポーネントとしてレンダリングできます。必要なのは JSON コンテンツと拡張機能のリストだけです。

[デモを開く](https://embed.tiptap.dev/preview/examples/staticrendering)

## 静的レンダリングを使う理由

静的レンダリングの主な用途は、Tiptap / ProseMirror の JSON ドキュメントをサーバー側でレンダリングすることです。たとえば Next.js や Nuxt.js のアプリケーションの中で使います。エディタのコンテンツをクライアントに送る前に HTML にしておけるので、クライアントでもサーバーでもエディタを読み込まずに済み、アプリケーションのパフォーマンスが上がります。

もう 1 つの用途は、エディタのコンテンツを Markdown など別の形式にレンダリングすることです。Markdown ベースの API に送りたい場合に役立ちます。静的レンダラーは、正しいマッピングさえ用意すれば、出力をどんな形式にもできるように作られています。

では、何が「静的」なのでしょうか。静的レンダラーは、コンテンツのレンダリングにブラウザも DOM も、エディタのインスタンスすら必要としません。ドキュメント（JSON または ProseMirror の Node インスタンス）を受け取り、目的の形式で返す、純粋な JavaScript の関数です。

## JSON から HTML 文字列を生成する

JSON ドキュメントを渡すと、`renderToHTMLString` 関数はその JSON コンテンツを表す HTML 文字列を返します。引数は JSON ドキュメント、拡張機能のリスト、オプションオブジェクトの 3 つです。

```js
import StarterKit from '@tiptap/starter-kit'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'

renderToHTMLString({
  extensions: [StarterKit], // 使っている拡張機能を渡す
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello World!',
          },
        ],
      },
    ],
  },
})
// 戻り値: '<p>Hello World!</p>'
```

[デモを開く](https://embed.tiptap.dev/preview/GuideContent/StaticRenderHTML)

### generateHTML API

```ts
function renderToHTMLString(options: {
  extensions: Extension[]
  content: ProsemirrorNode | JSONContent
  staticEditorOptions?: { textDirection?: 'ltr' | 'rtl' | 'auto' }
  options?: TiptapHTMLStaticRendererOptions
}): string
```

- `extensions`: コンテンツのレンダリングに使う Tiptap 拡張機能の配列。
- `content`: レンダリングするコンテンツ。ProseMirror の Node インスタンスか、ProseMirror ドキュメントを JSON で表したもの。
- `staticEditorOptions`: 出力に影響するエディタ単位のオプション（省略可）。現在は `textDirection`（`'ltr' | 'rtl' | 'auto'`）に対応しています。`Editor` の `textDirection` オプションと同じ働きで、出力に期待どおりの `dir` 属性が付きます。
- `options`: 追加のオプションを持つオブジェクト。
- `options.nodeMapping`: ProseMirror のノードを HTML 文字列に対応づけるオブジェクト。
- `options.markMapping`: ProseMirror のマークを HTML 文字列に対応づけるオブジェクト。
- `options.unhandledNode`: 処理できないノードに出会ったときに呼ばれる関数。
- `options.unhandledMark`: 処理できないマークに出会ったときに呼ばれる関数。

## JSON から Markdown を生成する

JSON ドキュメントを渡すと、`renderToMarkdown` 関数はその JSON コンテンツを表す Markdown 文字列を返します。引数は JSON ドキュメント、拡張機能のリスト、オプションオブジェクトの 3 つです。

> [!WARNING]
> このパッケージは Markdown の出力を検証しません。Markdown には複数の方言がありますが、
> このパッケージはどれにも準拠を強制しません。出力が正しい Markdown になっているかは、
> 利用者側で確認してください。

```js
import StarterKit from '@tiptap/starter-kit'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'

renderToMarkdown({
  extensions: [StarterKit], // 使っている拡張機能を渡す
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello World!',
          },
        ],
      },
    ],
  },
})
// 戻り値: 'Hello World!'
```

### generateMarkdown API

```ts
function renderToMarkdown(options: {
  extensions: Extension[]
  content: ProsemirrorNode | JSONContent
  staticEditorOptions?: { textDirection?: 'ltr' | 'rtl' | 'auto' }
  options?: TiptapMarkdownStaticRendererOptions
}): string
```

- `extensions`: コンテンツのレンダリングに使う Tiptap 拡張機能の配列。
- `content`: レンダリングするコンテンツ。ProseMirror の Node インスタンスか、ProseMirror ドキュメントを JSON で表したもの。
- `staticEditorOptions`: 出力に影響するエディタ単位のオプション（省略可）。現在は `textDirection`（`'ltr' | 'rtl' | 'auto'`）に対応しています。`Editor` の `textDirection` オプションと同じ働きで、出力に期待どおりの `dir` 属性が付きます。
- `options`: 追加のオプションを持つオブジェクト。
- `options.nodeMapping`: ProseMirror のノードを Markdown 文字列に対応づけるオブジェクト。
- `options.markMapping`: ProseMirror のマークを Markdown 文字列に対応づけるオブジェクト。
- `options.unhandledNode`: 処理できないノードに出会ったときに呼ばれる関数。
- `options.unhandledMark`: 処理できないマークに出会ったときに呼ばれる関数。

## JSON から React コンポーネントを生成する

JSON ドキュメントを渡すと、`renderToReactElement` 関数はその JSON コンテンツを表す React コンポーネントを返します。引数は JSON ドキュメント、拡張機能のリスト、オプションオブジェクトの 3 つです。

```js
import StarterKit from '@tiptap/starter-kit'
import { renderToReactElement } from '@tiptap/static-renderer/pm/react'

renderToReactElement({
  extensions: [StarterKit], // 使っている拡張機能を渡す
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello World!',
          },
        ],
      },
    ],
  },
})
// React ノードを返す。評価すると、Tiptap エディタのインスタンスなしで '<p>Hello World!</p>' と同じ結果になる
```

[デモを開く](https://embed.tiptap.dev/preview/GuideContent/StaticRenderReact)

### generateReactElement API

```ts
function renderToReactElement(options: {
  extensions: Extension[]
  content: ProsemirrorNode | JSONContent
  staticEditorOptions?: { textDirection?: 'ltr' | 'rtl' | 'auto' }
  options?: TiptapReactStaticRendererOptions
}): ReactElement
```

- `extensions`: コンテンツのレンダリングに使う Tiptap 拡張機能の配列。
- `content`: レンダリングするコンテンツ。ProseMirror の Node インスタンスか、ProseMirror ドキュメントを JSON で表したもの。
- `staticEditorOptions`: 出力に影響するエディタ単位のオプション（省略可）。現在は `textDirection`（`'ltr' | 'rtl' | 'auto'`）に対応しています。`Editor` の `textDirection` オプションと同じ働きで、出力に期待どおりの `dir` 属性が付きます。
- `options`: 追加のオプションを持つオブジェクト。
- `options.nodeMapping`: ProseMirror のノードを React コンポーネントに対応づけるオブジェクト。
- `options.markMapping`: ProseMirror のマークを React コンポーネントに対応づけるオブジェクト。
- `options.unhandledNode`: 処理できないノードに出会ったときに呼ばれる関数。
- `options.unhandledMark`: 処理できないマークに出会ったときに呼ばれる関数。

### React のノードビュー

静的レンダラーはノードビューに自動では対応しません。ノードビューとしてレンダリングしたいノードの種類ごとに、マッピングを用意する必要があります。ノードビューを React コンポーネントとしてレンダリングする例を示します。

```js

import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { renderToReactElement } from '@tiptap/static-renderer/pm/react'

// このコンポーネントは NodeViewContent を持たないので、子のリッチテキストコンテンツはレンダリングしない
function MyCustomComponentWithoutContent() {
  const [count, setCount] = React.useState(200)

  return (
    <div className='custom-component-without-content' onClick={() => setCount(a => a + 1)}>
      {count} This is a react component!
    </div>
  )
}

const CustomNodeExtensionWithoutContent = Node.create({
  name: 'customNodeExtensionWithoutContent',
  atom: true,
  renderHTML() {
    return ['div', { class: 'my-custom-component-without-content' }] as const
  },
  addNodeView() {
    return ReactNodeViewRenderer(MyCustomComponentWithoutContent)
  },
})

renderToReactElement({
  extensions: [StarterKit, CustomNodeExtensionWithoutContent],
  options: {
    nodeMapping: {
      // カスタムノードを、想定しているノードビューの React コンポーネントでレンダリングする
      customNodeExtensionWithoutContent: MyCustomComponentWithoutContent,
    },
  },
  content: {
    type: 'doc',
    content: [
      {
        type: 'customNodeExtensionWithoutContent',
      },
    ],
  },
})
// 戻り値: <div class="my-custom-component-without-content">200 This is a react component!</div>
```

では、ノードビューのリッチテキストコンテンツもレンダリングしたい場合はどうするか。ノードビューのコンポーネントの子として `NodeViewContent` コンポーネントを置けば実現できます。

```js
import { Node } from '@tiptap/core'
import {
  NodeViewContent,
  ReactNodeViewContentProvider,
  ReactNodeViewRenderer
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { renderToReactElement } from '@tiptap/static-renderer/pm/react'

const CustomNodeExtensionWithContent = Node.create({
  name: 'customNodeExtensionWithContent',
  content: 'text*',
  group: 'block',
  renderHTML() {
    return ['div', { class: 'my-custom-component-with-content' }, 0] as const
  },
  addNodeView() {
    return ReactNodeViewRenderer(MyCustomComponentWithContent)
  },
})

function MyCustomComponentWithContent() {
  return (
    <div className="custom-component-with-content">
      Custom component with content in React!
      <NodeViewContent />
    </div>
  )
}

renderToReactElement({
  extensions: [StarterKit, CustomNodeExtensionWithContent],
  options: {
    nodeMapping: {
      customNodeExtensionWithContent: ({ children }) => {
        // コンテンツを NodeViewContent コンポーネントまで渡すには、カスタムコンポーネントを ReactNodeViewContentProvider で包む必要がある
        return (
          <ReactNodeViewContentProvider content={children}>
            <MyCustomComponentWithContent />
          </ReactNodeViewContentProvider>
        )
      },
    },
  },
  content: {
    type: 'doc',
    content: [
      {
        type: 'customNodeExtensionWithContent',
        // リッチテキストコンテンツ
        content: [
          {
            type: 'text',
            text: 'Hello, world!',
          },
        ],
      },
    ],
  },
})

// 戻り値: <div class="custom-component-with-content">Custom component with content in React!<div data-node-view-content="" style="white-space:pre-wrap">Hello, world!</div></div>
// 注: NodeViewContent コンポーネントは data-node-view-content 属性付きの div としてレンダリングされ、その中にリッチテキストコンテンツがレンダリングされる
```

[デモを開く](https://embed.tiptap.dev/preview/Examples/StaticRenderingAdvanced)

## 制限事項と回避策

静的レンダラーはスキーマを組み立て、各拡張機能の `renderHTML` を実行しますが、`Editor` のインスタンスは作りません。そのため、次のようになります。

- `addProseMirrorPlugins`、`onCreate`、`onUpdate`、トランザクションのフックは実行されない。
- こうした仕組みで属性を設定する拡張機能は、その属性を自分では埋めない。たとえば `UniqueID`（`data-id`）や `TableOfContents`（`id`、`data-toc-id`）が該当する。

このような場合は、レンダリングの前に JSON ドキュメントを前処理してください。

```ts
import { generateUniqueIds } from '@tiptap/extension-unique-id'
import { generateTocIds } from '@tiptap/extension-table-of-contents'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'

let doc = sourceJson
doc = generateUniqueIds(doc, extensions) // UniqueID を使っている場合
doc = generateTocIds(doc, extensions)    // TableOfContents を使っている場合

const html = renderToHTMLString({
  content: doc,
  extensions,
  staticEditorOptions: { textDirection: 'auto' }, // EditorOptions の一部と同じ働きをする
})
```

出力に影響するエディタ単位のオプションは、`staticEditorOptions` オブジェクトで受け付けます（現在は `textDirection`）。実行時のビューやトランザクションの流れに依存するほかのエディタオプションは対象外です。

## 共通のオプション

`renderToHTMLString`、`renderToMarkdown`、`renderToReactElement` の各関数は、引数としてオプションオブジェクトを受け取ります。このオブジェクトで独自のノード・マークのマッピングを指定したり、処理できないノードやマークの扱いを決めたりして、レンダラーの出力をカスタマイズできます。

```js
import StarterKit from '@tiptap/starter-kit'
import {
  renderToHTMLString,
  serializeChildrenToHTMLString,
} from '@tiptap/static-renderer/pm/html-string'

renderToHTMLString({
  extensions: [StarterKit], // 使っている拡張機能を渡す
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello World!',
          },
        ],
      },
    ],
  },
  options: {
    // 独自のノードのマッピング
    nodeMapping: {
      paragraph({ children }) {
        return `<div class="custom-paragraph">${serializeChildrenToHTMLString(children)}</div>`
      },
    },
    // 独自のマークのマッピング
    markMapping: {
      bold({ children }) {
        return `<strong>${serializeChildrenToHTMLString(children)}</strong>`
      },
    },
    // 処理できないノードを扱う
    unhandledNode: ({ node }) => {
      return `[unknown node ${node.type.name}]`
    },
    // 処理できないマークを扱う
    unhandledMark: ({ mark }) => {
      return `[unknown node ${mark.type.name}]`
    },
  },
})
```

## 技術的な詳細

### 名前空間ごとのインポート

アプリケーションのバンドルサイズを抑えるため、静的レンダラーは `@tiptap/static-renderer/pm/html-string`、`@tiptap/static-renderer/pm/markdown`、`@tiptap/static-renderer/pm/react` の 3 つのパッケージに分かれています。必要な部分だけをインポートすれば済みます。柔軟性を最優先するなら、`@tiptap/static-renderer` で静的レンダラーのパッケージ全体をインポートすることもできます。

```ts
// HTML レンダラーだけ
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'

// Markdown レンダラーだけ
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'

// React レンダラーだけ
import { renderToReactElement } from '@tiptap/static-renderer/pm/react'

// 静的レンダラー全体
import { renderToHTMLString, renderToMarkdown, renderToReactElement } from '@tiptap/static-renderer'
```

`json` 名前空間のパッケージも用意されています。こちらは ProseMirror のパッケージに実行時に依存せずに静的レンダリングできます。ただし、ProseMirror のノードやマークを目的の形式に自動では対応づけられません。これらのパッケージでは、すべてのノードとマークについて独自のマッピングを用意する必要があります。

```ts
// HTML レンダラーだけ
import { renderJSONContentToString } from '@tiptap/static-renderer/json/html'

// React レンダラーだけ
import { renderJSONContentToReactElement } from '@tiptap/static-renderer/json/react'
```

これらのパッケージの API は `pm` 名前空間と同じですが、次の点が異なります。

- すべてのノードとマークについて、独自のマッピングを用意する必要がある
- ProseMirror のパッケージに依存しないため、`extensions` は不要

### 独自のマッピング

静的レンダラーには、ProseMirror のノードやマークを目的の形式に変換するデフォルトのマッピングがあります。オプションオブジェクトで独自のマッピングを渡せば、これを上書きできます。必要に合わせてレンダラーの出力をカスタマイズできるということです。

独自のノードやマークを目的の形式に変換するには、`node` または `mark` オブジェクトを引数に取り、目的の形式の要素を返すマッピング関数を用意します。処理できないノードやマークに出会ったときのために、それを引数にして呼ばれる関数を用意することもできます。

### 仕組み

`json` 名前空間の静的レンダラーのパッケージは、JSON コンテンツを走査し、各ノードとマークに対応するマッピング関数を呼びます。`renderJSONContentToString` 関数は JSON コンテンツを表す文字列を、`renderJSONContentToReactElement` 関数は JSON コンテンツを表す React 要素を返します。

`pm` 名前空間の静的レンダラーのパッケージは、`json` 名前空間のパッケージを拡張したものです。Tiptap 拡張機能の `renderHTML` メソッドを使い、ProseMirror のノード・マークから目的の形式へのデフォルトのマッピングを作ります。このマッピングは、オプションで独自のマッピングを渡せば完全に上書きできます。

## ソースコード

[packages/static-renderer/](https://github.com/ueberdosis/tiptap/blob/main/packages/static-renderer/)
