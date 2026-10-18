# OrderedList 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/ordered-list](https://tiptap.dev/docs/editor/extensions/nodes/ordered-list)

エディタで番号付きリストを使えるようにする拡張機能です。`<ol>` HTML タグとしてレンダリングされます。

新しい行の先頭で `1. `（またはほかの数字とドット）を入力すると、魔法のように番号付きリストに変わります。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/OrderedList)

> [!NOTE]
> **Backspace の挙動を変える**
>
> リストでの Backspace と Delete の標準の挙動を変えたい場合は、
> [ListKeymap](../functionality/listkeymap.md) 拡張機能を参照してください。

## インストール

```bash
npm install @tiptap/extension-list
```

この拡張機能には [`ListItem`](list-item.md) ノードが必要です。

## 使い方

```js
import { Editor } from '@tiptap/core'
import { OrderedList } from '@tiptap/extension-list'

new Editor({
  extensions: [OrderedList],
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
OrderedList.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### itemTypeName

リスト項目の名前を指定します。

デフォルト: `'listItem'`

```js
OrderedList.configure({
  itemTypeName: 'listItem',
})
```

### keepMarks

`inputRule` またはボタンでリストを切り替えたあと、前の行のマークを残すかどうかを決めます

デフォルト: `false`

```js
OrderedList.configure({
  keepMarks: true,
})
```

### keepAttributes

`inputRule` またはボタンでリストを切り替えたあと、前の行の属性を残すかどうかを決めます

デフォルト: `false`

```js
OrderedList.configure({
  keepAttributes: true,
})
```

## コマンド

### toggleOrderedList()

番号付きリストを切り替えます。

```js
editor.commands.toggleOrderedList()
```

## キーボードショートカット

| コマンド          | Windows/Linux                                        | macOS                                            |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------ |
| toggleOrderedList | <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>7</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>7</kbd> |

## ソースコード

[packages/extension-list/src/ordered-list/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/src/ordered-list/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { OrderedList } from '@tiptap/extension-list/ordered-list'

new Editor({
  extensions: [OrderedList],
})
```
