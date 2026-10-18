# UniqueID 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/uniqueid](https://tiptap.dev/docs/editor/extensions/functionality/uniqueid)

`UniqueID` 拡張機能は、設定したノードの型に一意の ID を付けます。
ノードを分割しても、結合しても、元に戻す・やり直すをしても、コンテンツを切り取っても貼り付けても、この拡張機能はノードを追跡し続けます。特別なことをしなくても、そのまま動きます。
一意の ID を付けるノードの型と付けない型を設定でき、ID の作り方もカスタマイズできます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/UniqueID)

## インストール

```bash
npm install @tiptap/extension-unique-id
```

## 設定

### attributeName

HTML タグに付ける属性の名前です（先頭に `data-` が付きます）。

デフォルト: `'id'`

```js
UniqueID.configure({
  attributeName: 'uid',
})
```

### types

一意の ID を付けるノードの型の一覧です。たとえば `['heading', 'paragraph']` のように指定します。
`'all'` を渡すと、`doc` と `text` を除く、ドキュメント内のすべてのノードの型に ID を付けます。

デフォルト: `[]`

```js
UniqueID.configure({
  types: ['heading', 'paragraph'],
})
```

```js
UniqueID.configure({
  types: 'all',
})
```

### generateID

一意の ID を作って返す関数です。コンテキストのオブジェクト（たとえば `{ node, pos }`）を受け取るので、ノードの型や位置に応じて ID の作り方を変えられます。

デフォルト: `({ node, pos }) => uuidv4()`

```js
UniqueID.configure({
  generateID: ({ node }) => `${node.type.name}-${uuidv4()}`,
})
```

### filterTransaction

一部の変更を無視します。たとえば、共同編集のプラグインを通じてほかのユーザーが適用した変更などです。

デフォルト: `null`

```js
import { isChangeOrigin } from '@tiptap/extension-collaboration'

// 共同編集に対応させる
UniqueID.configure({
  filterTransaction: (transaction) => !isChangeOrigin(transaction),
})
```

### updateDocument

ノードに一意の ID を付けて、ドキュメントを更新するかどうかです。ドキュメントが `readonly` モードのとき、変更できないとき、変更されたくないときは `false` にしてください。

デフォルト: `true`

```js
UniqueID.configure({
  updateDocument: false,
})
```

## Collaboration と組み合わせる

> [!WARNING]
> **重要**
>
> UniqueID 拡張機能を [Collaboration 拡張機能](collaboration.md)と一緒に使う場合は、共同編集のプロバイダーの同期が終わった**あと**でエディタをマウントしてください。同期していない `Y.Doc` にエディタをマウントすると、意図しないドキュメントの状態（消えない空の段落など）になることがあり、UniqueID 拡張機能はその状態をそのまま保持してしまいます。

### 誤った設定

この例では、プロバイダーの同期が終わる前に、Collaboration 拡張機能を使ったエディタをすぐにマウントしています。そのため、エディタが空の `Y.Doc` を相手に初期化され、意図しないドキュメントの変更が起きます。

```tsx
import Collaboration from '@tiptap/extension-collaboration'
import { isChangeOrigin } from '@tiptap/extension-collaboration'
import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapCollabProvider } from '@tiptap-pro/provider'
import { useEffect } from 'react'
import * as Y from 'yjs'

const doc = new Y.Doc()

export default () => {
  // ❌ プロバイダーの同期が終わる前にエディタをマウントしている
  const editor = useEditor({
    extensions: [
      // ...ほかの拡張機能
      UniqueID.configure({
        types: ['paragraph', 'heading'],
        filterTransaction: (transaction) => !isChangeOrigin(transaction),
      }),
      Collaboration.configure({
        document: doc,
      }),
    ],
    content: '<p>Initial content</p>', // 同期のたびにこれが重複する
  })

  useEffect(() => {
    // エディタがマウントされたあとで、プロバイダーが接続・同期する
    const provider = new TiptapCollabProvider({
      name: 'your-document-name',
      appId: 'YOUR_APP_ID',
      token: 'YOUR_JWT',
      document: doc,
    })
  }, [])

  return <EditorContent editor={editor} />
}
```

### 正しい設定

この問題を避けるには、次の順序で初期化します。

1. `Y.Doc` を初期化する
2. 共同編集のプロバイダーを開始する
3. `synced` イベントを待つ
4. 共同編集のドキュメントが空かどうかを確認する
5. 正しいコンテンツでエディタをマウントする

```tsx
import Collaboration from '@tiptap/extension-collaboration'
import { isChangeOrigin } from '@tiptap/extension-collaboration'
import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapCollabProvider } from '@tiptap-pro/provider'
import { useEffect } from 'react'
import * as Y from 'yjs'

const doc = new Y.Doc()

export default () => {
  const editor = useEditor({
    extensions: [
      // ...ほかの拡張機能
      UniqueID.configure({
        types: ['paragraph', 'heading'],
        filterTransaction: (transaction) => !isChangeOrigin(transaction),
      }),
      Collaboration.configure({
        document: doc,
      }),
    ],
    // ここではコンテンツを設定しない。同期を待つ
  })

  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: 'your-document-name',
      appId: 'YOUR_APP_ID',
      token: 'YOUR_JWT',
      document: doc,

      onSynced() {
        // 共同編集のドキュメントが空のときだけ、最初のコンテンツを入れる
        const isEmpty = doc.getXmlFragment('default').length === 0

        if (isEmpty && editor) {
          editor.commands.setContent(yourInitialContent)
        }
      },
    })
  }, [])

  return <EditorContent editor={editor} />
}
```

### 押さえておく点

- **同期の前にエディタのコンテンツを初期化しない。** 共同編集を使うときは、エディタのデフォルトの状態に頼らないでください。
- **`filterTransaction` を使って**、共同編集からの変更を無視する。[filterTransaction の設定](#filtertransaction)を参照してください。
- **開発中は、壊れたドキュメントの名前を使い回さない。** おかしな状態がすでに保存されてしまった場合は、新しいドキュメント名を使って一からやり直してください。

共同編集のセットアップの完全なガイドは、[Collaboration のインストール](https://tiptap.dev/docs/collaboration/getting-started/install)のドキュメントを参照してください。

## サーバー側で一意の ID を付けるユーティリティ

`generateUniqueIds` 関数を使うと、`Editor` のインスタンスを作らずに、サーバー側で Tiptap のドキュメントに一意の ID を付けられます。サーバー側でドキュメントを処理する場合や、既存のコンテンツに ID を付けたい場合に便利です。

### 引数

- **`doc`**（`JSONContent`）: 一意の ID を付ける Tiptap の JSON ドキュメント
- **`extensions`**（`Extensions`）: 使う拡張機能。`UniqueID` 拡張機能を必ず含めてください。ID の作り方を変えるには、`UniqueID` 拡張機能にオプションを渡します。

### 戻り値

ノードに一意の ID を付けた、新しい Tiptap のドキュメント（`JSONContent` オブジェクト）を返します。

### 例

```js
import { generateUniqueIds, UniqueID } from '@tiptap/extension-unique-id'
import { StarterKit } from '@tiptap/starter-kit'

const doc = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'Hello, world!' }] },
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'My Heading' }] },
  ],
}

const newDoc = generateUniqueIds(doc, [
  StarterKit,
  UniqueID.configure({ types: ['paragraph', 'heading'] }),
])

// 結果:
// {
//   type: 'doc',
//   content: [
//     { type: 'paragraph', content: [{ type: 'text', text: 'Hello, world!' }], attrs: { id: 'd4590f81-52e8-45ec-b317-2e9a805b03e3' } },
//     { type: 'heading', content: [{ type: 'text', text: 'My Heading' }], attrs: { level: 1, id: 'c88f9b5f-7b91-442f-b4d9-ee0d04104827' } }
//   ]
// }
```

この関数は、`types`、`attributeName`、`generateID` などのオプションを含め、`UniqueID` 拡張機能の設定を自動的に読み取ります。
