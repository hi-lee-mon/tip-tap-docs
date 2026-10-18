# insertDefaultBlock コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/insert-default-block](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/insert-default-block)

`insertDefaultBlock` コマンドは、スキーマのデフォルトのコンテンツブロック型を指定した位置に挿入します。ブロック型は `defaultBlockAt()` で自動的に決まります。つまり、挿入位置に何が合うかはスキーマが判断します。

ノード型をハードコードせずに、文脈に合った空のブロックを挿入したいときに便利です。たとえば、ドキュメントやブロック引用の中に段落を挿入する場合です。

その位置に有効なデフォルトのブロックを挿入できない場合（たとえば位置がテキストブロックの中にある場合）、コマンドは `false` を返します。挿入位置を黙って調整することはありません。

## パラメーター

`options: InsertDefaultBlockOptions`

- `pos: number | ResolvedPos` – ブロックを挿入する位置。数値のオフセットか、解決済みの ProseMirror の位置を受け付けます。デフォルトは現在のキャレット位置です。
- `attrs: Record<string, any>` – 挿入するノードに適用する属性。ノード型の `spec.attrs` で定義されたキーだけが残り、未知の属性は除外されます。
- `content: Content | ProseMirrorNode | Fragment` – ブロックに入れるコンテンツ。プレーンテキスト、HTML 文字列、ProseMirror のノードやフラグメントを受け付けます。
- `updateSelection: boolean` – 挿入したブロックへ選択範囲を移すかどうか。デフォルトは `true` です。

## insertDefaultBlock コマンドの使い方

```js
// 現在の選択範囲の位置に挿入する
editor.commands.insertDefaultBlock()

// 特定の位置に挿入する
editor.commands.insertDefaultBlock({ pos: 0 })

// テキストのコンテンツ付きで挿入する
editor.commands.insertDefaultBlock({ pos: 0, content: 'Hello' })

// HTML のコンテンツ付きで挿入する
editor.commands.insertDefaultBlock({ pos: 0, content: '<strong>bold</strong>' })

// 見出しを挿入する（その位置のデフォルトのブロックが見出しの場合）
editor.commands.insertDefaultBlock({ pos: 0, attrs: { level: 2 }, content: 'Title' })

// 選択範囲を更新せずに挿入する
editor.commands.insertDefaultBlock({ pos: 0, content: 'Hello', updateSelection: false })
```
