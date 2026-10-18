# サイズ変更できるノードビュー

> 原文: [https://tiptap.dev/docs/editor/api/resizable-nodeviews](https://tiptap.dev/docs/editor/api/resizable-nodeviews)

任意の HTMLElement（画像、iframe、動画など）を包み、設定可能なリサイズハンドルを付ける、フレームワークに依存しない小さな NodeView です。ユーザーの操作を処理し、最小・最大サイズの制約をかけ、必要に応じて縦横比を保ちます。また、ドラッグ中の更新と確定のタイミングでコールバックを呼び出します。

---

## サイズ変更できるノードビューとは

ResizableNodeView は ProseMirror / Tiptap と互換性のある NodeView で、次の機能を持ちます。

- 要素をコンテナとラッパーで包む
- 設定可能なリサイズハンドル（四隅と四辺）を付ける
- ドラッグ中は `onResize` を呼び続ける
- ユーザーがサイズ変更を終えたときに `onCommit` を 1 回だけ呼ぶ（新しい属性の保存にはこちらを使う）
- 最小・最大サイズの制約、縦横比の固定（設定または Shift キー）、クラス名のカスタマイズに対応する
- サイズ変更中は `data-resize-state` 属性と、必要に応じて `resizing` CSS クラスを付ける

---

## オプション

- `element: HTMLElement` — サイズ変更できるようにする要素（必須）
- `contentElement?: HTMLElement` — contentElement として使う HTML ノード（contenteditable なノード向け、省略可）
- `node: Node` — ProseMirror のノード（必須）
- `getPos: () => number | undefined` — ノードの位置を返す関数（保存に必須）
- `onResize?: (width: number, height: number) => void` — ドラッグ中に呼ばれ続ける（省略可）
- `onCommit: (width: number, height: number) => void` — ドラッグが終わったときに 1 回呼ばれる
- `onUpdate?: NodeView['update']` — ノード更新時のハンドラー（省略可）
- `options?: object` — 追加の設定（下記参照、省略可）

### `options` のプロパティ

- `directions?: ResizableNodeViewDirection[]`
  デフォルト: `['bottom-left', 'bottom-right', 'top-left', 'top-right']`
  指定できる値: `'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`

- `min?: Partial<{ width: number; height: number; }>`
  デフォルト: `{ width: 8, height: 8 }`（ピクセル）

- `max?: Partial<{ width: number; height: number; }>`
  デフォルト: `undefined`（上限なし）

- `preserveAspectRatio?: boolean`
  デフォルト: `false`
  `true` なら常に縦横比を保ちます。`false` なら、ドラッグ中に `Shift` を押している間だけ縦横比を保ちます。

- `className?: { container?: string; wrapper?: string; handle?: string; resizing?: string }`
  コンテナ、ラッパー、各ハンドルに付けるクラス名と、サイズ変更中に付けるクラス名です（省略可）。

---

## コールバック

- `onResize(width, height)`: ドラッグ中に、要素の見た目（style.width / height）を更新します。
- `onCommit(width, height)`: 最終的なサイズを保存します（例: `editor.commands.updateAttributes(...)`）。
- `onUpdate(node, decorations, innerDecorations)`: 更新を受け入れるなら `true`、ノードビューを作り直すなら `false` を返します。

`onCommit` の中でサイズを保存する例です。

```ts
const pos = getPos()
if (pos !== undefined) {
  editor.commands.updateAttributes('image', { width, height })
}
```

## 使用例

画像拡張機能のノードビューを最小限で書くと次のようになります。

```ts
// addNodeView() の中
return ({ node, getPos, HTMLAttributes }) => {
  const img = document.createElement('img')
  img.src = HTMLAttributes.src

  // サイズ以外の属性を要素にコピーする
  Object.entries(HTMLAttributes).forEach(([key, value]) => {
    if (value == null) return
    if (key === 'width' || key === 'height') return
    img.setAttribute(key, String(value))
  })

  // ResizableNodeView のインスタンスを作る
  return new ResizableNodeView({
    element: img,
    node,
    getPos,
    onResize: (w, h) => {
      img.style.width = `${w}px`
      img.style.height = `${h}px`
    },
    onCommit: (w, h) => {
      const pos = getPos()
      if (pos === undefined) return
      // 新しいサイズをノードに保存する
      editor.commands.updateAttributes('image', { width: w, height: h })
    },
    onUpdate: (updatedNode) => {
      if (updatedNode.type !== node.type) return false
      return true
    },
    options: {
      directions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      min: { width: 50, height: 50 },
      preserveAspectRatio: false, // Shift を押している間は縦横比を固定する
      className: {
        container: 'my-resize-container',
        wrapper: 'my-resize-wrapper',
        handle: 'my-resize-handle',
        resizing: 'is-resizing',
      },
    },
  })
}
```

### 注意点

- このクラスは見た目のスタイルを追加しません。`[data-resize-handle]` や `.is-resizing` などの CSS は自分で用意してください（デモには最小限のスタイルがあります）。
- 現時点では contentEditable なノードに完全には対応しておらず、中のコンテンツはサイズ変更されません。

---

## 動作の詳細とエッジケース

- 縦横比と制約: 縦横比を保つ設定のときは、先に最小・最大値に達した辺を制約値に合わせ、もう一方の辺を比率から計算します。縦横比は崩れません。
- Shift キー: `preserveAspectRatio` が `false` のとき、サイズ変更中に Shift を押すと一時的に縦横比が固定されます。

---

## 例

### サイズ変更できる画像

[デモを開く](https://embed.tiptap.dev/preview/Examples/ResizableImages)

### サイズ変更できるカスタムノード

[デモを開く](https://embed.tiptap.dev/preview/Examples/ResizableNodes)
