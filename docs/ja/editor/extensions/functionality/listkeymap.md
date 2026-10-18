# List Keymap extension

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/listkeymap](https://tiptap.dev/docs/editor/extensions/functionality/listkeymap)

The List Keymap extension modifies the default ProseMirror and Tiptap behavior. Without this extension, pressing backspace at the start of a list item keeps the list item content on the same line. With the List Keymap, the content is lifted into the list item above.

[デモを開く](https://embed.tiptap.dev/preview/Extensions/ListKeymap)

## Install

```bash
npm install @tiptap/extension-list
```

And import it in your editor:

```ts
import { Editor } from '@tiptap/core'
import { ListKeymap } from '@tiptap/extension-list'

new Editor({
  extensions: [ListKeymap],
})
```

This extension is installed by default with the `ListKit` extension, so you don’t need to install it separately.

```ts
import { Editor } from '@tiptap/core'
import { ListKit } from '@tiptap/extension-list'

new Editor({
  extensions: [ListKit],
})
```

## Settings

### listTypes

An array of list items and their parent wrapper node types.

```js
ListKeymap.configure({
  listTypes: [
    {
      itemName: 'taskItem',
      wrapperNames: ['customTaskList'],
    },
  ],
})
```

Default value:

```json
[
  {
    "itemName": "listItem",
    "wrapperNames": ["bulletList", "orderedList"]
  },
  {
    "itemName": "taskItem",
    "wrapperNames": ["taskList"]
  }
]
```

## Source code

[packages/extension-list/src/keymap/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/src/keymap/)

## Minimal Install

```js
import { Editor } from '@tiptap/core'
import { ListKeymap } from '@tiptap/extension-list/keymap'

new Editor({
  extensions: [ListKeymap],
})
```
