# エディタを設定する

> 原文: [https://tiptap.dev/docs/editor/getting-started/configure](https://tiptap.dev/docs/editor/getting-started/configure)

Tiptap を設定するには、主に次の3つを指定します。
- どこにレンダリングするか（`element`）
  - **注**: React や Vue の連携パッケージを使う場合は不要です。
- どの機能を有効にするか（`extensions`）
- 最初のドキュメントに何を入れるか（`content`）

ほとんどの場合はこの設定で足りますが、ほかのオプションも設定できます。

## 設定を追加する

エディタを設定するには、次のように `Editor` クラスに[設定のオブジェクト](../api/editor.md)を渡します。

```js
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  // Tiptap を `.element` にバインドする
  element: document.querySelector('.element'),
  // 拡張機能を登録する
  extensions: [Document, Paragraph, Text],
  // 最初のコンテンツを設定する
  content: '<p>Example Text</p>',
  // 初期化後にカーソルをエディタ内に置く
  autofocus: true,
  // テキストを編集できるようにする（デフォルトは true）
  editable: true,
  // Tiptap に付属するデフォルトの ProseMirror の CSS を読み込まないようにする
  // この CSS には Tiptap が正しく動くために重要なスタイルが含まれるため、
  // ほとんどの場合は `true` のままにしておくべき
  injectCSS: false,
})
```

## ノード、マーク、拡張機能

編集機能の多くは、[ノード](../extensions/nodes/index.md)、[マーク](../extensions/marks/index.md)、[機能](../extensions/functionality/index.md)のいずれかとしてパッケージになっています。必要なものをインポートし、配列にしてエディタに渡します。

拡張機能を3つだけ使う、最小の構成は次のとおりです。

```js
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  element: document.querySelector('.element'),
  extensions: [Document, Paragraph, Text],
})
```

### 拡張機能を設定する

多くの拡張機能は `.configure()` メソッドで設定できます。具体的な設定を書いたオブジェクトを渡します。

たとえば見出しのレベルを 1、2、3 に絞るには、次のように [`Heading`](../extensions/nodes/heading.md) 拡張機能を設定します。

```js
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3],
    }),
  ],
})
```

設定できる項目は、各拡張機能のドキュメントを参照してください。

### よく使う拡張機能のセット

よく使う拡張機能をいくつか [`StarterKit`](../extensions/functionality/starterkit.md) にまとめています。使い方は次のとおりです。

```js
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [StarterKit],
})
```

オブジェクトを渡すと、[StarterKit](../extensions/functionality/starterkit.md) に含まれるすべての拡張機能を設定できます。特定の拡張機能を設定するには、その拡張機能の名前をキーにして設定を書きます。たとえば見出しのレベルを 1、2、3 に絞るには次のようにします。

```js
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
  ],
})
```

### StarterKit の一部の拡張機能を無効にする

[StarterKit](../extensions/functionality/starterkit.md) から特定の拡張機能を除くには、設定でその拡張機能を `false` にします。たとえば [`Undo/Redo History`](../extensions/functionality/undo-redo.md) 拡張機能を無効にするには次のようにします。

```js
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit.configure({
      undoRedo: false,
    }),
  ],
})
```

Tiptap の [`Collaboration`](../extensions/functionality/collaboration.md) には独自の履歴の拡張機能が付いています。これを使う場合は、衝突を避けるために [StarterKit](../extensions/functionality/starterkit.md) に含まれる `Undo/Redo History` 拡張機能を無効にしなければなりません。

### 追加の拡張機能

[StarterKit](../extensions/functionality/starterkit.md) には、すべての拡張機能が入っているわけではありません。エディタに機能を足すには、`extensions` 配列に並べます。たとえば [`Strike`](../extensions/marks/strike.md) 拡張機能を追加するには次のようにします。

```js
import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'

new Editor({
  extensions: [StarterKit, Strike],
})
```

## 次のステップ

- [エディタにスタイルを付ける](style-editor/index.md)
- [Tiptap の基本概念を詳しく知る](../core-concepts/introduction.md)
- [エディタの状態を永続化する方法を学ぶ](../core-concepts/persistence.md)
- [独自の拡張機能を作り始める](../extensions/custom-extensions/index.md)
