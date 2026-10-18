# keyboardShortcut command

> 原文: [https://tiptap.dev/docs/editor/api/commands/selection/keyboard-shortcut](https://tiptap.dev/docs/editor/api/commands/selection/keyboard-shortcut)

The `keyboardShortcut` command will try to trigger a ShortcutEvent with a given name.

## Parameters

`name: String`

The name of the shortcut to trigger.

## Use the keyboardShortcut command

```js
editor.commands.keyboardShortcut('undo')
```
