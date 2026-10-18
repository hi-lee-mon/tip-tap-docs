# 永続化

> 原文: [https://tiptap.dev/docs/editor/core-concepts/persistence](https://tiptap.dev/docs/editor/core-concepts/persistence)

エディタをセットアップして設定し、コンテンツを入れたら、次はエディタの内容をどう永続化するかが気になるはずです。
Tiptap は **HTML** か **JSON** を返せるので、コンテンツをデータベースや LocalStorage、あるいは sqlite や IndexedDB などの保存先に手軽に保存できます。

HTML でも保存できますし、レンダリングできるコンテンツを得るにはそれが一番簡単かもしれません。それでも、エディタの状態の永続化には JSON をおすすめします。JSON のほうが柔軟でパースしやすく、
必要なら別途 HTML パーサーを通さずに外部から編集できるからです。

## 状態を LocalStorage に永続化する

`localStorage` API を使えば、ブラウザ内にエディタの状態を永続化できます。LocalStorage でエディタのコンテンツを保存・復元する簡単な例を示します。

```js
// エディタのコンテンツを LocalStorage に保存する
localStorage.setItem('editorContent', JSON.stringify(editor.getJSON()))

// エディタのコンテンツを LocalStorage から復元する
const savedContent = localStorage.getItem('editorContent')
if (savedContent) {
  editor.setContent(JSON.parse(savedContent))
}
```

エディタの初期化時に localStorage からデータを読み込むこともできます。

```js
const savedContent = localStorage.getItem('editorContent')
const editor = new Editor({
  content: savedContent ? JSON.parse(savedContent) : '',
  extensions: [
    // ここに拡張機能を書く
  ],
})
```

## 状態をデータベースに永続化する

エディタの状態をデータベースに永続化する方法も、LocalStorage の場合と同じです。違いは、`localStorage` を使う代わりに JSON データをバックエンドの API に送る点だけです。

この例では、Fetch API を使って架空のエンドポイントにエディタのコンテンツを送ります。

```js
// エディタのコンテンツをデータベースに保存する
fetch('/api/editor/content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(editor.getJSON()),
})
```

データベースからエディタのコンテンツを復元するには、API からコンテンツを取得してエディタにセットします。

```js
// エディタのコンテンツをデータベースから復元する
fetch('/api/editor/content')
  .then(response => response.json())
  .then(data => {
    editor.setContent(data)
  })
  .catch(error => {
    console.error('Error fetching editor content:', error)
  })
```

## React でエディタの状態を復元する

React を使っているなら、`useEffect` フックを使ってコンポーネントのマウント時にエディタの状態を復元できます。LocalStorage の場合の例を示します。

```jsx
function MyEditor() {
  const content = useMemo(() => {
    const savedContent = localStorage.getItem('editorContent')
    return savedContent ? JSON.parse(savedContent) : ''
  }, [])

  const editor = useEditor({
    content,
    extensions: [
      // ここに拡張機能を書く
    ],
  })

  return (
    <div>
      <EditorContent editor={editor} />
      <button
        onClick={() => {
          // エディタのコンテンツを LocalStorage に保存する
          localStorage.setItem('editorContent', JSON.stringify(editor.getJSON()))
        }}
      >
        Save Content
      </button>
    </div>
  )
}
```

（訳注: 本文では `useEffect` フックと書かれていますが、例のコードでは `useMemo` を使っています。）
