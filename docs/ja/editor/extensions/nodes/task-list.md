# TaskList 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/task-list](https://tiptap.dev/docs/editor/extensions/nodes/task-list)

エディタでタスクリストを使えるようにする拡張機能です。`<ul data-type="taskList">` としてレンダリングされます。フレームワークは不要で、Vanilla JavaScript だけで実装されています。

新しい行の先頭で `[ ] ` または `[x] ` と入力すると、魔法のようにタスクリストに変わります。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/TaskList)

## インストール

```bash
npm install @tiptap/extension-list
```

この拡張機能には [`TaskItem`](task-item.md) 拡張機能が必要です。

## 使い方

```js
import { Editor } from '@tiptap/core'
import { TaskList } from '@tiptap/extension-list'

new Editor({
  extensions: [TaskList],
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
TaskList.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### itemTypeName

リスト項目の名前を指定します。

デフォルト: `'taskItem'`

```js
TaskList.configure({
  itemTypeName: 'taskItem',
})
```

## コマンド

# toggleTaskList()

タスクリストを切り替えます。

```js
editor.commands.toggleTaskList()
```

## キーボードショートカット

| コマンド         | Windows/Linux                                        | macOS                                            |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------ |
| toggleTaskList() | <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>9</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>9</kbd> |

## ソースコード

[packages/extension-list/src/task-list/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/src/task-list/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { TaskList } from '@tiptap/extension-list/task-list'

new Editor({
  extensions: [TaskList],
})
```
