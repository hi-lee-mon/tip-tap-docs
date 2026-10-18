# FloatingMenu 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/floatingmenu](https://tiptap.dev/docs/editor/extensions/functionality/floatingmenu)

Tiptap の Floating Menu 拡張機能を使うと、空の行にメニューを表示できます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/FloatingMenu)

> [!WARNING]
> React や Vue などのフレームワークを使っている場合は、この拡張機能ではなく、各フレームワーク用の `FloatingMenu` コンポーネントを使ってください。コンポーネントのほうが API が使いやすく、DOM 要素の扱いも任せられます。コンポーネントについて詳しくは、下の[フレームワークでの使い方](#usage-with-frameworks)の節を参照してください。

## 拡張機能をインストールする

Floating Menu 拡張機能と [Floating UI](https://floating-ui.com) ライブラリをインストールします。

```bash
npm install @tiptap/extension-floating-menu @floating-ui/dom@^1.6.0
```

## 設定

### element

メニューを入れる DOM 要素です。

型: `HTMLElement`

デフォルト: `null`

### updateDelay

`FloatingMenu` は `update` メソッドをデバウンスして、選択範囲が変わるたびにフローティングメニューが更新されないようにしています。この待ち時間はミリ秒単位で指定できます。
`FloatingMenuPlugin` のデフォルトの待ち時間は 250ms です。`0` を指定するとデバウンスが無効になります。

型: `Number`

デフォルト: `250`

### resizeDelay

`FloatingMenu` は resize イベントと scroll イベントのハンドラーをデバウンスして、そのたびにフローティングメニューが更新されないようにしています。この待ち時間はミリ秒単位で指定できます。

型: `Number`

デフォルト: `60`

### appendTo

DOM の中で、フローティングメニューを追加する先の要素です。`HTMLElement` か、`HTMLElement` を返すコールバック関数を指定できます。

型: `HTMLElement | (() => HTMLElement) | undefined`

デフォルト: `undefined`。この場合、メニューは `document.body` に追加されます。

### options

`FloatingMenu` は内部で [Floating UI](https://floating-ui.com) を使っています。このオプションで、フローティングメニューのミドルウェアと配置を制御できます。

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

デフォルト: `'floatingMenu'`

### shouldShow

メニューを表示するかどうかを決めるコールバックです。

型: `(props) => boolean`

## ソースコード

[packages/extension-floating-menu/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-floating-menu/)

## Vanilla JavaScript で使う

```js
import { Editor } from '@tiptap/core'
import FloatingMenu from '@tiptap/extension-floating-menu'

new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
    FloatingMenu.configure({
      element: document.querySelector('#floating-menu'),
    }),
  ],
  content: '<p>Click on an empty line to see the floating menu.</p>',
})
```

HTML にメニューの要素を追加します。

```html
<div id="floating-menu" style="display: none; position: absolute;">
  <button onclick="editor.chain().focus().toggleHeading({ level: 1 }).run()">H1</button>
  <button onclick="editor.chain().focus().toggleBulletList().run()">List</button>
</div>
<div id="editor"></div>
```

カーソルが空の行にあると、Tiptap がメニューの要素を自動的に表示し、位置を合わせます。

## フレームワークでの使い方

### React

`@tiptap/react` パッケージには `FloatingMenu` コンポーネントが含まれており、`@tiptap/react/menus` からインポートできます。機能は拡張機能と同じで、API が React で扱いやすい形になっています。このコンポーネントを使う場合は、エディタに `FloatingMenu` 拡張機能を追加する必要はありません。

```jsx
import { FloatingMenu } from '@tiptap/react/menus'

function MyFloatingMenu({ editor }) {
  return (
    <FloatingMenu editor={editor}>
      <button onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().setBulletList().run()}>
        List
      </button>
    </FloatingMenu>
  )
}
```

### Vue

`@tiptap/vue-3` パッケージには `FloatingMenu` コンポーネントが含まれており、`@tiptap/vue-3/menus` からインポートできます。機能は拡張機能と同じで、API が Vue で扱いやすい形になっています。このコンポーネントを使う場合は、エディタに `FloatingMenu` 拡張機能を追加する必要はありません。

```vue
<template>
  <FloatingMenu :editor="editor">
    <button @click="editor.chain().focus().setHeading({ level: 1 }).run()">
      H1
    </button>
    <button @click="editor.chain().focus().setBulletList().run()">
      List
    </button>
  </FloatingMenu>
</template>

<script setup>
  import { FloatingMenu } from '@tiptap/vue-3/menus'

  // FloatingMenu コンポーネントには、必ずエディタのインスタンスをプロパティとして渡す
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
FloatingMenu.configure({
  shouldShow: ({ editor, view, state, oldState }) => {
    // どの段落の中でもフローティングメニューを表示する
    return editor.isActive('paragraph')
  },
})
```

### 複数のメニュー

それぞれに別の `pluginKey` を指定すると、複数のメニューを使えます。

```js
import { Editor } from '@tiptap/core'
import FloatingMenu from '@tiptap/extension-floating-menu'

new Editor({
  extensions: [
    FloatingMenu.configure({
      pluginKey: 'floatingMenuOne',
      element: document.querySelector('.menu-one'),
    }),
    FloatingMenu.configure({
      pluginKey: 'floatingMenuTwo',
      element: document.querySelector('.menu-two'),
    }),
  ],
})
```

ProseMirror の `PluginKey` を渡すこともできます。

```js
import { Editor } from '@tiptap/core'
import FloatingMenu from '@tiptap/extension-floating-menu'
import { PluginKey } from '@tiptap/pm/state'

new Editor({
  extensions: [
    FloatingMenu.configure({
      pluginKey: new PluginKey('floatingMenuOne'),
      element: document.querySelector('.menu-one'),
    }),
    FloatingMenu.configure({
      pluginKey: new PluginKey('floatingMenuOne'),
      element: document.querySelector('.menu-two'),
    }),
  ],
})
```

### フローティングメニューの位置を強制的に更新する

最初のレンダリングのあとでフローティングメニューのサイズが変わっても、位置は自動では調整されません。位置を合わせ直すには、拡張機能に `pluginKey` を指定し、そのキーで `'updatePosition'` イベントを送って強制的に更新します。

```ts
FloatingMenu.configure({
  pluginKey: 'myFloatingMenu',
  element: document.querySelector('.menu'),
})

editor.commands.setMeta('myFloatingMenu', 'updatePosition')
```

特定のフローティングメニューだけを更新したい場合は、トランザクションのメタデータで `'updatePosition'` イベントを送り、そのメニューの `pluginKey` を使います。

```ts
FloatingMenu.configure({
  pluginKey: 'myFloatingMenu',
  element: document.querySelector('.menu'),
})
```

たとえば、フローティングメニューが複数ある場合は次のようにします。

```ts
editor.commands.setMeta('floatingMenuOne', 'updatePosition')
```

React や Vue の `FloatingMenu` コンポーネントで、外から `updatePosition` を送りたい場合は、まずコンポーネントに `pluginKey` プロパティを明示的に渡してください。`pluginKey` を省くと、コンポーネントは独自の ProseMirror `PluginKey` を作ります。このキーは、外のコードからあとで確実に参照できません。

### フローティングメニューをプログラムから表示・非表示にする

拡張機能に `pluginKey` を指定し、そのキーで `'show'` または `'hide'` のメタ値を持つトランザクションを送ると、フローティングメニューをプログラムから表示・非表示にできます。

```ts
// フローティングメニューを表示する
editor.commands.setMeta('myFloatingMenu', 'show')

// フローティングメニューを非表示にする
editor.commands.setMeta('myFloatingMenu', 'hide')
```

**注:** `'show'` や `'hide'` を送ると、`shouldShow` で決めた動作より優先されます。
