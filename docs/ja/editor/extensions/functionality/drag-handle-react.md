# Drag Handle React 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react](https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react)

React で作ったエディタで、ノードをドラッグして動かしたいと思ったことはありませんか。私たちもそう思ったので、そのための拡張機能を用意しました。

`DragHandleReact` コンポーネントを使うと、エディタ内でノードをドラッグする処理を手軽に扱えます。独自のレンダリング関数や配置なども指定できます。
中身は [DragHandle](drag-handle.md) 拡張機能を React コンポーネントで包んだもので、エディタへの拡張機能の登録と解除を自動で行います。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/DragHandle/)

## インストール

```bash
npm install @tiptap/extension-drag-handle-react @tiptap/extension-drag-handle @tiptap/extension-node-range @tiptap/extension-collaboration @tiptap/y-tiptap yjs y-protocols
```

## プロパティ

どのプロパティも [DragHandle](drag-handle.md) 拡張機能と同じ構造です。

### children

ドラッグハンドルの中に表示するコンテンツです。

```jsx
<DragHandle>
  <div>Drag Me!</div>
</DragHandle>
```

### computePositionConfig

floating-ui/dom パッケージでドラッグハンドルの位置を計算するときの設定です。[floating-ui のドキュメント](https://floating-ui.com/docs/computePosition)にあるオプションはどれでも渡せます。

デフォルト: `{ placement: 'left-start', strategy: 'absolute' }`

```jsx
<DragHandle
  computePositionConfig={{
    placement: 'left',
    strategy: 'fixed',
  }}
>
  <div>Drag Me!</div>
</DragHandle>
```

### onNodeChange

ノードにマウスが重なったときに、そのノードか null を返します。マウスが重なっているノードを強調表示するのに使えます。

デフォルト: `undefined`

```jsx
function Component() {
  const [selectedNode, setSelectedNode] = useState(null)

  return (
    <DragHandle
      onNodeChange={({ node, editor, pos }) => {
        setSelectedNode(node)
        // ノードを使って何か処理する
      }}
    >
      <div>Drag Me!</div>
    </DragHandle>
  )
}
```

### getReferencedVirtualElement

ドラッグハンドルの仮想要素を返す関数です。特定の DOM 要素を基準にメニューを配置したいときに便利です。

デフォルト: `undefined`

```jsx
<DragHandle
  getReferencedVirtualElement={() => {
    // 独自の配置に使う仮想要素を返す
    return null
  }}
>
  <div>Drag Me!</div>
</DragHandle>
```

### locked

ドラッグハンドルの位置と表示状態を固定します。表示されていた場合はロックを解除するまで表示されたまま、非表示だった場合はロックを解除するまで非表示のままになります。

デフォルト: `false`

```jsx
<DragHandle locked={true}>
  <div>Drag Me!</div>
</DragHandle>
```

### pluginKey

エディタにプラグインを保存するときに使うキーです。同じエディタで複数のドラッグハンドルを使う場合に役立ちます。

デフォルト: `undefined`

```jsx
<DragHandle pluginKey="myCustomDragHandle">
  <div>Drag Me!</div>
</DragHandle>
```

### onElementDragStart

要素のドラッグが始まったときに呼ばれる関数です。ドラッグ開始時に独自の処理を加えるのに使えます。

```jsx
<DragHandle
  onElementDragStart={(e: DragEvent) => {
    // ドラッグが始まったときの処理
  }}
>
  <div>Drag Me!</div>
</DragHandle>
```

### onElementDragEnd

要素のドラッグが終わったときに呼ばれる関数です。ドラッグ終了時に独自の処理を加えるのに使えます。

```jsx
<DragHandle
  onElementDragEnd={(e: DragEvent) => {
    // ドラッグが終わったときの処理
  }}
>
  <div>Drag Me!</div>
</DragHandle>
```

### nested

リスト項目や引用ブロックなど、入れ子になったコンテンツでもドラッグハンドルを使えるようにします。

有効にすると、最上位のブロックだけでなく、入れ子のブロックにもドラッグハンドルが表示されます。どのノードを対象にするかは、カーソルの位置と設定したルールをもとに、ルールベースの採点の仕組みで決まります。

デフォルト: `false`

```jsx
// デフォルトの設定で有効にする
<DragHandle nested={true}>
  <div>Drag Me!</div>
</DragHandle>

// 端の検出を独自に設定して有効にする
<DragHandle nested={{ edgeDetection: { threshold: -16 } }}>
  <div>Drag Me!</div>
</DragHandle>
```

#### 入れ子に対応した完全な例

```jsx
import DragHandle from '@tiptap/extension-drag-handle-react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

const NESTED_CONFIG = { edgeDetection: { threshold: -16 } }

export default function Editor() {
  const [nested, setNested] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<ul><li>Item 1</li><li>Item 2</li></ul>',
  })

  return (
    <>
      <button onClick={() => setNested(!nested)}>
        Toggle nested
      </button>
      <DragHandle editor={editor} nested={nested ? NESTED_CONFIG : false}>
        <div className="drag-handle" />
      </DragHandle>
      <EditorContent editor={editor} />
    </>
  )
}
```

> [!NOTE]
> **パフォーマンスのヒント**
>
> React の状態で `nested` プロパティを切り替える場合は、設定のオブジェクトをコンポーネントの外で定数として定義してください。不要な再レンダリングを防げます。

端の検出、独自のルール、許可するコンテナなど、設定の詳細は [DragHandle の入れ子のドキュメント](drag-handle.md#nested-drag-handle)を参照してください。

### コマンド

使えるエディタのコマンドは [DragHandle](drag-handle.md) 拡張機能を参照してください。
