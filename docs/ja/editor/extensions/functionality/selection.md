# Selection 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/selection](https://tiptap.dev/docs/editor/extensions/functionality/selection)

Selection 拡張機能は、エディタからフォーカスが外れたときに、現在の選択範囲へ CSS クラスを付けます。デフォルトでは `.selection` を付けますが、変更もできます。

付けるのはクラスだけなので、スタイルは自由に決めてください。下の使用例には、このクラス用の CSS も含まれています。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Selection)

## インストール

```bash
npm install @tiptap/extensions
```

続けて、エディタにインポートします。

```ts
import { Editor } from '@tiptap/core'
import { Selection } from '@tiptap/extensions'

new Editor({
  extensions: [Selection],
})
```

## 設定

### className

現在の選択範囲に付けるクラスです。

デフォルト: `'selection'`

```js
Selection.configure({
  className: 'selection',
})
```

## ソースコード

[packages/extensions/selection/](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/selection/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { Selection } from '@tiptap/extensions/selection'

new Editor({
  extensions: [Selection],
})
```
