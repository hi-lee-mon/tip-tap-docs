# HTML ユーティリティ

> 原文: [https://tiptap.dev/docs/editor/api/utilities/html](https://tiptap.dev/docs/editor/api/utilities/html)

HTML ユーティリティを使うと、エディタのインスタンスなしで JSON コンテンツを HTML としてレンダリングしたり、HTML から JSON を生成したりできます。サーバー側の処理に向いています。必要なのは、JSON または HTML 文字列と、拡張機能のリストだけです。

## JSON から HTML を生成する

ProseMirror のドキュメントを表す JSON オブジェクトを渡すと、`generateHTML` 関数はその JSON コンテンツを表す `string` を返します。引数は JSON オブジェクトと拡張機能のリストの 2 つです。

```js
/* ブラウザ専用 - サーバー側でも使えるパッケージは下を参照 */
import { generateHTML } from '@tiptap/core'

// JSON から HTML を生成する
generateHTML(
  {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'On the browser only' }] }],
  },
  [
    Document,
    Paragraph,
    Text,
    Bold,
    // ほかの拡張機能 …
  ],
)
// `<p>On the browser only</p>`

/* サーバーでもブラウザでも使える - ブラウザ専用のパッケージ（JS が少なく済む）は上を参照 */
import { generateHTML } from '@tiptap/html'

// JSON から HTML を生成する
generateHTML(
  {
    type: 'doc',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'On the server, or the browser' }] },
    ],
  },
  [
    Document,
    Paragraph,
    Text,
    Bold,
    // ほかの拡張機能 …
  ],
)
// `<p>On the server, or the browser</p>`
```

> [!WARNING]
> **注意**
>
> `generateHTML` は `@tiptap/core` と `@tiptap/html` の 2 か所からエクスポートされています。
> 前者はブラウザ専用で、後者はサーバーとブラウザのどちらでも使えます。用途に合ったほうを
> 使ってください。サーバーでは仮想 DOM を使って HTML を生成します。そのため、サーバー側の
> 機能が不要なら `@tiptap/core` を使うほうが配信するコードを減らせます。

[デモを開く](https://embed.tiptap.dev/preview/GuideContent/GenerateHTML)

## HTML から JSON を生成する

HTML 文字列を渡すと、`generateJSON` 関数はその HTML コンテンツを ProseMirror のドキュメントとして表す JSON オブジェクトを返します。引数は HTML 文字列と拡張機能のリストの 2 つです。

```js
/* ブラウザ専用 - サーバー側でも使えるパッケージは下を参照 */
import { generateJSON } from '@tiptap/core'

// HTML から JSON を生成する
generateJSON(`<p>On the browser only</p>`, [
  Document,
  Paragraph,
  Text,
  Bold,
  // ほかの拡張機能 …
])
// { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'On the browser only' }] }] }

/* サーバーでもブラウザでも使える - ブラウザ専用のパッケージ（JS が少なく済む）は上を参照 */
import { generateJSON } from '@tiptap/html'

// HTML から JSON を生成する
generateJSON(`<p>On the server, or the browser</p>`, [
  Document,
  Paragraph,
  Text,
  Bold,
  // ほかの拡張機能 …
])
// { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'On the server, or the browser' }] }] }
```

> [!WARNING]
> **注意**
>
> `generateJSON` は `@tiptap/core` と `@tiptap/html` の 2 か所からエクスポートされています。
> 前者はブラウザ専用で、後者はサーバーとブラウザのどちらでも使えます。用途に合ったほうを
> 使ってください。サーバーでは仮想 DOM を使って HTML を生成します。そのため、サーバー側の
> 機能が不要なら `@tiptap/core` を使うほうが配信するコードを減らせます。

[デモを開く](https://embed.tiptap.dev/preview/GuideContent/GenerateJSON)

## ソースコード

[packages/html/](https://github.com/ueberdosis/tiptap/blob/main/packages/html/)
