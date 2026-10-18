# Focus 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/focus](https://tiptap.dev/docs/editor/extensions/functionality/focus)

Focus 拡張機能は、フォーカスのあるノードに CSS クラスを付けます。デフォルトでは `.has-focus` を付けますが、変更もできます。

付けるのはクラスだけなので、スタイルは自由に決めてください。下の使用例には、このクラス用の CSS も含まれています。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Focus)

## インストール

```bash
npm install @tiptap/extensions
```

続けて、エディタにインポートします。

```ts
import { Editor } from '@tiptap/core'
import { Focus } from '@tiptap/extensions'

new Editor({
  extensions: [Focus],
})
```

## 設定

### className

フォーカスのある要素に付けるクラスです。

デフォルト: `'has-focus'`

```js
Focus.configure({
  className: 'focus',
})
```

### mode

クラスを付ける対象を、すべてのノード（`'all'`）、最も浅いノード（`'shallowest'`）、最も深いノード（`'deepest'`）から選びます。

デフォルト: `'all'`

```js
Focus.configure({
  mode: 'deepest',
})
```

## ソースコード

[packages/extensions/focus/](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/focus/)
