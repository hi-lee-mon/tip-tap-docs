# setContent コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/content/set-content](https://tiptap.dev/docs/editor/api/commands/content/set-content)

`setContent` コマンドは、ドキュメントを新しいコンテンツに置き換えます。JSON と HTML のどちらも渡せます。初期化時に `content` を設定するのと基本的に同じです。

関連: [insertContent](insert-content.md)、[clearContent](clear-content.md)

## パラメーター

### content

新しいコンテンツ。プレーンテキストまたは HTML 文字列、[Tiptap JSON](../../../markdown/glossary.md#tiptap-json) オブジェクト、Tiptap JSON ノードの配列、Fragment、ProseMirror の Node のいずれかを渡します。エディタは、[スキーマ](../../../core-concepts/schema.md)で許可されたものだけをレンダリングします。

### options

次のプロパティを持つ、省略可能な設定オブジェクトです。

`parseOptions?: Record<string, any>`
パースを設定するオプション。parseOptions の詳細は [ProseMirror のドキュメント](https://prosemirror.net/docs/ref/#model.ParseOptions)を参照してください。

`errorOnInvalidContent?: boolean`
コンテンツが不正なときにエラーを投げるかどうか。

`emitUpdate?: boolean (true)`
update イベントを発行するかどうか。デフォルトは `true` です（注: v2 の `false` から変わりました）。

## 例

```js
// プレーンテキスト
editor.commands.setContent('Example Text')

// HTML
editor.commands.setContent('<p>Example Text</p>')

// JSON
editor.commands.setContent({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example Text',
        },
      ],
    },
  ],
})

// オプション付き
editor.commands.setContent('<p>Example Text</p>', {
  emitUpdate: false,
  parseOptions: {
    preserveWhitespace: 'full',
  },
  errorOnInvalidContent: true,
})
```
