# アプリに Tiptap を高いパフォーマンスで組み込む

> 原文: [https://tiptap.dev/docs/guides/performance](https://tiptap.dev/docs/guides/performance)

[デモを開く](https://embed.tiptap.dev/preview/Examples/Book)

Tiptap はとても高速なエディタです（本を1冊まるごと編集することもできます）。パフォーマンスの問題にぶつかったとき、原因は Tiptap そのものではなく、アプリへの組み込み方にあることがよくあります。エディタを快適に動かすためのヒントを紹介します。

## React での Tiptap エディタの組み込み

[デモを開く](https://embed.tiptap.dev/preview/Examples/Performance?hideSource=true)

React で Tiptap を使うときによくあるパフォーマンスの問題は、エディタが頻繁に再レンダリングされすぎることです。原因はいくつかあります。

- `useEditor` フックは、初期設定では変更のたびにエディタを再レンダリングします。不要な再レンダリングを防ぐため、エディタ（とエディタに依存するもの）を別のコンポーネントに分離してください。
- エディタは、自分に影響しないレンダリングから切り離すべきです。たとえば、エディタとやり取りしないサイドバーがあるなら、別のコンポーネントにします。

幸い、こうした問題のほとんどは同じ方法で解決できます。エディタを別のコンポーネントに分離することです。次のように書きます。

推奨: エディタを別のコンポーネントに分離する

```jsx
import { EditorContent, useEditor } from '@tiptap/react'

const TiptapEditor = () => {
  const editor = useEditor({
    extensions,
    content,
  })

  return (
    <>
      <EditorContent editor={editor} />
      {/* エディタのインスタンスに依存するほかのコンポーネント */}
      <MenuComponent editor={editor} />
    </>
  )
}

export default TiptapEditor
```

非推奨: エディタをほかのコンポーネントと同じコンポーネントでレンダリングする

```jsx
import { EditorContent, useEditor } from '@tiptap/react'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const editor = useEditor({
    extensions,
    content,
  })

  return (
    <>
      <UnrelatedSidebar onChange={setSidebarOpen} />
      <EditorContent editor={editor} />
      <MenuComponent editor={editor} />
      <Sidenav isSidebarOpen={sidebarOpen}>
        <AnotherComponent />
      </Sidenav>
    </>
  )
}

export default App
```

このように関係のないコンポーネントがあると、エディタは必要以上に頻繁に再レンダリングされ、1回ごとのレンダリングも重くなります。

### パフォーマンスの問題を突き止める

React DevTools の Profiler を使うと、どのコンポーネントがなぜ再レンダリングされているかを確認できます。エディタのコンポーネントに `console.count('editor render')` を入れて、再レンダリングの回数を見る方法もあります。どのコンポーネントが不要な再レンダリングを起こしているかを特定する手がかりになります。

想定より頻繁に再レンダリングされている場合は、次の手順を試してください。

- エディタが親コンポーネントのせいでレンダリングされていないかを確認する
- 関係のない状態の変化からエディタを切り離す（たとえば、サイドバーを開いてもエディタが再レンダリングされないようにする）
- `useEditorState` を使い、エディタのコンポーネント内での不要な再レンダリングを防ぐ

これらのヒントが、パフォーマンスの問題を突き止めて直す助けになれば幸いです。

### `useEditorState` で不要な再レンダリングを防ぐ

`useEditorState` フックを使うと、エディタの状態の変化を購読し、必要なときだけ再レンダリングできます。エディタとそのコンポーネントの不要な再レンダリングを防ぐのに役立ちます。

```tsx
import { useEditor, useEditorState } from '@tiptap/react'

function Component() {
  const editor = useEditor({
    extensions,
    content,
  })

  const editorState = useEditorState({
    editor,
    // この関数はエディタの状態が変わるたびに呼ばれる
    selector: ({ editor }: { editor: Editor }) => ({
      // 太字か斜体の状態が変わったときだけ再レンダリングする
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
    }),
  })

  return (
    <>
      <EditorContent editor={editor} />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editorState.isBold ? 'primary' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editorState.isItalic ? 'primary' : ''}
      >
        Italic
      </button>
    </>
  )
}
```

`selector` 関数で、エディタの状態のどの部分を購読するかを指定します。初期設定では、前回選択した状態と深い比較を行い、変わったときだけ再レンダリングします。エディタの状態のどの部分でも選択でき、そこから新しい値を導き出すこともできます。

### レンダリングをより細かく制御する

Tiptap v2.5.0 以降では、`immediatelyRender` と `shouldRerenderOnTransaction` オプションでレンダリングをより細かく制御できます。エディタをすぐにレンダリングさせたくない場合や、トランザクションのたびにレンダリングさせたくない場合に役立ちます。

```tsx
import { useEditor } from '@tiptap/react'

function Component() {
  const editor = useEditor({
    extensions,
    content,
    /**
     * このオプションで、エディタをすぐにレンダリングする初期設定の挙動を有効にするかを制御できる。
     */
    immediatelyRender: true,
    /**
     * このオプションで、トランザクションのたびにエディタを再レンダリングする初期設定の挙動を無効にできる。
     */
    shouldRerenderOnTransaction: false,
  })

  return <EditorContent editor={editor} />
}
```

## React のノードビューのパフォーマンス

ノードビューを使うと、エディタ内のノードの代わりに独自のコンポーネントをレンダリングできます。これにより、エディタにどんな種類のコンテンツでも埋め込めます。ただし、React コンポーネントを使う場合は、パフォーマンスへの影響に注意してください。

技術的な理由から、ノードビューは同期的にレンダリングされることが前提になっています。Tiptap はノードビューごとに新しい要素を作り、その中に React コンポーネントをマウントします。この処理は重くなることがあり、エディタ全体にノードビューのインスタンスが多数ある場合は特にそうです。

Tiptap 側でもできるかぎり最適化していますが、ノードビューのレンダリングがパフォーマンスの問題を起こしている場合は、ノードビュー内のコンテンツのレンダリングに素の HTML 要素や別の方法を使うことを検討してください。

## React で `flushSync` の警告を避ける

React で Tiptap を使うと、コンソールに `flushSync was called from inside a lifecycle method` という警告が出ることがあります。

Tiptap はトランザクションを同期的にディスパッチします。Tiptap の[コールバックやイベントハンドラー](../editor/api/events.md)の中で React の state を直接更新すると、React がレンダリングサイクルの途中にいる場合があります。この警告は、React のレンダリング中のパフォーマンスの問題を防ぐために出ます。

これを直すには、警告を起こしているコードを見つけ、`queueMicrotask` で包みます。こうすると、更新は現在の同期処理が終わった直後に実行されるようスケジュールされ、React のレンダリングサイクルとの衝突を避けられます。

```tsx
import { useState } from 'react'
import { useEditor } from '@tiptap/react'

function Component() {
  const [state, setState] = useState([])

  const editor = useEditor({
    onUpdate() {
      queueMicrotask(() => setState('new state'))
    },
  })

  // ...
}
```
