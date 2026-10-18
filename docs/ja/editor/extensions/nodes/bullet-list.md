# BulletList 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/bullet-list](https://tiptap.dev/docs/editor/extensions/nodes/bullet-list)

エディタで箇条書きリストを使えるようにする拡張機能です。`<ul>` HTML タグとしてレンダリングされます。新しい行の先頭で `* `、`- `、`+ ` のいずれかを入力すると、魔法のように箇条書きリストに変わります。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/BulletList)

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
import { BulletList } from '@tiptap/extension-list'

new Editor({
  extensions: [BulletList],
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
BulletList.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### itemTypeName

リスト項目の名前を指定します。

デフォルト: `'listItem'`

```js
BulletList.configure({
  itemTypeName: 'listItem',
})
```

### keepMarks

`inputRule` またはボタンでリストを切り替えたあと、前の行のマークを残すかどうかを決めます

デフォルト: `false`

```js
BulletList.configure({
  keepMarks: true,
})
```

### keepAttributes

`inputRule` またはボタンでリストを切り替えたあと、前の行の属性を残すかどうかを決めます

デフォルト: `false`

```js
BulletList.configure({
  keepAttributes: true,
})
```

## コマンド

### toggleBulletList()

箇条書きリストを切り替えます。

```js
editor.commands.toggleBulletList()
```

## キーボードショートカット

| コマンド         | Windows/Linux                                        | macOS                                            |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------ |
| toggleBulletList | <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>8</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>8</kbd> |

## ソースコード

[packages/extension-list/src/bullet-list/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/src/bullet-list/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { BulletList } from '@tiptap/extension-list/bullet-list'

new Editor({
  extensions: [BulletList],
})
```
