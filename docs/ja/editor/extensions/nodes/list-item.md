# ListItem 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/list-item](https://tiptap.dev/docs/editor/extensions/nodes/list-item)

ListItem 拡張機能は、`<li>` HTML タグを使えるようにします。箇条書きリストと番号付きリストで使うもので、それらなしで使う場面はほぼありません。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/ListItem)

> [!NOTE]
> **Backspace の挙動を変える**
>
> リストでの Backspace と Delete の標準の挙動を変えたい場合は、
> [ListKeymap](../functionality/listkeymap.md) 拡張機能を参照してください。

## インストール

```bash
npm install @tiptap/extension-list
```

この拡張機能には [`BulletList`](bullet-list.md) ノードまたは [`OrderedList`](ordered-list.md) ノードが必要です。

## 使い方

```js
import { Editor } from '@tiptap/core'
import { ListItem } from '@tiptap/extension-list'

new Editor({
  extensions: [ListItem],
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
ListItem.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
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

[packages/extension-list/src/item/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/src/item/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { ListItem } from '@tiptap/extension-list/item'

new Editor({
  extensions: [ListItem],
})
```
