# setMeta コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/set-meta](https://tiptap.dev/docs/editor/api/commands/set-meta)

現在のトランザクションにメタデータのプロパティを保存します。

## パラメーター

`key: string`

メタデータの名前。値はいつでも [getMeta](https://prosemirror.net/docs/ref/#state.Transaction.getMeta) で取得できます。

`value: any`

メタデータに保存する値。どんな値でも保存できます。

## setMeta コマンドの使い方

```js
// update イベントが発生しないようにする
editor.commands.setMeta('preventUpdate', true)

// 現在のトランザクションに任意の値を保存する。
// この値はいつでも tr.getMeta('foo') で取得できる。
editor.commands.setMeta('foo', 'bar')
```
