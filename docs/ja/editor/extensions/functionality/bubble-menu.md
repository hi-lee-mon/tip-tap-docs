# BubbleMenu 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu](https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu)

この拡張機能は、テキストを選択したときに、選択範囲の近くにコンテキストメニューを表示します。ユーザーが選択したテキストに[マーク](../marks/index.md)を適用できるようにするために使います。

いつもどおり、マークアップとスタイルは自由に決められます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/BubbleMenu)

> [!WARNING]
> React や Vue などのフレームワークを使っている場合は、この拡張機能ではなく、各フレームワーク用の `BubbleMenu` コンポーネントを使ってください。コンポーネントのほうが API が使いやすく、DOM 要素の扱いも任せられます。コンポーネントについて詳しくは、下の[フレームワークでの使い方](#usage-with-frameworks)の節を参照してください。

## インストール

```bash
npm install @tiptap/extension-bubble-menu
```

## 設定

### element

メニューを入れる DOM 要素です。

型: `HTMLElement`

デフォルト: `null`

React 版の `Bubble Menu` では、`BubbleMenu` コンポーネントに [ref を渡し](https://react.dev/learn/manipulating-the-dom-with-refs)、その `ref` プロパティから DOM 要素にアクセスします。

### updateDelay

`BubbleMenu` は `update` メソッドをデバウンスして、選択範囲が変わるたびにバブルメニューが更新されないようにしています。この待ち時間はミリ秒単位で指定できます。
`BubbleMenuPlugin` のデフォルトの待ち時間は 250ms です。`0` を指定するとデバウンスが無効になります。

型: `Number`

デフォルト: `undefined`

### resizeDelay

`BubbleMenu` はバブルメニューのサイズ変更に伴う計算をデバウンスして、resize イベントのたびにバブルメニューが更新されないようにしています。この待ち時間はミリ秒単位で指定できます。

型: `Number`

デフォルト: `100`

### options

`BubbleMenu` は内部で [Floating UI](https://floating-ui.com) を使っています（訳注: 原文は動詞が抜けていますが、文脈から補っています）。このオプションで、フローティングメニューのミドルウェアと配置を制御できます。

型: `Object`

デフォルト: `{ strategy: 'absolute', placement: 'right' }`

| オプション | 型 | 説明 |
| --- | --- | --- |
| `strategy` | `string` | 配置の方式。[こちら](https://floating-ui.com/docs/computePosition#strategy)を参照 |
| `placement` | `string` | メニューの配置。[こちら](https://floating-ui.com/docs/computePosition#placement)を参照 |
| `offset` | `number`、`OffsetOptions` または `boolean` | [offset ミドルウェアのオプション](https://floating-ui.com/docs/offset#options)。`true` ならデフォルトのオプションを使い、`false` ならミドルウェアを無効にする |
| `flip` | `FlipOptions` または `boolean` | [flip ミドルウェアのオプション](https://floating-ui.com/docs/flip#options)。`true` ならデフォルトのオプションを使い、`false` ならミドルウェアを無効にする |
| `shift` | `ShiftOptions` または `boolean` | [shift ミドルウェアのオプション](https://floating-ui.com/docs/shift#options)。`true` ならデフォルトのオプションを使い、`false` ならミドルウェアを無効にする |
| `arrow` | `ArrowOptions` または `false` | [arrow ミドルウェアのオプション](https://floating-ui.com/docs/arrow#options)。`false` ならミドルウェアを無効にする |
| `size` | `SizeOptions` または `boolean` | [size ミドルウェアのオプション](https://floating-ui.com/docs/size#options)。`true` ならデフォルトのオプションを使い、`false` ならミドルウェアを無効にする |
| `autoPlacement` | `AutoPlacementOptions` または `boolean` | [autoPlacement ミドルウェアのオプション](https://floating-ui.com/docs/autoPlacement#options)。`true` ならデフォルトのオプションを使い、`false` ならミドルウェアを無効にする |
| `hide` | `HideOptions` または `boolean` | [hide ミドルウェアのオプション](https://floating-ui.com/docs/hide#options)。`true` ならデフォルトのオプションを使い、`false` ならミドルウェアを無効にする |
| `inline` | `InlineOptions` または `boolean` | [inline ミドルウェアのオプション](https://floating-ui.com/docs/inline#options)。`true` ならデフォルトのオプションを使い、`false` ならミドルウェアを無効にする |
| `onShow` | `Function` または `undefined` | メニューが表示されたときに呼ばれるコールバック。表示時に独自の処理やスタイルを加えるのに使える |
| `onHide` | `Function` または `undefined` | メニューが非表示になったときに呼ばれるコールバック。非表示時に独自の処理やスタイルを加えるのに使える |
| `onUpdate` | `Function` または `undefined` | メニューが更新されたときに呼ばれるコールバック。更新時に独自の処理やスタイルを加えるのに使える |
| `onDestroy` | `Function` または `undefined` | メニューが破棄されたときに呼ばれるコールバック。削除時に独自の処理やスタイルを加えるのに使える |

### pluginKey

内部で使う ProseMirror プラグインのキーです。複数のインスタンスを追加する場合は、それぞれ別のキーを指定してください。

型: `string | PluginKey`

デフォルト: `'bubbleMenu'`

### shouldShow

メニューを表示するかどうかを決めるコールバックです。

型: `(props) => boolean`

### appendTo

DOM の中で、バブルメニューを追加する先の要素です。`HTMLElement` か、`HTMLElement` を返すコールバック関数を指定できます。

型: `HTMLElement | (() => HTMLElement) | undefined`

デフォルト: `undefined`。この場合、メニューはエディタの親要素（`editor.view.dom.parentElement`）に追加されます。

### getReferencedVirtualElement

メニューの配置に使う基準の座標を返すコールバックです。[Floating UI](https://floating-ui.com/) が求める形の[仮想要素](https://floating-ui.com/docs/virtual-elements)を返してください。

型: `() => VirtualElement | null`

デフォルト: `null`。この場合、基準はエディタの選択範囲から決まります。

## ソースコード

[packages/extension-bubble-menu/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bubble-menu/)

## 拡張機能を使う

### JavaScript

```js
import { Editor } from '@tiptap/core'
import BubbleMenu from '@tiptap/extension-bubble-menu'

new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
    BubbleMenu.configure({
      element: document.querySelector('#bubble-menu'),
    }),
  ],
  content: '<p>Select some text to see the bubble menu.</p>',
})
```

HTML にメニューの要素を追加します。

```html
<div id="bubble-menu" style="display: none; position: absolute;">
  <button onclick="editor.chain().focus().toggleBold().run()">Bold</button>
  <button onclick="editor.chain().focus().toggleItalic().run()">Italic</button>
</div>
<div id="editor"></div>
```

テキストが選択されると、Tiptap がメニューの要素を自動的に表示し、位置を合わせます。

## フレームワークでの使い方

### React

`@tiptap/react` パッケージには `BubbleMenu` コンポーネントが含まれており、`@tiptap/react/menus` からインポートできます。機能は拡張機能と同じで、API が React で扱いやすい形になっています。このコンポーネントを使う場合は、エディタに `BubbleMenu` 拡張機能を追加する必要はありません。

```jsx
import { BubbleMenu } from '@tiptap/react/menus'

function MyBubbleMenu({ editor }) {
  return (
    <BubbleMenu editor={editor}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>
    </BubbleMenu>
  )
}
```

### Vue

`@tiptap/vue-3` パッケージには `BubbleMenu` コンポーネントが含まれており、`@tiptap/vue-3/menus` からインポートできます。機能は拡張機能と同じで、API が Vue で扱いやすい形になっています。このコンポーネントを使う場合は、エディタに `BubbleMenu` 拡張機能を追加する必要はありません。

```vue
<template>
  <BubbleMenu :editor="editor">
    <button @click="editor.chain().focus().toggleBold().run()">
      Bold
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()">
      Italic
    </button>
  </BubbleMenu>
</template>

<script setup>
  import { BubbleMenu } from '@tiptap/vue-3/menus'
  
  // BubbleMenu コンポーネントには、必ずエディタのインスタンスをプロパティとして渡す
  const { editor } = defineProps({
    editor: {
      type: Object,
      required: true,
    },
  })
</script>
```

**注**: 同じメニューは Tiptap の Vue 2 版にもあり、`@tiptap/vue-2/menus` からインポートできます。

### 独自のロジック

メニューを表示する条件は、`shouldShow` オプションで変えられます。コンポーネントの場合は、`shouldShow` をプロパティとして渡せます。

```js
BubbleMenu.configure({
  shouldShow: ({ editor, view, state, oldState, from, to }) => {
    // 画像とリンクのときだけバブルメニューを表示する
    return editor.isActive('image') || editor.isActive('link')
  },
})
```

### 複数のメニュー

それぞれに別の `pluginKey` を指定すると、複数のメニューを使えます。

```js
import { Editor } from '@tiptap/core'
import BubbleMenu from '@tiptap/extension-bubble-menu'

new Editor({
  extensions: [
    BubbleMenu.configure({
      pluginKey: 'bubbleMenuOne',
      element: document.querySelector('.menu-one'),
    }),
    BubbleMenu.configure({
      pluginKey: 'bubbleMenuTwo',
      element: document.querySelector('.menu-two'),
    }),
  ],
})
```

ProseMirror の `PluginKey` を渡すこともできます。

```js
import { Editor } from '@tiptap/core'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import { PluginKey } from '@tiptap/pm/state'

new Editor({
  extensions: [
    BubbleMenu.configure({
      pluginKey: new PluginKey('bubbleMenuOne'),
      element: document.querySelector('.menu-one'),
    }),
    BubbleMenu.configure({
      pluginKey: new PluginKey('bubbleMenuTwo'),
      element: document.querySelector('.menu-two'),
    }),
  ],
})
```

### バブルメニューの位置を強制的に更新する

最初のレンダリングのあとでバブルメニューのサイズが変わっても、位置は自動では調整されません。位置を合わせ直すには、拡張機能に `pluginKey` を指定し、そのキーで `'updatePosition'` イベントを送って強制的に更新します。

```ts
BubbleMenu.configure({
  pluginKey: 'myBubbleMenu',
  element: document.querySelector('.menu'),
})

editor.commands.setMeta('myBubbleMenu', 'updatePosition')
```

特定のバブルメニューだけを更新したい場合は、そのメニューの `pluginKey` を渡します。

```ts
editor.commands.setMeta('bubbleMenuOne', 'updatePosition')
```

React や Vue の `BubbleMenu` コンポーネントで、外から `updatePosition` を送りたい場合は、まずコンポーネントに `pluginKey` プロパティを明示的に渡してください。`pluginKey` を省くと、コンポーネントは独自の ProseMirror `PluginKey` を作ります。このキーは、外のコードからあとで確実に参照できません。

### バブルメニューをプログラムから表示・非表示にする

拡張機能に `pluginKey` を指定し、そのキーで `'show'` または `'hide'` のメタ値を持つトランザクションを送ると、バブルメニューをプログラムから表示・非表示にできます。

```ts
BubbleMenu.configure({
  pluginKey: 'myBubbleMenu',
  element: document.querySelector('.menu'),
})

// バブルメニューを表示する
editor.commands.setMeta('myBubbleMenu', 'show')

// バブルメニューを非表示にする
editor.commands.setMeta('myBubbleMenu', 'hide')
```

**注:** `'show'` や `'hide'` を送ると、`shouldShow` で決めた動作より優先されます。
