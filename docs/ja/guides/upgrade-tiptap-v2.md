# Tiptap v2 から v3 へアップグレードする方法

> 原文: [https://tiptap.dev/docs/guides/upgrade-tiptap-v2](https://tiptap.dev/docs/guides/upgrade-tiptap-v2)

Tiptap v3 は破壊的変更を含むメジャーアップデートです。このガイドでは、Tiptap v2 のプロジェクトをバージョン 3 にアップグレードする手順を説明します。

## 破壊的変更

### パッケージの変更

- UMD ビルドを廃止しました（現在は tsup でビルドしています）

削除や名前変更があったパッケージもあるため、インポートと依存パッケージの更新が必要になる場合があります。よくある変更は次のとおりです。

```diff
Table packages
- import Table from '@tiptap/extension-table'
- import TableRow from '@tiptap/extension-table-row'
- import TableCell from '@tiptap/extension-table-cell'
- import TableHeader from '@tiptap/extension-table-header'
+ import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'

List packages
- import BulletList from '@tiptap/extension-bullet-list'
- import OrderedList from '@tiptap/extension-ordered-list'
- import ListItem from '@tiptap/extension-list-item'
- import ListKeymap from '@tiptap/extension-list-keymap'
- import TaskList from '@tiptap/extension-task-list'
- import TaskItem from '@tiptap/extension-task-item'
+ import { BulletList, OrderedList, ListItem, ListKeymap, TaskList, TaskItem } from '@tiptap/extension-list'

Extensions
- import Focus from '@tiptap/extension-focus'
- import Placeholder from '@tiptap/extension-placeholder'
- import History from '@tiptap/extension-history'
- import Dropcursor from '@tiptap/extension-dropcursor'
- import Gapcursor from '@tiptap/extension-gapcursor'
- import CharacterCount from '@tiptap/extension-character-count'
+ import { Focus, Placeholder, UndoRedo, Dropcursor, Gapcursor, CharacterCount } from '@tiptap/extensions'

CollaborationCursor
- import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
+ import CollaborationCaret from '@tiptap/extension-collaboration-caret'

Collaboration History
- import CollaborationHistory from '@tiptap-pro/extension-collaboration-history'
+ import Snapshot from '@tiptap-pro/extension-snapshot'

React Menus
- import { BubbleMenu, FloatingMenu } from '@tiptap/react'
+ import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'

Vue 3 Menus
- import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3'
+ import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'

Vue 2 Menus
- import { BubbleMenu, FloatingMenu } from '@tiptap/vue-2'
+ import { BubbleMenu, FloatingMenu } from '@tiptap/vue-2/menus'
```

### メニューの仕組み

浮かんで表示される要素はすべて、Tippy.js から Floating UI に置き換わりました。影響を受けるパッケージは次のとおりです。

- @tiptap/extension-bubble-menu
- @tiptap/extension-drag-handle
- @tiptap/extension-drag-handle-react
- @tiptap/extension-drag-handle-vue-2
- @tiptap/extension-drag-handle-vue-3
- @tiptap/extension-floating-menu
- @tiptap/extension-mention
- @tiptap/suggestion
- @tiptap-pro/extension-emoji

移行の例を示します。

```tsx
// 移行前
import { BubbleMenu } from '@tiptap/react'

const menu = <BubbleMenu tippyOptions={{ duration: 100 }}>{/* メニューの中身 */}</BubbleMenu>

// 移行後
import { BubbleMenu } from '@tiptap/react/menus'
import { offset } from '@floating-ui/dom'
const menu = (
  <BubbleMenu
    options={{
      offset: 6,
      placement: 'top',
    }}
  >
    {/* メニューの中身 */}
  </BubbleMenu>
)
```

- 新たに `@floating-ui/dom` が必須の依存パッケージになりました。次のコマンドでインストールします。

```bash
npm install @floating-ui/dom@^1.6.0
```

`tippy.js` を使っていた場合は、もう不要なのでアンインストールしてください。

```bash
npm uninstall tippy.js
```

### API の変更: テキストスタイルの更新

- `mergeNestedSpanStyles` のデフォルト値が `true` になりました
- テキストスタイルの拡張機能が新たに加わりました
  - `font-size`
  - `background-color`
  - `line-height`
- 複数の拡張機能をまとめて設定できる `TextStyleKit` API を追加しました

新しい `TextStyleKit` を使うと、設定が簡単になります。

```ts
import { TextStyleKit } from '@tiptap/extension-text-style'

new Editor({
  extensions: [
    TextStyleKit.configure({
      backgroundColor: {
        types: ['textStyle'],
      },
      color: {
        types: ['textStyle'],
      },
      fontFamily: {
        types: ['textStyle'],
      },
      fontSize: {
        types: ['textStyle'],
      },
      lineHeight: {
        types: ['textStyle'],
      },
    }),
  ],
})
```

### `shouldRerenderOnTransaction` の導入

`@tiptap/react` のエディタ設定に `shouldRerenderOnTransaction` が加わりました。コンポーネントを再レンダリングするかどうかを制御するオプションです。

3.0.0 より前は、トランザクションによって状態が更新されるたびにエディタが再レンダリングされていました。エディタオブジェクトを常に追跡しやすい反面、レンダリングのパフォーマンスを落とすおそれがありました。

`shouldRerenderOnTransaction` はデフォルトで無効です。有効にするには、エディタの設定で `shouldRerenderOnTransaction: true` を指定します。

アップグレード後、エディタの状態に依存する UI 要素が反応しなくなる場合があります。対処法は、このオプションを有効に戻す（パフォーマンスに影響するおそれがあります）か、次の例のように状態を手動で追跡するかのどちらかです。

```js
function MyEditor() {
  const [selection, setSelection] = useState({ from: 0, to: 0 });

  const editor = useEditor({
    // エディタの設定
    onTransaction({ transaction }) {
      setSelection({
        from: transaction.selection.from,
        to: transaction.selection.to,
      });
    },
  });
}
```

`useEditorState` を使って、状態全体を取り出したり、特定の値だけを選んで取り出したりもできます。

```js
const { currentSelection } = useEditorState({
  editor,
  selector: (snapshot) => {
    return { currentSelection: snapshot.editor.state.selection }
  },
})
```

これで、状態に依存する UI ロジックのために、状態を明示的に取り出して管理できます。

### コマンドの変更

- `clearContent` と `setContent` がデフォルトで update イベントを発行するようになりました
- `setContent` のシグネチャが (content, options) に変わりました
- `insertContent` の挙動が変わり、先頭でテキストノードを分割しないようになりました

### ノードビューの変更

NodeViewRendererProps の `getPos` 関数が `undefined` を返す場合があるようになりました。このケースを扱えるようにコードを更新してください。

```ts
// 移行前
const pos = nodeViewProps.getPos()

// 移行後
const pos = nodeViewProps.getPos()
if (pos !== undefined) {
  // pos を使う
}
```

### 削除された機能

- `editor.getCharacterCount()` メソッドを削除しました
- Placeholder 拡張機能から `considerAnyAsEmpty` オプションを削除しました

## 新機能

### Extensions パッケージ

新しい `@tiptap/extensions` パッケージには、複数のユーティリティ系拡張機能がまとめられています。

- [CharacterCount](../editor/extensions/functionality/character-count.md)
- [Dropcursor](../editor/extensions/functionality/dropcursor.md)
- [Gapcursor](../editor/extensions/functionality/gapcursor.md)
- [History](../editor/extensions/functionality/undo-redo.md)（`UndoRedo` に名前が変わりました）
- [Placeholder](../editor/extensions/functionality/placeholder.md)
- [TrailingNode](../editor/extensions/functionality/trailing-node.md)
- [Focus](../editor/extensions/functionality/focus.md)
- [Selection](../editor/extensions/functionality/selection.md)

これにより、プロジェクト内のインポートは自動的に更新されます。

移行の例を示します。

```diff
- import CharacterCount from '@tiptap/extension-character-count'
+ import { CharacterCount } from '@tiptap/extensions'
```

### サーバーサイドレンダリング

SSR のサポートを改善しました。レンダリングせずに、サーバーサイドでエディタを動かせます。

```ts
const editor = new Editor({
  element: null, // SSR を有効にする
  content: {
    type: 'doc',
    content: [
      /* ... */
    ],
  },
  extensions: [
    /* ... */
  ],
})
```

### マークビュー

[マークビュー](https://prosemirror.net/docs/ref/#view.MarkView)に対応しました。エディタ内のマークを、独自のビューでレンダリングできます。テキスト色のマークにカラーピッカーを付けたり、リンクのマークにリンク編集 UI を付けたりと、マーク専用の UI を表示したいときに便利です。

React と Vue 3 にも対応しています。

```ts
// プレーンな JS
import { Mark } from '@tiptap/core'

Mark.create({
  // ほかのオプション...
  addMarkView() {
    return ({ mark, HTMLAttributes }) => {
      const dom = document.createElement('b')
      const contentDOM = document.createElement('span')

      dom.appendChild(contentDOM)

      return {
        dom,
        contentDOM,
      }
    }
  },
})

// React
import { Mark } from '@tiptap/core'
import { ReactMarkViewRenderer } from '@tiptap/react'

Mark.create({
  // ... ほかのオプション
  addMarkView() {
    return ReactMarkViewRenderer(YourComponent)
  },
})

// Vue 3
import { Mark } from '@tiptap/core'
import { VueMarkViewRenderer } from '@tiptap/vue-3'

Mark.create({
  addMarkView() {
    return VueMarkViewRenderer(Component)
  },
})
```

### その他の改善

- 削除イベントを新たに追跡できるようになりました
- HTML のパースに happy-dom-without-node を使うようになりました
- ノードとマークの属性のバリデーションに対応しました
- トランザクション処理のパフォーマンスを改善しました

## StarterKit の更新

StarterKit に、次の拡張機能がデフォルトで含まれるようになりました。

- [Link](../editor/extensions/marks/link.md)
- [ListKeymap](../editor/extensions/functionality/listkeymap.md)
- [Underline](../editor/extensions/marks/underline.md)

これらを個別にインストールしていた場合は、削除してかまいません。

```diff
- import Link from '@tiptap/extension-link'
- import ListKeymap from '@tiptap/extension-list-keymap'
- import Underline from '@tiptap/extension-underline'
```

StarterKit の設定で拡張機能を無効にしていた場合は、その名前も更新してください。

```diff
const editor = new Editor({
  extensions: [
    StarterKit.configure({
-      history: false, // history を無効にする
+      undoRedo: false // 元に戻す／やり直すを無効にする（旧 history）
    })
  ]
})
```

## 移行の手順

1. 依存パッケージを更新する

   - UMD に依存したコードを取り除く
   - `@floating-ui/dom` をインストールする（バブルメニューとフローティングメニューで使う）
   - Tiptap のパッケージを v3 に更新する

2. メニューの実装を更新する

   - `tippyOptions` を Floating UI のオプションに置き換える
   - メニューのインポート元を `/menus` 付きのパスに変える

3. ノードビューの使い方を見直す

   - `getPos` が `undefined` を返す場合のチェックを追加する

4. 拡張機能を更新する

   - 該当するものは `@tiptap/extensions` に移行する
   - `StarterKit` と重複する拡張機能を削除する
   - テキストスタイルの設定を更新する

5. コマンドの使い方を見直す

   - `setContent` の呼び出しを新しいシグネチャに合わせる
   - デフォルトで update が発行されるようになった `clearContent` の挙動を確認する
