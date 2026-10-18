# Tiptap のイベント

> 原文: [https://tiptap.dev/docs/editor/api/events](https://tiptap.dev/docs/editor/api/events)

エディタはいくつかのイベントを発火し、それぞれに処理を差し込めます。まずは、使えるイベントを一通り見てみましょう。

## イベント一覧

| イベント名        | 説明                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `beforeCreate`    | エディタのビューが作られる前。                                                                            |
| `create`          | エディタの初期化が完了し、使える状態になったとき。                                                               |
| `update`          | コンテンツが変更されたとき。                                                                        |
| `selectionUpdate` | エディタ内の選択範囲が変わったとき。                                                                 |
| `transaction`     | 何らかの操作でエディタの状態が変わったとき。                                                           |
| `focus`           | エディタがフォーカスを得たとき。                                                                                  |
| `blur`            | エディタがフォーカスを失ったとき。                                                                             |
| `destroy`         | エディタのインスタンスが破棄されるとき。                                                                  |
| `paste`           | エディタにコンテンツが貼り付けられたとき。                                                                       |
| `drop`            | エディタにコンテンツがドロップされたとき。                                                                      |
| `delete`          | エディタからコンテンツが削除されたとき。                                                                      |
| `contentError`    | コンテンツがスキーマに合わないとき。[詳しくはこちら](../core-concepts/schema.md#invalid-schema-handling) |

## イベントリスナーを登録する

イベントリスナーの登録方法は 3 つあります。

### 方法 1: 設定で指定する

新しいエディタのインスタンスを作るときに、その場でイベントリスナーを定義できます。

```js
const editor = new Editor({
  onBeforeCreate({ editor }) {
    // ビューが作られる前
  },
  onCreate({ editor }) {
    // エディタの準備ができた
  },
  onUpdate({ editor }) {
    // コンテンツが変更された
  },
  onSelectionUpdate({ editor }) {
    // 選択範囲が変わった
  },
  onTransaction({ editor, transaction }) {
    // エディタの状態が変わった
  },
  onFocus({ editor, event }) {
    // エディタがフォーカスされた
  },
  onBlur({ editor, event }) {
    // エディタからフォーカスが外れた
  },
  onDestroy() {
    // エディタが破棄されようとしている
  },
  onPaste(event: ClipboardEvent, slice: Slice) {
    // エディタに貼り付けが行われている
  },
  onDrop(event: DragEvent, slice: Slice, moved: boolean) {
    // エディタに貼り付けが行われている
  },
  onDelete({ type, deletedRange, newRange, partial, node, mark, from, to, newFrom, newTo }) {
    // エディタからコンテンツ（ノードまたはマーク）が削除された
  },
  onContentError({ editor, error, disableCollaboration }) {
    // エディタのコンテンツがスキーマに合わない
  },
})
```

### 方法 2: バインドする

動作中のエディタのインスタンスにイベントリスナーを登録することもできます。

#### イベントリスナーをバインドする

```js
editor.on('beforeCreate', ({ editor }) => {
  // ビューが作られる前
})

editor.on('create', ({ editor }) => {
  // エディタの準備ができた
})

editor.on('update', ({ editor }) => {
  // コンテンツが変更された
})

editor.on('selectionUpdate', ({ editor }) => {
  // 選択範囲が変わった
})

editor.on('transaction', ({ editor, transaction }) => {
  // エディタの状態が変わった
})

editor.on('focus', ({ editor, event }) => {
  // エディタがフォーカスされた
})

editor.on('blur', ({ editor, event }) => {
  // エディタからフォーカスが外れた
})

editor.on('destroy', () => {
  // エディタが破棄されようとしている
})

editor.on('paste', ({ event, slice, editor }) => {
  // エディタに貼り付けが行われている
})

editor.on('drop', ({ editor, event, slice, moved }) => {
  // エディタが破棄されようとしている
})

editor.on('delete', ({ type, deletedRange, newRange, partial, node, mark }) => {
  // エディタからコンテンツ（ノードまたはマーク）が削除された
})

editor.on('contentError', ({ editor, error, disableCollaboration }) => {
  // エディタのコンテンツがスキーマに合わない
})
```

（訳注: `onDrop` と `drop` のコメントは原文のままで、内容はドロップ時のイベントです。）

#### イベントリスナーのバインドを解除する

あとでバインドを解除する必要があるなら、`.on()` で登録し、`.off()` で解除してください。

```js
const onUpdate = () => {
  // コンテンツが変更された
}

// バインドして…
editor.on('update', onUpdate)

// …解除する
editor.off('update', onUpdate)
```

### 方法 3: 拡張機能に書く

イベントリスナーは、独自の拡張機能（またはノード、マーク）に移すこともできます。次のように書きます。

```js
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  onBeforeCreate({ editor }) {
    // ビューが作られる前
  },
  onCreate({ editor }) {
    // エディタの準備ができた
  },
  onUpdate({ editor }) {
    // コンテンツが変更された
  },
  onSelectionUpdate({ editor }) {
    // 選択範囲が変わった
  },
  onTransaction({ editor, transaction }) {
    // エディタの状態が変わった
  },
  onFocus({ editor, event }) {
    // エディタがフォーカスされた
  },
  onBlur({ editor, event }) {
    // エディタからフォーカスが外れた
  },
  onDestroy() {
    // エディタが破棄されようとしている
  },
  onPaste(event: ClipboardEvent, slice: Slice) {
    // エディタに貼り付けが行われている
  },
  onDrop(event: DragEvent, slice: Slice, moved: boolean) {
    // エディタに貼り付けが行われている
  },
  onDelete({ type, deletedRange, newRange, partial, node, mark }) {
    // エディタからコンテンツ（ノードまたはマーク）が削除された
  },
  onContentError({ editor, error, disableCollaboration }) {
    // エディタのコンテンツがスキーマに合わない
  },
})
```
