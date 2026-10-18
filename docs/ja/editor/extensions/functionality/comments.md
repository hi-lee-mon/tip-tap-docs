# エディタにコメントを組み込む

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/comments](https://tiptap.dev/docs/editor/extensions/functionality/comments)

Tiptap Comments 拡張機能を使うと、エディタにコメントを組み込んで管理できます。スレッドやコメントは、エディタからも REST API からも作成できます。

> [!TIP]
> **詳細**
>
> Tiptap Comments 拡張機能の組み込み方、インストール、設定の詳細は、[機能のページ](https://tiptap.dev/docs/comments/getting-started/overview)を参照してください。

[デモを開く](https://embed-pro.tiptap.dev/preview/Extensions/Comments)

インラインコードやコードブロックにコメントを付けるには、[コードへのコメントのガイド](https://tiptap.dev/docs/comments/integrate/code)に従い、コード系の拡張機能のスキーマでコメントのアンカーを許可してください。

## イベント

Comments 拡張機能が発行するイベントは、`editor.on()` で受け取れます。独自の UI を作る、状態を同期する、[Tracked Changes](tracked-changes.md) などのほかの拡張機能と連携する、といった用途に便利です。

### スレッドのイベント

#### comments:threadCreated

コメントのスレッドが新しく作成されたときに発行されます。

```js
editor.on('comments:threadCreated', ({ threadId, thread, initialComment, position, threadType }) => {
  // threadType: 'block' | 'inline'
  console.log(`Thread ${threadId} created at ${position.from}-${position.to}`)
})
```

#### comments:threadUpdated

スレッドのデータやメタデータが変わったときに発行されます。

```js
editor.on('comments:threadUpdated', ({ threadId, thread, changes, updatedBy }) => {
  console.log(`Thread ${threadId} updated by ${updatedBy}`)
})
```

#### comments:threadResolved

スレッドが解決済みになったときに発行されます。

```js
editor.on('comments:threadResolved', ({ threadId, thread, resolvedBy, resolvedAt }) => {
  console.log(`Thread ${threadId} resolved by ${resolvedBy} at ${resolvedAt}`)
})
```

#### comments:threadUnresolved

解決済みだったスレッドが再び開かれたときに発行されます。

```js
editor.on('comments:threadUnresolved', ({ threadId, thread, unresolvedBy }) => {
  console.log(`Thread ${threadId} reopened by ${unresolvedBy}`)
})
```

#### comments:threadDeleted

スレッドが削除されたときに発行されます。

```js
editor.on('comments:threadDeleted', ({ threadId, thread, deletedBy, soft }) => {
  // soft: ソフト削除（アーカイブ）か、完全な削除か
  console.log(`Thread ${threadId} deleted by ${deletedBy}`)
})
```

#### comments:threadRemovedFromDocument

スレッドのマークがドキュメントから取り除かれたときに発行されます（コメントを付けたテキストが削除された、スレッドがアーカイブされた、など）。

```js
editor.on('comments:threadRemovedFromDocument', ({ threadId, thread, removedBy, canRestore }) => {
  // removedBy: 'edit' | 'command'
  console.log(`Thread ${threadId} removed from document`)
})
```

### コメントのイベント

#### comments:commentCreated

スレッドに新しいコメントが追加されたときに発行されます。

```js
editor.on('comments:commentCreated', ({ threadId, commentId, comment, thread }) => {
  console.log(`Comment ${commentId} added to thread ${threadId}`)
})
```

#### comments:commentUpdated

コメントの内容が編集されたときに発行されます。

```js
editor.on('comments:commentUpdated', ({ threadId, commentId, comment, oldContent, newContent }) => {
  console.log(`Comment ${commentId} updated`)
})
```

#### comments:commentDeleted

スレッドからコメントが削除されたときに発行されます。

```js
editor.on('comments:commentDeleted', ({ threadId, commentId, comment, deletedBy }) => {
  console.log(`Comment ${commentId} deleted by ${deletedBy}`)
})
```

### 選択とホバーのイベント

#### comments:threadSelected

スレッドが選択されたときに発行されます（ユーザーがコメントの注釈をクリックした場合など）。

```js
editor.on('comments:threadSelected', ({ threadId, thread }) => {
  // サイドバーにスレッドの詳細を表示する
  console.log(`Thread ${threadId} selected`)
})
```

#### comments:threadUnselected

スレッドの選択が解除されたときに発行されます。

```js
editor.on('comments:threadUnselected', ({ threadId }) => {
  console.log('Thread deselected')
})
```

#### comments:threadHovered

ユーザーがドキュメント内のスレッドの注釈にマウスを重ねたときに発行されます。

```js
editor.on('comments:threadHovered', ({ threadIds, threads }) => {
  console.log(`Hovering over threads: ${threadIds.join(', ')}`)
})
```

#### comments:threadUnhovered

ユーザーがスレッドの注釈からマウスを離したときに発行されます。

```js
editor.on('comments:threadUnhovered', ({ threadIds }) => {
  console.log('Threads unhovered')
})
```
