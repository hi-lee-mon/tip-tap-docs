# ListKit 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/list-kit](https://tiptap.dev/docs/editor/extensions/functionality/list-kit)

`ListKit` は、リストに必要な Tiptap の拡張機能をひとまとめにしたものです。Tiptap ですぐにリストを使えるようにしたいときに向いています。

## インストール

```bash
npm install @tiptap/extension-list
```

## 含まれる拡張機能

### ノード

- [`BulletList`](../nodes/bullet-list.md)
- [`ListItem`](../nodes/list-item.md)
- [`OrderedList`](../nodes/ordered-list.md)
- [`TaskItem`](../nodes/task-item.md)
- [`TaskList`](../nodes/task-list.md)

### 拡張機能

- [`ListKeymap`](listkeymap.md)

## ソースコード

[packages/extension-list/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/)

## ListKit 拡張機能を使う

`ListKit` をエディタに渡すと、含まれる拡張機能をまとめて読み込めます。

```js
import { Editor } from '@tiptap/core'
import { ListKit } from '@tiptap/extension-list'

const editor = new Editor({
  extensions: [ListKit],
})
```

次のように、含まれる拡張機能を個別に設定したり、一部を無効にしたりもできます。

```js
import { Editor } from '@tiptap/core'
import { ListKit } from '@tiptap/extension-list'

const editor = new Editor({
  extensions: [
    ListKit.configure({
      // 拡張機能を無効にする
      bulletList: false,

      // 拡張機能を設定する
      listItem: {
        HTMLAttributes: { class: 'list-item' },
      },
    }),
  ],
})
```
