# clearContent コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/content/clear-content](https://tiptap.dev/docs/editor/api/commands/content/clear-content)

`clearContent` コマンドは、現在のドキュメントを削除します。ただし、スキーマを満たすのに必要なコンテンツはエディタに残ります。たとえば StarterKit をデフォルトの設定で使っている場合は、空の段落が 1 つ残ります。

関連: [setContent](set-content.md)、[insertContent](insert-content.md)

## パラメーター

`emitUpdate?: boolean (true)`
update イベントを発行するかどうか。デフォルトは `true` です（注: v2 の `false` から変わりました）。

## 例

```js
// コンテンツを消去する（デフォルトで update イベントを発行する）
editor.commands.clearContent()

// update イベントを発行せずにコンテンツを消去する
editor.commands.clearContent(false)
```
