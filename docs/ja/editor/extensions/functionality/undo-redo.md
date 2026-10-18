# Undo/Redo 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/undo-redo](https://tiptap.dev/docs/editor/extensions/functionality/undo-redo)

この拡張機能は、元に戻す・やり直すの操作を提供します。ドキュメントへの変更はすべて記録され、`undo` で取り消せます。取り消した変更は、`redo` で再び適用できます。

この拡張機能を組み込むのは、エディタを共同編集に対応させる予定がない場合だけにしてください。ほかの人の変更まで元に戻したい人は普通いないので、Collaboration 拡張機能は独自の元に戻す・やり直すの仕組みを持っています。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/UndoRedo)

## インストール

```bash
npm install @tiptap/extensions
```

## 使い方

```js
import { Editor } from '@tiptap/core'
import { UndoRedo } from '@tiptap/extensions'

new Editor({
  extensions: [UndoRedo],
})
```

## 設定

### depth

履歴のイベントをいくつまでためるかです。この数を超えると、古いイベントから捨てられます。

デフォルト: `100`

```js
UndoRedo.configure({
  depth: 10,
})
```

### newGroupDelay

変更と変更の間がこの時間（ミリ秒）より空くと、新しいグループを始めます。変更が隣り合っていない場合は、常に新しいグループを始めます。

デフォルト: `500`

```js
UndoRedo.configure({
  newGroupDelay: 1000,
})
```

## コマンド

### undo()

直前の変更を元に戻します。

```js
editor.commands.undo()
```

### redo()

直前の変更をやり直します。

```js
editor.commands.redo()
```

## キーボードショートカット

| コマンド | Windows/Linux | macOS |
| --- | --- | --- |
| undo() | <kbd>Control</kbd> + <kbd>Z</kbd> または <kbd>Control</kbd> + <kbd>я</kbd> | <kbd>Cmd</kbd> + <kbd>Z</kbd> + または <kbd>Cmd</kbd> + <kbd>я</kbd> |
| redo() | <kbd>Shift</kbd> + <kbd>Control</kbd> + <kbd>Z</kbd> または <kbd>Control</kbd> + <kbd>Y</kbd> または <kbd>Shift</kbd> + <kbd>Control</kbd> + <kbd>я</kbd> | <kbd>Shift</kbd> + <kbd>Cmd</kbd> + <kbd>Z</kbd> または <kbd>Cmd</kbd> + <kbd>Y</kbd> または <kbd>Shift</kbd> + <kbd>Cmd</kbd> + <kbd>я</kbd> |

## ソースコード

[packages/extensions/src/undo-redo/](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/undo-redo/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { UndoRedo } from '@tiptap/extensions/undo-redo'

new Editor({
  extensions: [UndoRedo],
})
```
