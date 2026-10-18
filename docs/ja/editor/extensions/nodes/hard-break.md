# HardBreak 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/hard-break](https://tiptap.dev/docs/editor/extensions/nodes/hard-break)

HardBreak 拡張機能は、強制的に改行する `<br>` HTML タグを使えるようにします。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/HardBreak)

## インストール

```bash
npm install @tiptap/extension-hard-break
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
HardBreak.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### keepMarks

改行のあとにマークを残すかどうかを決めます。マークの `keepOnSplit` オプションに基づきます。

デフォルト: `true`

```js
HardBreak.configure({
  keepMarks: false,
})
```

## コマンド

### setHardBreak()

改行を追加します。

```js
editor.commands.setHardBreak()
```

## キーボードショートカット

| コマンド     | Windows/Linux                                                               | macOS                                                                   |
| ------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| setHardBreak | <kbd>Shift</kbd> + <kbd>Enter</kbd> + <kbd>Control</kbd> + <kbd>Enter</kbd> | <kbd>Shift</kbd> + <kbd>Enter</kbd> + <kbd>Cmd</kbd> + <kbd>Enter</kbd> |

## ソースコード

[packages/extension-hard-break/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-hard-break/)
