# TaskItem 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/task-item](https://tiptap.dev/docs/editor/extensions/nodes/task-item)

タスクリストの項目要素をレンダリングする拡張機能です。この要素は、`data-type` 属性を `taskItem` にした `<li>` タグです。リスト要素の中にはチェックボックスもレンダリングされ、`checked` 属性を更新します。

この拡張機能は JavaScript フレームワークを必要とせず、Vanilla JavaScript だけで動きます。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/TaskItem)

## インストール

```bash
npm install @tiptap/extension-list
```

この拡張機能には [`TaskList`](task-list.md) ノードが必要です。

## 使い方

```js
import { Editor } from '@tiptap/core'
import { TaskItem } from '@tiptap/extension-list'

new Editor({
  extensions: [TaskItem],
})
```

この拡張機能は `ListKit` 拡張機能に標準で含まれているため、個別にインストールする必要はありません。

```ts
import { Editor } from '@tiptap/core'
import { ListKit } from '@tiptap/extension-list'

new Editor({
  extensions: [ListKit],
})
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
TaskItem.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### nested

タスク項目どうしの入れ子を許可するかどうか。

```js
TaskItem.configure({
  nested: true,
})
```

### onReadOnlyChecked

エディタが `readOnly` のときに、タスク項目のチェックが付けられた、または外されたときのハンドラーです。
指定しない場合、エディタが `readOnly` の間はタスク項目を変更できません。
この関数が false を返すと、チェックの状態は保たれます（`readOnly`）。

```js
TaskItem.configure({
  onReadOnlyChecked: (node, checked) => {
    // 何か処理をする
  },
})
```

### taskListTypeName

このタスク項目が属するタスクリストの型名です。親のタスクリストの型を判断するのに使います。

```js
TaskItem.configure({
  taskListTypeName: 'taskList',
})
```

### a11y

タスク項目のアクセシビリティ（a11y）に関する設定です。次のオプションがあります。

- **`checkboxLabel`**: タスク項目のチェック状態に応じて、チェックボックスの aria-label を返す関数。スクリーンリーダーがチェックボックスの状態を読み上げるのに役立ちます。
  - **パラメーター**:
    - `node`: タスク項目のノード。
    - `checked`: タスク項目にチェックが付いているかどうかを表す真偽値。
  - **戻り値**: チェックボックスの `aria-label` に使う文字列。

```js
TaskItem.configure({
  a11y: {
    // チェックボックスの aria-label
    checkboxLabel: (node, checked) => {
      return checked ? 'Task completed' : 'Task not completed'
    },
  },
})
```

## キーボードショートカット

| コマンド        | Windows/Linux                     | macOS                             |
| --------------- | --------------------------------- | --------------------------------- |
| splitListItem() | <kbd>Enter</kbd>                  | <kbd>Enter</kbd>                  |
| sinkListItem()  | <kbd>Tab</kbd>                    | <kbd>Tab</kbd>                    |
| liftListItem()  | <kbd>Shift</kbd> + <kbd>Tab</kbd> | <kbd>Shift</kbd> + <kbd>Tab</kbd> |

## ソースコード

[packages/extension-list/src/task-item/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/src/task-item/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { TaskItem } from '@tiptap/extension-list/task-item'

new Editor({
  extensions: [TaskItem],
})
```
